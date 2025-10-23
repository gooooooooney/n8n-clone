"use client"
import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";


export const ManualTriggerNode = memo((props: NodeProps) => {

  const [open, setOpen] = useState(false);

  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointer2Icon}
        name="When clicking 'Execut workflow'"
      // status={nodeStatus}
      // onSettings={() => { }}
      // onDoubleClick={() => { }}
      />
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";