"use client"

import { useRouter } from "next/navigation"
import { CredentialType, Execution, ExecutionStatus, type Credential } from "@/generated/prisma"
import { formatDistanceToNow } from "date-fns"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, ErrorView, LoadingView } from "@/components/entity-components"
import Image from "next/image"
import { useSuspenseExecutions } from "../hooks/use-executions"
import { useExecutionsParams } from "../hooks/use-executions-params"
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react"


export const ExecutionsList = () => {
  const executions = useSuspenseExecutions()

  return (
    <EntityList
      items={executions.data.items}
      getKey={(item) => item.id}
      renderItem={(execution) => (
        <ExecutionItem execution={execution} />
      )}
      emptyView={<ExecutionsEmptyView />}
    />
  )
}

export const ExecutionHeader = ({ disabled }: { disabled?: boolean }) => {

  return (
    <EntityHeader
      title="Executions"
      description="View your workflow execution history"
    />
  )
}

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<ExecutionHeader />}
      pagination={<ExecutionPagination />}
    >
      {children}
    </EntityContainer>
  )
}

export const ExecutionPagination = () => {
  const executions = useSuspenseExecutions()
  const [params, setParams] = useExecutionsParams()

  const handlePageChange = (newPage: number) => {
    setParams({
      ...params,
      page: newPage
    })
  }
  return (
    <EntityPagination
      page={params.page}
      totalPages={executions.data.totalPages}
      disabled={executions.isFetching}
      onPageChange={handlePageChange}
    />
  )
}


export const ExecutionsLoadingView = () => {
  return <LoadingView message="Loading Executions..." />
}

export const ExecutionsErrorView = () => {
  return <ErrorView message="Error loading Executions." />
}

export const ExecutionsEmptyView = () => {

  return (
    <>
      <EmptyView
        message="You haven't created any executions yet. Get started by running your first workflow." />
    </>
  )
}


export const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />
  }
}

export const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export const ExecutionItem = ({ execution }: {
  execution: Execution & {
    workflow: {
      id: string
      name: string
    }
  }
}) => {

  const duration = execution.completedAt
    ? Math.round(
      ((new Date(execution.completedAt).getTime()) - (new Date(execution.startedAt).getTime())) / 1000,
    )
    : null

  const subtitle = (
    <>
      {execution.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s</>}
    </>
  )

  return (
    <EntityItem
      title={formatStatus(execution.status)}
      href={`/executions/${execution.id}`}
      subtitle={subtitle}
      image={
        <div className="size-8  flex items-center justify-center">
          {getStatusIcon(execution.status)}
        </div>
      }
    />
  )
}