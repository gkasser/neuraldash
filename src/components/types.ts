
export type IBlock = {
    type: string
    params: any[]
}

export type INode = {
    id: string,
    name: string,
    data: IBlock,
}

export type IEdge = {
    from: string,
    to: string,
}

export type ITree = {
    nodes: INode[],
    edges: IEdge[],
}

