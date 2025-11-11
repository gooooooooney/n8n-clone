import type { Realtime } from "@inngest/realtime";
import type { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown> | undefined | null

export type SetpTools = GetStepTools<Inngest.Any>

export type NodeExecutorParams<TData = Record<string, unknown>> = {
   data: TData
   nodeId: string
   context: WorkflowContext
   step: SetpTools
   publish: Realtime.PublishFn

}

export type NodeExecutor<TData = Record<string, unknown>> = (params: NodeExecutorParams<TData>) => Promise<WorkflowContext> 