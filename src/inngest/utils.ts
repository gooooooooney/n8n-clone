import { Connection, Node } from "@/generated/prisma";
import toposort  from "toposort";

export const topologicaSort = (nodes: Node[], connections: Connection[]): Node[] => {
    // if no connections, return the nodes in the order they were added
    if (connections.length === 0) {
        return nodes
    }

    // Create edges array for toposort
    const edges: [string, string][] = connections.map((connection) => [connection.fromNodeId, connection.toNodeId])

    // Add nodes with no connections as self-edges to ensure they're included
    const connectedNodeIds = new Set<string>()
    for (const conn of connections) {
        connectedNodeIds.add(conn.fromNodeId)
        connectedNodeIds.add(conn.toNodeId)
    }

    // Add nodes with no connections as self-edges to ensure they're included
    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id])
        }
    }

    // Sort the nodes topologically
    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges)
        // Remove duplicates (from self-edges)
        sortedNodeIds = [...new Set(sortedNodeIds)]
    } catch (error) {
      if (error instanceof Error && error.message.includes("Cyclic")) {
        throw new Error("Workflow contains a cyclic dependency")
      }
      throw error
    }

    // Map the sorted node IDs to the nodes
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))
    return sortedNodeIds.map((nodeId) => nodeMap.get(nodeId)!).filter(Boolean)
}