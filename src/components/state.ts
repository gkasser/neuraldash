import { writable, get } from 'svelte/store'
import type { Point, ILayer, INode } from './types'
import { GraphApi } from './graphApi'

export const graphApi = new GraphApi()
export const targetLayout = graphApi.targetLayout



export const mapOffset = writable<Point>({
    x: 300,
    y: 50,
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

setTimeout(initGraph, 1000)

setInterval(() => {
    const ns = get(targetLayout).layers

    if (ns.length == 0) return
    const n1 = ns[Math.floor(Math.random() * ns.length)]


    graphApi.addLayerAfter(
        {
            name: "dlkfldkf",
            params: {}
        }, n1.nodeId)
}, 1000)