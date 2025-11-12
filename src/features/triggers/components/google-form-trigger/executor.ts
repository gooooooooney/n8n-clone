import type { NodeExecutor } from "@/features/executions/type";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFromTriggerData = any

export const googleTriggerExecutor: NodeExecutor<GoogleFromTriggerData> = async ({ nodeId, context, step, publish }) => {
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )

    //  Wait for the google trigger to be completed
    const result = await step.run("google-form-trigger", async () => context)
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result
}