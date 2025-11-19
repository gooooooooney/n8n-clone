"use server"
import { deepseekChannel } from "@/inngest/channels/deepseek"
import { inngest } from "@/inngest/client"
import { getSubscriptionToken, type Realtime } from "@inngest/realtime"

export type GeminiToken = Realtime.Token<
    typeof deepseekChannel,
    ["status"]
>

export async function fetchDeepseekRealtimeToken(): Promise<GeminiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: deepseekChannel(),
        topics: ["status"]
    })

    return token
}