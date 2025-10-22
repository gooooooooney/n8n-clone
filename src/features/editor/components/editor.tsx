"use client"
import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows"

export const EditorLoading = () => {
  return <LoadingView message="Loading workflow editor..." />
}

export const EditorErrorView = () => {
  return <ErrorView message="Failed to load workflow editor." />
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId)

  return (
    <div>
      <pre>
        {JSON.stringify(workflow, null, 2)}
      </pre>
      {/* Add more editor UI components here */}
    </div>
  )
}