import type { NodeExecutor } from "@/features/executions/type";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky"

type HttpRequestData = {
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string
}

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data, nodeId, context, step
}) => {
    //  TODO: Publish "loading" state from the http request node

    if (!data.endpoint) {
        // TODO: Publish "error" state for http request
        throw new NonRetriableError("HTTP Request node: No endpoint configured")
    }

    // const result = await step.fetch(data.endpoint)

    //  Wait for the http request to be completed
    const result = await step.run("http-request", async () => {
        const method = data.method || "GET"

        const endpoint = data.endpoint

        const options: KyOptions = {
            method,
        }

        if (["POST", "PUT", "PATCH"].includes(method)) {
            options.body = data.body;
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type")

        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        }
    })

    return result
}