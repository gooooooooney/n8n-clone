import type { NodeExecutor } from "@/features/executions/type";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import fetch from 'node-fetch';
import { decode } from "html-entities";
import { slackChannel } from "@/inngest/channels/slack";
Handlebars.registerHelper("json", (ctx) => {
    const jsonString = JSON.stringify(ctx, null, 2)
    const safeString = new Handlebars.SafeString(jsonString)
    return safeString
})

type SlackData = {
    variableName?: string
    webhookUrl?: string
    content?: string
}

export const slackExecutor: NodeExecutor<SlackData> = async ({
    data, nodeId, context, step, publish
}) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.variableName) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Slack node: Variable name is missing")
    }
    if (!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Slack node: message content is missing")
    }
    if (!data.webhookUrl) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Slack node: webhookUrl is required")
    }

    const rawContent = Handlebars.compile(data.content)(context)

    const content = decode(rawContent)




    try {
        const result = await step.run("slack-webhook", async () => {
            await fetch(data.webhookUrl!, {
                method: "POST",
                body: JSON.stringify({
                    content,
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
            slackChannel().status({
                nodeId,
                status: "success"
            })
        )

        return result

    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error
    }
}