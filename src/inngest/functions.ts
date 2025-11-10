import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { topologicaSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { NodeType } from "@/generated/prisma";
const google = createGoogleGenerativeAI()
const deepseek = createDeepSeek()

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {
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
      })
    }

    return {
      workflowId,
      result: context
    }
  },
);
