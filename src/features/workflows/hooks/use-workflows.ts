import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useWorkflowsParams } from "./use-workflows-params"

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC()
  const [params] = useWorkflowsParams()
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

export const useCreateWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" created successfully!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`)
      }
    })
  )

}

export const useRemoveWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" removed successfully!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }))
      },
      onError: (error) => {
        toast.error(`Failed to remove workflow: ${error.message}`)
      }
    })
  )
}


export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }))
}

export const useUpdateWorkflowName = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated successfully!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }))
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`)
      }
    })
  )

}
export const useUpdateWorkflow = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" saved successfully!`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }))
      },
      onError: (error) => {
        toast.error(`Failed to saved workflow: ${error.message}`)
      }
    })
  )

}