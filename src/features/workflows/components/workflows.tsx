"use client"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"

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
      search={<WorkflowSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  )
}

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowsParams()

  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams })
  return (
    <EntitySearch
      placeholder="Search Workflows..."
      value={searchValue}
      onChange={onSearchChange}
    />
  )
}

export const WorkflowPagination = () => {
  const workflows = useSuspenseWorkflows()
  const [params, setParams] = useWorkflowsParams()

  const handlePageChange = (newPage: number) => {
    setParams({
      ...params,
      page: newPage
    })
  }
  return (
    <EntityPagination
      page={params.page}
      totalPages={workflows.data.totalPages}
      disabled={workflows.isFetching}
      onPageChange={handlePageChange}
    />
  )
}