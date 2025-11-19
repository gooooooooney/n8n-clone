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
import { deepseekChannel } from "./channels/deepseek";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
import { ExecutionStatus } from "@/generated/prisma";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,
    onFailure: async ({ event, step }) => {
      return prisma.execution.update({
        where: {
          inngestEventId: event.data.event.id,
        },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack
        }
      })
    }
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
      deepseekChannel(),
      discordChannel(),
      slackChannel(),
    ]
  },
  async ({ event, step, publish }: Context & { publish: Realtime.PublishFn }) => {

    const inngestEventId = event.id

    const workflowId = event.data.workflowId

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or Workflow ID is required")
    }

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        }
      })
    })

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        include: { nodes: true, connections: true }
      })

      return topologicaSort(workflow.nodes, workflow.connections)
    })

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId
        },
        select: {
          userId: true
        }
      })
      return workflow.userId
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
        userId,
      })

      await step.run("update-execution", async () => {
        return prisma.execution.update({
          where: {
            inngestEventId,
            workflowId,
          },
          data: {
            status: ExecutionStatus.SUCCESS,
            completedAt: new Date(),
            output: context,
          }
        })
      })
    }

    return {
      workflowId,
      result: context
    }
  },
);
