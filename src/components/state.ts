import { derived, writable, get } from 'svelte/store'
import type { IBlock } from './types'
import dagre from 'dagre'
import { deltaTime } from './time'

const DEFAULT_ANIMATION_TIME = 3

const currentAvailableId = writable<number>(0)
const getId = () => {
    let id = 0
    currentAvailableId.update(i => {
        id = i
        return i + 1
    })
    return id.toString()
}


const g = new dagre.graphlib.Graph()
g.setGraph({})
g.setDefaultEdgeLabel(function () { return {} })


const getLayout = () => {
    dagre.layout(g)
    return {
        nodes: g.nodes().map(nId => g.node(nId)),
        edges: g.edges().map(eId => g.edge(eId))
    }
}


export const targetLayout = writable(getLayout())

export const currentNodes = writable(get(targetLayout).nodes)

export const currentEdges = writable(get(targetLayout).edges)

export const targetNodes = derived(targetLayout, ($cl) => {
    return $cl.nodes
})

export const targetEdges = derived(targetLayout, ($cl) => {
    return $cl.edges
})

export const timeToMove = writable(0)

deltaTime.subscribe((dt) => {
    if (get(timeToMove) <= 0) return
    timeToMove.update((ttm) => ttm - dt)

    const currentNs = get(currentNodes)
    const currentEs = get(currentEdges)

    const targetNs = get(targetNodes)
    const targetEs = get(targetEdges)

    targetNs.forEach((node) => {
        // Find missing nodes
        let equivalent = currentNs.find((n) => n.label == node.label)
        if (!equivalent) {
            equivalent = { ...node, x: -300, y: 300 }
            currentNs.push(equivalent)
        }

        equivalent.x += (node.x - equivalent.x) * 4. * dt
        equivalent.y += (node.y - equivalent.y) * 4. * dt
    })

    currentNodes.set(currentNs)


})


export const addNode = (b: IBlock) => {
    const id = getId()

    g.setNode(id, { label: id, width: b.width, height: b.height })

    targetLayout.set(getLayout())

    timeToMove.set(DEFAULT_ANIMATION_TIME)

    return id
}

export const addEdge = (blockId1: string, blockId2: string) => {
    const id = getId()

    g.setEdge(blockId1, blockId2)

    timeToMove.set(DEFAULT_ANIMATION_TIME)

    targetLayout.set(getLayout())


    return id
}




export type panels = 'navigation' | 'params' | 'search'

export const activeBlock = writable<{ position: panels }>({ position: 'navigation' })

export const pendingBlock = writable<IBlock | undefined>()

export const selectedIds = writable<string[]>([])


const initGraph = () => {
    const block1: IBlock = {
        label: "Input",
        width: 150,
        height: 100,

    }
    const block2: IBlock = {
        label: "Conv2D",
        width: 150,
        height: 100,
    }

    const blockId1 = addNode(block1)
    const blockId2 = addNode(block2)

    const edgeId = addEdge(blockId1, blockId2, 'Arrow')

    selectedIds.set([edgeId])
}

setTimeout(initGraph, 50)

setInterval(() => {
    const nId = addNode({
        width: 150,
        height: 100,
        label: 'ksdd'
    })

    const ns = get(currentNodes)
    const n1 = ns[Math.floor(Math.random() * ns.length)]

    addEdge(n1.label, nId)
}, 3000)