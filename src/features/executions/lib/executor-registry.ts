import { NodeType } from "@/generated/prisma/client";
import { NodeExecutor } from "../type";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: async ({ data, nodeId, context, step }) => {
        return context
    },
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
}

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type]
    if (!executor) {
        throw new Error(`No executor found for type: ${type}`)
    }
    return executor
}