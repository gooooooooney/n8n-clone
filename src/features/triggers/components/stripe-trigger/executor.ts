import type { NodeExecutor } from "@/features/executions/type";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

type StripeFromTriggerData = any

export const stripeTriggerExecutor: NodeExecutor<StripeFromTriggerData> = async ({ nodeId, context, step, publish }) => {
    await publish(
        stripeTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )

    const result = await step.run("stripe-trigger", async () => context)
    await publish(
        stripeTriggerChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result
}
