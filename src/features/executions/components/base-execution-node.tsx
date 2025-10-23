"use client"

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import Image from "next/image";

interface BaseExecutionNodeProps extends NodeProps, React.PropsWithChildren {
  icon: LucideIcon | string;
  name: string;
  description?: string | ReactNode;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(({
  icon: Icon,
  name,
  description,
  onSettings,
  onDoubleClick,
  children,
  id,
  ...nodeProps
}: BaseExecutionNodeProps) => {
  const { setNodes, setEdges } = useReactFlow()
  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }
  return (
    <WorkflowNode
      showToolbar
      name={name}
      description={description}
      onDelete={handleDelete}
      onSettings={onSettings}
    >

      <BaseNode
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
            id="target-1"
            type="target"
            position={Position.Left}
          />
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

BaseExecutionNode.displayName = "BaseExecutionNode";