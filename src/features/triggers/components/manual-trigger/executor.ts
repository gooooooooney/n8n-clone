import type { NodeExecutor } from "@/features/executions/type";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = any

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({ nodeId, context, step, publish }) => {
    await publish(
        manualTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )

    //  Wait for the manual trigger to be completed
    const result = await step.run("manual-trigger", async () => context)
    await publish(
        manualTriggerChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result
}