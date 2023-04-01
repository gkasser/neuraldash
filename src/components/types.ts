
export type INode = {
    height: number
    label: string
    width: number
    x: number
    y: number
}

export type IEdge = {
    from: string,
    to: string,
    label: string
}

export type ILayer = {
    nodeId: string,
    name: string,
    params: { [name: string]: any }
}

export type IArrow = {
    edgeId: string,
    text: string,
}
