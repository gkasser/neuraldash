import { derived, writable } from 'svelte/store'
import type { IArrow, ILayer } from './types'
import dagre from 'dagre'



export class GraphApi {
    public layers
    public arrows
    public targetLayout

    blockDimensions = { width: 150, height: 100 }

    static currentAvailableId = writable<number>(0)
    public static getId = () => {
        let id = 0
        GraphApi.currentAvailableId.update(i => {
            id = i
            return i + 1
        })
        return id.toString()
    }

    constructor(
        layers?: ILayer[],
        arrows?: IArrow[]
    ) {
        this.layers = writable<ILayer[]>(layers || [])
        this.arrows = writable<IArrow[]>(arrows || [])

        this.targetLayout = derived([this.layers, this.arrows], ([$layers, $arrows]) => {
            const g = new dagre.graphlib.Graph()
            g.setGraph({})
            g.setDefaultEdgeLabel(function () { return {} })

            $layers.forEach(layer => {
                g.setNode(layer.nodeId, { label: layer.name, ...this.blockDimensions })
            })

            $arrows.forEach(arrow => {
                g.setEdge(arrow., blockId2)
            })


        })


        dagre.layout(g)
        return {
            nodes: g.nodes().map(nId => g.node(nId)),
            edges: g.edges().map(eId => g.edge(eId))
        }
    }

    public addLayer(layer: ILayer): void {
        this.layers.update((ls) => {
            ls.push(layer)
            return ls
        })
    }

    public removeLayer(layer: ILayer): void {
        this.layers.update((ls) => {
            const idx = ls.findIndex((l) => l.nodeId == layer.nodeId)
            ls.splice(idx, 1)
            return ls
        })
    }

    public updateLayer(layer: ILayer): void {
        this.layers.update((ls) => {
            const idx = ls.findIndex((l) => l.nodeId == layer.nodeId)
            ls[idx] = layer
            return ls
        })
    }


    public addArrow(arrow: IArrow): void {
        this.arrows.update((ls) => {
            ls.push(arrow)
            return ls
        })
    }

    public removeArrow(arrow: IArrow): void {
        this.arrows.update((ls) => {
            const idx = ls.findIndex((l) => l.edgeId == arrow.edgeId)
            ls.splice(idx, 1)
            return ls
        })
    }

    public updateArrow(arrow: IArrow): void {
        this.arrows.update((ls) => {
            const idx = ls.findIndex((l) => l.edgeId == arrow.edgeId)
            ls[idx] = arrow
            return ls
        })
    }

}