"use client"
import type { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";


type HttpRequestNodeData = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  [key: string]: unknown;
  body?: string
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;


export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data
  const description = nodeData.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` : "Not configured";



  return (
    <>
      <BaseExecutionNode
        {...props}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={() => { }}
        onDoubleClick={() => { }}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";