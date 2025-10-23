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
  const nodeData = props.data as HttpRequestNodeData
  const description = nodeData.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` : "Not configured";
  const endpoint = nodeData.endpoint;
  const method = nodeData.method || "GET";
  const headers = nodeData.headers || {};
  const body = nodeData.body || null;


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