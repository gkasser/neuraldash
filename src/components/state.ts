import { writable } from 'svelte/store'
import type { IBlock, IEdge, ITree, INode } from './types'

export const position = writable([0])

const currentAvailableId = writable<number>(0)
export const getId = () => {
    let id = 0
    currentAvailableId.update(i => {
        id = i
        return i + 1
    })
    return id.toString()
}

const nodeState = writable<INode[]>([])
const edgeState = writable<IEdge[]>([])

export const addNode = (block: IBlock) => {
    const id = getId()
    const node: INode = {
        id,
        data: block,
        name: ''
    }

    nodeState.update((ns) => {
        ns.push(node)
        return ns
    })

    return id
}

export const addEdge = (block: IBlock) => {
    const id = getId()
    const node: IEdge = {
        id,
        data: block,
        name: ''
    }

    nodeState.update((ns) => {
        ns.push(node)
        return ns
    })
}

export const tree = writable<ITree>({
    nodes: [

    ],
    edges: [

    ]

})

export type panels = 'navigation' | 'params' | 'search'

export const activeBlock = writable<{ position: panels }>({ position: 'navigation' })

export const pendingBlock = writable<IBlock | undefined>()
