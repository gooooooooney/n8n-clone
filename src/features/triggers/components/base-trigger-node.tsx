"use client"

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import Image from "next/image";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps, React.PropsWithChildren {
  icon: LucideIcon | string;
  name: string;
  description?: string | ReactNode;
  status?: NodeStatus
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
  status = 'initial',
  id,
  ...nodeProps
}: BaseTriggerNodeProps) => {

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
      <NodeStatusIndicator
        status={status}
        variant="border"
        className="rounded-l-2xl"
      >
        <BaseNode
          status={status}
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
      </NodeStatusIndicator>
    </WorkflowNode>
  );
});

BaseTriggerNode.displayName = "BaseTriggerNode";