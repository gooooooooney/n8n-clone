"use client"
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";


type HttpRequestNodeData = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  [key: string]: unknown;
  body?: string
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;


export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();

  const handleSubmit = (values: HttpRequestFormValues) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id === props.id) {
        return {
          ...n,
          data: {
            ...n.data,
            endpoint: values.endpoint,
            method: values.method,
            body: values.body,
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

  const nodeStatus = "initial"


  return (
    <>

      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultEndpoint={nodeData.endpoint} // TODO check if it can be improved by just sending initialValues={nodeData}
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
        onSubmit={handleSubmit}
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