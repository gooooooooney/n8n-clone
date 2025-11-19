"use client"

import { createId } from "@paralleldrive/cuid2"
import { useReactFlow } from "@xyflow/react"
import {
  GlobeIcon,
  LucideIcon,
  MousePointerIcon
} from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NodeType } from "@/generated/prisma"
import { Separator } from "./ui/separator"
import { useCallback } from "react"
import { toast } from "sonner"
import { set } from "zod"


export type NodeTypeOption = {
  type: NodeType
  label: string
  description: string
  icon: LucideIcon | string
}


const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Runs the flow on clicking the trigger button",
    icon: MousePointerIcon
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a Google Form is submitted",
    icon: "/logos/googleform.svg"
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs the flow when a Stripe Event is captured",
    icon: "/logos/stripe.svg"
  },
]

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request to a specified URL",
    icon: GlobeIcon
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Uses Google Gemini to generate text",
    icon: "/logos/gemini.svg"
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Uses OpenAI to generate text",
    icon: "/logos/openai.svg"
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Uses Anthropic to generate text",
    icon: "/logos/anthropic.svg"
  },
  {
    type: NodeType.DEEPSEEK,
    label: "Deepseek",
    description: "Uses Deepseek to generate text",
    icon: "/logos/deepseek.svg"
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a message to discord",
    icon: "/logos/discord.svg"
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send a message to Slack",
    icon: "/logos/slack.svg"
  },
]

interface NodeSelectorProps extends React.PropsWithChildren {
  open: boolean
  onOpenChange: (open: boolean) => void

}

export const NodeSelector = ({
  open,
  onOpenChange,
  children
}: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback((nodeOption: NodeTypeOption) => {
    // check if trigger node already exists
    if (nodeOption.type === NodeType.MANUAL_TRIGGER) {
      const nodes = getNodes()
      const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER)
      if (hasManualTrigger) {
        toast.error("Only one Manual Trigger node is allowed per workflow.")
        return
      }
    }

    setNodes((nds) => {
      const hasInitialNode = nds.some((node) => node.type === NodeType.INITIAL);
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const flowPosition = screenToFlowPosition({
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
      })

      const newNode = {
        id: createId(),
        type: nodeOption.type,
        position: flowPosition,
        data: {}
      }
      if (hasInitialNode) {
        return [newNode]
      }

      return [
        ...nds,
        newNode
      ]
    })
    onOpenChange(false)
  }, [setNodes, getNodes, onOpenChange, screenToFlowPosition]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What trigger do you want to add?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts the workflow.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          {triggerNodes.map((nodeOption) => {
            const Icon = nodeOption.icon;
            return (
              <div
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                key={nodeOption.type}
                onClick={() => handleNodeSelect(nodeOption)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {
                    typeof nodeOption.icon === "string" ? (
                      <img
                        src={nodeOption.icon}
                        alt={nodeOption.label}
                        className="size-5 object-contain rounded-sm"
                      />
                    ) : (
                      <Icon className="size-5" />
                    )
                  }
                  <div className="flex items-start text-left flex-col overflow-hidden">
                    <p className="font-medium text-sm">{nodeOption.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{nodeOption.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
          <Separator />
          {executionNodes.map((nodeOption) => {
            const Icon = nodeOption.icon;
            return (
              <div
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                key={nodeOption.type}
                onClick={() => handleNodeSelect(nodeOption)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {
                    typeof nodeOption.icon === "string" ? (
                      <img
                        src={nodeOption.icon}
                        alt={nodeOption.label}
                        className="size-6 flex-shrink-0"
                      />
                    ) : (
                      <Icon className="size-6 flex-shrink-0" />
                    )
                  }
                  <div className="flex items-start text-left flex-col overflow-hidden">
                    <p className="font-medium text-sm">{nodeOption.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{nodeOption.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}