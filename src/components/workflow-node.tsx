"use client"
import { NodeToolbar, Position } from "@xyflow/react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";


interface WorkflowNodeProps extends React.PropsWithChildren {
  showToolbar?: boolean
  onDelete?: () => void
  onSettings?: () => void
  name?: string
  description?: string | ReactNode
}

export const WorkflowNode = ({
  showToolbar,
  onDelete,
  onSettings,
  name,
  description,
  children
}: WorkflowNodeProps) => {
  return (
    <>
      {
        showToolbar && (
          <NodeToolbar
          >
            <Button size="sm" variant="ghost" onClick={onSettings} >
              <SettingsIcon className="size-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} >
              <TrashIcon className="size-4" />
            </Button>
          </NodeToolbar>
        )
      }
      {children}
      {
        !!name &&
        (
          <NodeToolbar
            position={Position.Bottom}
            isVisible
            className="max-w-[200px] text-center">
            <p className="font-medium">
              {name}
            </p>
            {description &&
              (
                <p className="text-sm truncate text-muted-foreground">
                  {description}
                </p>
              )
            }
          </NodeToolbar >
        )
      }
    </>
  )
}