import type { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText } from "ai"
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { deepseekChannel } from "@/inngest/channels/deepseek";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (ctx) => {
    const jsonString = JSON.stringify(ctx, null, 2)
    const safeString = new Handlebars.SafeString(jsonString)
    return safeString
})

type DeepseekData = {
    variableName?: string
    credentialId?: string
    userPrompt?: string
    systemPrompt?: string
}

export const deepseekExecutor: NodeExecutor<DeepseekData> = async ({
    data, nodeId, context, step, publish, userId
}) => {
    await publish(
        deepseekChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Deepseek node: Variable name is missing")
    }
    if (!data.userPrompt) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Deepseek node: userPrompt is missing")
    }
    if (!data.credentialId) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Deepseek node: credentialId is required")
    }


    const credential = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId,
                userId
            }
        })
    })

    if (!credential) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Deepseek node: credential not found")
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant."
    const userPrompt = Handlebars.compile(data.userPrompt)(context)


    const deepseek = createDeepSeek({
        apiKey: decrypt(credential.value),
    })

    try {
        const { steps } = await step.ai.wrap(
            "deepseek-generate-text",
            generateText,
            {
                model: deepseek("deepseek-chat"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                }
            }
        )

        const text =
            steps[0].content[0].type === "text"
                ? steps[0].content[0].text : ""


        await publish(
            deepseekChannel().status({
                nodeId,
                status: "success"
            })
        )

        return {
            ...context,
            [data.variableName]: {
                text,
            }
        }
    } catch (error) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}