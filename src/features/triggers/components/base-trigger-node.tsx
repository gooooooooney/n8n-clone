"use client"

import { type NodeProps, Position } from "@xyflow/react";
import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import Image from "next/image";

interface BaseTriggerNodeProps extends NodeProps, React.PropsWithChildren {
  icon: LucideIcon | string;
  name: string;
  description?: string | ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(({
  icon: Icon,
  name,
  description,
  onSettings,
  onDoubleClick,
  children,
  ...nodeProps
}: BaseTriggerNodeProps) => {
  // TODO: implement delete functionality
  const handleDelete = () => { }
  return (
    <WorkflowNode
      showToolbar
      name={name}
      description={description}
      onDelete={handleDelete}
      onSettings={onSettings}
    >

      <BaseNode
        className="rounded-l-2xl relative group"
        onDoubleClick={onDoubleClick}
      >
        <BaseNodeContent>
          {
            typeof Icon === "string" ? (
              <Image src={Icon} alt={`${name} icon`} width={16} height={16} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )
          }
          {children}

          <BaseHandle
            id="source-1"
            type="source"
            position={Position.Right}
          />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
});

BaseTriggerNode.displayName = "BaseTriggerNode";