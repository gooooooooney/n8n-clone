"use client"
import { EntityContainer, EntityHeader } from "@/components/entity-components"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows()

  return (
    <div className="flex flex-1 justify-center items-center">
      {
        JSON.stringify(workflows.data, null, 2)
      }
    </div>
  )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow()
  const router = useRouter()
  const { modal, handleError } = useUpgradeModal()

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`)
      },
      onError: (error) => {
        handleError(error)
      }
    })
  }
  return (
    <>
      <EntityHeader
        title="Workflows"
        description="Create and Manage your workflows"
        newButtonLabel="New Workflow"
        disabled={disabled}
        onNew={handleCreate}
        isCreating={createWorkflow.isPending}
      />
      {modal}
    </>
  )
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  )
}