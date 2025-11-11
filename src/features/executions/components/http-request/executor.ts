import type { NodeExecutor } from "@/features/executions/type";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky"
import Handlebars from "handlebars"
import fetch, { type RequestInit } from 'node-fetch';

Handlebars.registerHelper("json", (ctx) => {
    const jsonString = JSON.stringify(ctx, null, 2)
    const safeString = new Handlebars.SafeString(jsonString)
    return safeString
})

type HttpRequestData = {
    variableName: string
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data, nodeId, context, step,
}) => {
    //  TODO: Publish "loading" state from the http request node

    if (!data.endpoint) {
        // TODO: Publish "error" state for http request
        throw new NonRetriableError("HTTP Request node: No endpoint configured")
    }
    if (!data.variableName) {
        // TODO: Publish "error" state for http request
        throw new NonRetriableError("HTTP Request node: Variable name not configured")
    }
    if (!data.method) {
        // TODO: Publish "error" state for http request
        throw new NonRetriableError("HTTP Request node: Method name not configured")
    }

    // const result = await step.fetch(data.endpoint)

    //  Wait for the http request to be completed
    const result = await step.run("http-request", async () => {
        const method = data.method
        const endpoint = Handlebars.compile(data.endpoint)(context)

        const options: RequestInit = {
            method,
        }

        if (["POST", "PUT", "PATCH"].includes(method)) {
            const resolved = Handlebars.compile(data.body || "{}")(context)
            JSON.parse(resolved)

            options.body = resolved;
            options.headers = {
                "Content-Type": "application/json"
            }
        }

        // TODO: something wrong with ky post. just don't get response. use node-fetch instaed ky for now.
        const response = await fetch(endpoint, options);

        const contentType = response.headers.get("content-type")

        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

        const reponsePayload = {

            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        }



        return {
            ...context,
            [data.variableName]: reponsePayload
        }
    })

    return result
}