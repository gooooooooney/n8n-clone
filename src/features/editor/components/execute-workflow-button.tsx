"use client"

import { Button } from "@/components/ui/button"
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows"
import { FlaskConicalIcon } from "lucide-react"

export const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const executeWorkHook = useExecuteWorkflow()

  const handleExecute = () => {
    executeWorkHook.mutate({
      id: workflowId
    })
  }
  return (
    <Button size="lg" onClick={handleExecute} disabled={executeWorkHook.isPending} >
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  )
}