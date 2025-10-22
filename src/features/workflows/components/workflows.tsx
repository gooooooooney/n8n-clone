"use client"
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import type { Workflow } from "@/generated/prisma"
import { WorkflowIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components"


export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows()

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(item) => item.id}
      renderItem={(workflow) => (
        <WorkflowItem workflow={workflow} />
      )}
      emptyView={<WorkflowsEmptyView />}
    />
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


export const WorkflowsLoadingView = () => {
  return <LoadingView message="Loading workflows..." />
}

export const WorkflowsErrorView = () => {
  return <ErrorView message="Error loading workflows." />
}

export const WorkflowsEmptyView = () => {
  const createWorkflow = useCreateWorkflow()
  const router = useRouter()
  const { handleError, modal } = useUpgradeModal()

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
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any workflows yet. Get started by creating your first workflow." />
      {modal}
    </>
  )
}


export const WorkflowItem = ({ workflow }: { workflow: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    return removeWorkflow.mutateAsync({ id: workflow.id });
  }

  return (
    <EntityItem
      title={workflow.name}
      href={`/workflows/${workflow.id}`}
      subtitle={
        <>
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })} {" "}
          &bull; Created{" "}
          {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8  flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  )
}