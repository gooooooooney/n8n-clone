"use client"

import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/node-selector";

export const AddNodeButton = memo(() => {
  const [open, setOpen] = useState(false);
  return (
    <NodeSelector
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        variant="outline"
        className="bg-background"
        onClick={() => { }}
      >
        <PlusIcon />

      </Button>
    </NodeSelector>
  )
})

AddNodeButton.displayName = "AddNodeButton";