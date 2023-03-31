import { writable } from 'svelte/store'
import type { IBlock } from './types'
import dagre from 'dagre'


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

let lastLayout = getLayout()


export const currentLayout = writable(lastLayout)
export const targetLayout = writable(lastLayout)

let lastId = "0"

export const addNode = (block: IBlock) => {
    const id = getId()

    g.setNode(id, { label: block.label, width: 144, height: 100 })

    const l = getLayout()
    currentLayout.set(l)

    lastId = id
    return id
}

export const addEdge = (blockId1: string, blockId2: string, label: string) => {
    const id = getId()

    g.setEdge(blockId1, blockId2)

    const l = getLayout()
    currentLayout.set(l)


    return id
}




export type panels = 'navigation' | 'params' | 'search'

export const activeBlock = writable<{ position: panels }>({ position: 'navigation' })

export const pendingBlock = writable<IBlock | undefined>()

export const selectedIds = writable<string[]>([])


const initGraph = () => {
    const block1: IBlock = {
        label: "Input",

    }
    const block2: IBlock = {
        label: "Conv2D",

    }

    const blockId1 = addNode(block1)
    const blockId2 = addNode(block2)

    const edgeId = addEdge(blockId1, blockId2, 'Arrow')

    selectedIds.set([edgeId])
}

setTimeout(initGraph, 50)

// setInterval(() => {
//     let l = lastId
//     let n = addNode({
//         label: "dsds",

//     })

//     addEdge(l, n, 'lskdsd')
// }, 3000)