import type { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { NonRetriableError } from "inngest";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (ctx) => {
    const jsonString = JSON.stringify(ctx, null, 2)
    const safeString = new Handlebars.SafeString(jsonString)
    return safeString
})

type AnthropicData = {
    variableName?: string
    credentialId?: string
    userPrompt?: string
    systemPrompt?: string
}

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
    data, nodeId, context, step, publish, userId,
}) => {
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Anthropic node: Variable name is missing")
    }
    if (!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Anthropic node: userPrompt is missing")
    }

    if (!data.credentialId) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Anthropic node: credentialId is required")
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
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Anthropic node: credential not found")
    }


    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant."
    const userPrompt = Handlebars.compile(data.userPrompt)(context)

    const anthropic = createAnthropic({
        apiKey: decrypt(credential.value),
    })

    try {
        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic("claude-3-5-haiku-20241022"),
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
            anthropicChannel().status({
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
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}