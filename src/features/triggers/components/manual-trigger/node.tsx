"use client"
import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";


export const ManualTriggerNode = memo((props: NodeProps) => {

  const [open, setOpen] = useState(false);

  const handleOpenSettings = () => {
    setOpen(true);
  }
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken
  })

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointer2Icon}
        name="When clicking 'Execut workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";