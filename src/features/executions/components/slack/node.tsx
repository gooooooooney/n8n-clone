"use client"
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackRealtimeToken } from "./actions";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";
import { SlackDialog, SlackFormValues } from "./dialog";


type SlackNodeData = {
  webhookUrl?: string
  content?: string
  username?: string
}

type SlackNodeType = Node<SlackNodeData>;


export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken
  })

  const handleSubmit = (values: SlackFormValues) => {
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

      <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon="/logos/slack.svg"
        name="Slack"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";