import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCredentialsParams } from "./use-credentials-params"
import { CredentialType } from "@/generated/prisma"

export const useSuspenseCredentials = () => {
  const trpc = useTRPC()
  const [params] = useCredentialsParams()
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
}

export const useCreateCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created successfully!`)
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`)
      }
    })
  )

}

export const useRemoveCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed successfully!`)
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
        queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({ id: data.id }))
      },
      onError: (error) => {
        toast.error(`Failed to remove Credential: ${error.message}`)
      }
    })
  )
}


export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC()
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }))
}

export const useUpdateCredential = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved successfully!`)
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}))
        queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({ id: data.id }))
      },
      onError: (error) => {
        toast.error(`Failed to saved Credential: ${error.message}`)
      }
    })
  )

}

export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC()

  return useQuery(trpc.credentials.getByType.queryOptions({ type }))
}
