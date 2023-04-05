export type Point = { x: number; y: number }

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
    params: {
        type: "int" | "float" | "string" | "bool" | "tuple" | "Any"
        name: string
        doc: string
        value: any
    }[]
}

export type IArrow = {
    edgeId: string,
    fromId: string,
    toId: string,
}


export interface IDrawLayer extends Point, ILayer {
    width: number,
    height: number
}
export interface IDrawArrow extends IArrow {
    points: Point[]
}