import type { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NonRetriableError } from "inngest";
import { openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (ctx) => {
    const jsonString = JSON.stringify(ctx, null, 2)
    const safeString = new Handlebars.SafeString(jsonString)
    return safeString
})

type OpenAIData = {
    variableName?: string
    userPrompt?: string
    credentialId?: string
    systemPrompt?: string
}

export const openaiExecutor: NodeExecutor<OpenAIData> = async ({
    data, nodeId, context, step, publish
}) => {
    await publish(
        openaiChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("OpenAI node: Variable name is missing")
    }
    if (!data.userPrompt) {
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("OpenAI node: userPrompt is missing")
    }

    if (!data.credentialId) {
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("GemiOpenAIni node: credentialId is required")
    }


    const credential = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId
            }
        })
    })

    if (!credential) {
        throw new NonRetriableError("OpenAI node: credential not found")
    }


    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant."
    const userPrompt = Handlebars.compile(data.systemPrompt)(context)

    const credentialValue = process.env.OPENAI_API_KEY!

    const openai = createOpenAI({
        apiKey: credentialValue,
    })

    try {
        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("gpt-4.1-mini"),
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
            openaiChannel().status({
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
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}