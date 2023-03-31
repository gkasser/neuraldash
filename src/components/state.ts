import { derived, writable } from 'svelte/store'
import type { IBlock, IEdge, ITree, INode } from './types'
import { t } from 'svelte-canvas'

export const times = writable([0, 0])

t.subscribe((_time) => {
    times.update((vals) => {
        const seconds = _time / 1000
        return [seconds, seconds - vals[0]]
    })
})

export const time = derived(times, ($times) => {
    return $times[0]
})

export const deltaTime = derived(times, ($times) => {
    return $times[1]
})

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

export const addEdge = (blockId1: string, blockId2: string, label: string) => {
    const id = getId()
    const edge: IEdge = {
        id,
        from: blockId1,
        to: blockId2,
        label
    }

    edgeState.update((ns) => {
        ns.push(edge)
        return ns
    })

    return id
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

const initGraph = () => {
    const block1: IBlock = {
        type: "Input",
        params: {

        }
    }
    const block2: IBlock = {
        type: "Conv2D",
        params: {

        }
    }



}