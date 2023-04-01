import { writable, get } from 'svelte/store'
import type { ILayer, INode } from './types'
import { deltaTime } from './time'
import { GraphApi } from './graphApi'

export const graphApi = new GraphApi()
export const targetLayout = graphApi.targetLayout


export const currentLayers = writable(get(graphApi.layers))
export const currentArrows = writable(get(graphApi.arrows))

// export const targetNodes = derived(targetLayout, ($cl) => {
//     return $cl.nodes
// })

// export const targetEdges = derived(targetLayout, ($cl) => {
//     return $cl.edges
// })

export const timeToMove = writable(0)

deltaTime.subscribe((dt) => {
    if (get(timeToMove) <= 0) return
    timeToMove.update((ttm) => ttm - dt)

    const currentNs = get(currentLayers)
    const currentEs = get(currentArrows)

    const targetNs = get(targetLayout).nodes
    const targetEs = get(targetLayout).edges

    targetNs.forEach((node) => {
        // Find missing nodes
        let equivalent = currentNs.find((n) => n.label == node.label)
        if (!equivalent) {
            equivalent = { ...node }
            currentNs.push(equivalent)
        }

        equivalent.x += (node.x - equivalent.x) * 4. * dt
        equivalent.y += (node.y - equivalent.y) * 4. * dt
    })

    currentLayers.set(currentNs)
})





export type panels = 'navigation' | 'params' | 'search'

export const activeBlock = writable<{ position: panels }>({ position: 'navigation' })

export const pendingBlock = writable<INode | undefined>()

export const selectedIds = writable<string[]>([])

const newLayer = (name: string, params: any = {}): Omit<ILayer, 'nodeId'> => {
    return {
        name,
        params
    }
}

const initGraph = () => {
    const block1 = newLayer("Input")
    const block2 = newLayer("Conv2D")
    const id1 = graphApi.addLayer(block1)
    graphApi.addLayerAfter(block2, id1)
}

setTimeout(initGraph, 50)

setInterval(() => {
    const nId = addNode({
        width: 150,
        height: 100,
        label: 'ksdd'
    })

    const ns = get(currentLayers)
    const n1 = ns[Math.floor(Math.random() * ns.length)]

    addEdge(n1.label, nId)
}, 3000)