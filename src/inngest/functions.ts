import { inngest } from "./client";
import { Context, NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { topologicaSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { Realtime } from "@inngest/realtime";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openaiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      anthropicChannel(),
    ]
  },
  async ({ event, step, publish }: Context & { publish: Realtime.PublishFn }) => {

    const workflowId = event.data.workflowId

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is required")
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        include: { nodes: true, connections: true }
      })

      return topologicaSort(workflow.nodes, workflow.connections)
    })

    //  Initialize the context with any initial data from the trigger
    let context = event.data.initialData || {}

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type)
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      })
    }

    return {
      workflowId,
      result: context
    }
  },
);
