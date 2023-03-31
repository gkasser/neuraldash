
export type IBlock = {
    height: number
    label: string
    width: number
    x: number
    y: number
}

export type INode = {
    id: string,
    name: string,
    data: IBlock,
}

export type IEdge = {
    id: string,
    from: string,
    to: string,
    label?: string
}

export type ITree = {
    nodes: INode[],
    edges: IEdge[],
}

