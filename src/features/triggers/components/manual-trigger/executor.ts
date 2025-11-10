import type { NodeExecutor } from "@/features/executions/type";

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({  nodeId, context, step }) => {
    //  TODO: Publish "loading" state from the manual trigger node

    //  Wait for the manual trigger to be completed
    const result = await step.run("manual-trigger", async () => context)

    return result
}