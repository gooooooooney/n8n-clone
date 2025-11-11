"use client"
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchHttpRequestRealtimeToken } from "./actions";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request";


type HttpRequestNodeData = {
  variableName?: string
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: string
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;


export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: HTTP_REQUEST_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchHttpRequestRealtimeToken
  })

  const handleSubmit = (values: HttpRequestFormValues) => {
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
  const description = nodeData.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` : "Not configured";



  return (
    <>

      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";