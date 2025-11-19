"use client"
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";
import { DiscordDialog, DiscordFormValues, } from "./dialog";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";


type DiscordNodeData = {
  webhookUrl?: string
  content?: string
  username?: string
}

type DiscordNodeType = Node<DiscordNodeData>;


export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken
  })

  const handleSubmit = (values: DiscordFormValues) => {
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
  const description = nodeData.content ? `Send: ${nodeData.content.slice(0, 50)}...` : "Not configured";



  return (
    <>

      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon="/logos/discord.svg"
        name="Discord"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";