import type { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { discordChannel } from "@/inngest/channels/discord";
import { NonRetriableError } from "inngest";
import fetch, { type RequestInit } from 'node-fetch';
import { decode } from "html-entities"
import ky from "ky";
Handlebars.registerHelper("json", (ctx) => {
    const jsonString = JSON.stringify(ctx, null, 2)
    const safeString = new Handlebars.SafeString(jsonString)
    return safeString
})

type DiscordData = {
    variableName?: string
    webhookUrl?: string
    content?: string
    username?: string
}

export const discordExecutor: NodeExecutor<DiscordData> = async ({
    data, nodeId, context, step, publish
}) => {
    await publish(
        discordChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("discord node: Variable name is missing")
    }
    if (!data.content) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("discord node: message content is missing")
    }
    if (!data.webhookUrl) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("discord node: webhookUrl is required")
    }

    const rawContent = Handlebars.compile(data.content)(context)

    const content = decode(rawContent)

    const username = data.username ?
        decode(Handlebars.compile(data.username)(context))
        : undefined




    try {
        const result = await step.run("discord-webhook", async () => {
            await fetch(data.webhookUrl!, {
                method: "POST",
                body: JSON.stringify({
                    content: content.slice(0, 2000),
                    username,
                })
            })
            return {
                ...context,
                [data.variableName!]: {
                    messageContent: content
                }
            }
        })


        await publish(
            discordChannel().status({
                nodeId,
                status: "success"
            })
        )

        return result

    } catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}