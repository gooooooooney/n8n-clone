"use client"
import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";
import { fetchStripeTriggerRealtimeToken } from "./actions";


export const StripeTriggerNode = memo((props: NodeProps) => {

  const [open, setOpen] = useState(false);

  const handleOpenSettings = () => {
    setOpen(true);
  }
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken
  })

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon="/logos/stripe.svg"
        name="Stripe"
        description="When stripe event is captured"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <StripeTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";