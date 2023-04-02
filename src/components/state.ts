import { writable, get } from 'svelte/store'
import type { Point, ILayer, INode } from './types'
import { deltaTime, timeToMove } from './time'
import { GraphApi } from './graphApi'

export const graphApi = new GraphApi()
export const targetLayout = graphApi.targetLayout


export const currentLayers = writable(get(graphApi.targetLayout).layers)
export const currentArrows = writable(get(graphApi.targetLayout).arrows)

export const mapOffset = writable<Point>({
    x: 300,
    y: 50,
})

deltaTime.subscribe((dt) => {
    if (get(timeToMove) <= 0) return
    timeToMove.update((ttm) => ttm - dt)

    let currentNs = get(currentLayers)
    let currentAs = get(currentArrows)

    const targetNs = get(targetLayout).layers
    const targetAs = get(targetLayout).arrows

    targetNs.forEach((node) => {
        // Find missing layers
        let equivalent = currentNs.find((n) => n.nodeId == node.nodeId)
        if (!equivalent) {
            equivalent = { ...node, x: 0, y: 0 }
            currentNs.push(equivalent)
        }
        if (node.x - equivalent.x == 0 && node.y - equivalent.y == 0) return

        equivalent.x += (node.x - equivalent.x) * 4. * dt
        equivalent.y += (node.y - equivalent.y) * 4. * dt
    })

    targetAs.forEach((arrow) => {
        // Find missing arrows
        const currentindex = currentAs.findIndex((n) => n.edgeId == arrow.edgeId)
        let equivalent = currentAs[currentindex]
        if (!equivalent) {
            equivalent = { ...arrow, points: arrow.points.map(() => { return { x: 0, y: 0 } }) }
            currentAs.push(equivalent)
        }
        if (arrow.points[0].x - equivalent.points[0].x == 0 && arrow.points[0].y - equivalent.points[0].y == 0) return

        arrow.points.map((p, idx) => {
            if (equivalent && arrow.points.length == equivalent.points.length) {
                equivalent.points[idx].x += (arrow.points[idx].x - equivalent.points[idx].x) * 4. * dt
                equivalent.points[idx].y += (arrow.points[idx].y - equivalent.points[idx].y) * 4. * dt
            }
        })
        currentAs[currentindex] = equivalent
    })

    // remove unused layers
    currentNs = currentNs.filter(node => !!targetNs.find(t => t.nodeId == node.nodeId))
    // remove unused arrows
    currentAs = currentAs.filter(node => !!targetAs.find(t => t.edgeId == node.edgeId))

    currentLayers.set(currentNs)
    currentArrows.set(targetAs)
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
    const ns = get(currentLayers)

    if (ns.length == 0) return
    const n1 = ns[Math.floor(Math.random() * ns.length)]


    graphApi.addLayerAfter(
        {
            name: "dlkfldkf",
            params: {}
        }, n1.nodeId)
}, 5000)