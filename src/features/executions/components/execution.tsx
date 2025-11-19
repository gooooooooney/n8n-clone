"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,

} from "@/components/ui/collapsible";
import { ExecutionStatus } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSuspenseExecution } from "../hooks/use-executions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatStatus, getStatusIcon } from "./executions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseExecution(executionId)
  const [showStackTrace, setShowStackTrace] = useState(false)

  const duration = execution.completedAt
    ? Math.round(
      ((new Date(execution.completedAt).getTime()) - (new Date(execution.startedAt).getTime())) / 1000,
    )
    : null

  return (
    <Card className="shadow-noe">
      <CardHeader>
        <div className="flex items-center gap-3">
          {
            getStatusIcon(execution.status)
          }
        </div>
        <CardTitle>
          {formatStatus(execution.status)}
        </CardTitle>
        <CardDescription>
          Execution for {execution.workflow.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workflow
            </p>
            <Link prefetch href={`workflows/${execution.workflowId}`} >
              {execution.workflow.name}
            </Link>
          </div>


          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{formatStatus(execution.status)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-sm">{formatDistanceToNow(execution.startedAt, { addSuffix: true })}</p>
          </div>

          {
            execution.completedAt ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-sm">{formatDistanceToNow(execution.completedAt, { addSuffix: true })}</p>
              </div>
            )
              : null
          }

          {
            duration !== null ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-sm">{duration}s</p>
              </div>
            )
              : null
          }

          <div>
            <p className="text-sm font-medium text-muted-foreground">Event ID</p>
            <p className="text-sm">{execution.inngestEventId}</p>
          </div>


        </div>
        {
          execution.error ? (
            <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm font-mono text-red-800">{execution.error}</p>

              </div>

              {
                execution.errorStack && (
                  <Collapsible
                    open={showStackTrace}
                    onOpenChange={setShowStackTrace}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-900 hover:bg-red-100"
                      >
                        {
                          showStackTrace
                            ? "Hide stack trace"
                            : "Show stack trace"
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <pre className="text-xs font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100 rounded">
                        {
                          execution.errorStack
                        }
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                )
              }
            </div>
          )
            : null
        }
        {
          execution.output && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">
                Output
              </p>
              <pre className="text-xs font-mono overflow-auto">
                {
                  JSON.stringify(execution.output, null, 2)
                }
              </pre>
            </div>
          )
        }
      </CardContent>

    </Card >
  )
}