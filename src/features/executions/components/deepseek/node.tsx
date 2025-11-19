"use client"
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDeepseekRealtimeToken } from "./actions";
import { DeepseekDialog, DeepseekFormValues } from "./dialog";
import { DEEPSEEK_CHANNEL_NAME } from "@/inngest/channels/deepseek";


type DeepseekNodeData = {
  variableName?: string
  // model?: any
  userPrompt?: string
  systemPrompt?: string
}

type DeepseekNodeType = Node<DeepseekNodeData>;


export const DeepseekNode = memo((props: NodeProps<DeepseekNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DEEPSEEK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDeepseekRealtimeToken
  })

  const handleSubmit = (values: DeepseekFormValues) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id === props.id) {
        return {
          ...n,
          data: {
            ...n.data,
            ...values,
          }
        }
      }
      return n;
    }));
  }


  const handleOpenSettings = () => {
    setDialogOpen(true);
  }

  const nodeData = props.data
  const description = nodeData.userPrompt ? `deepseek-chat: ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured";



  return (
    <>

      <DeepseekDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon="/logos/deepseek.svg"
        name="Deepseek"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DeepseekNode.displayName = "DeepseekNode";