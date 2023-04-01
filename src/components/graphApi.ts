import { derived, writable } from 'svelte/store'
import type { IArrow, ILayer } from './types'
import dagre from 'dagre'
import type { Layer } from 'svelte-canvas'



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
                g.setEdge(arrow.fromId, arrow.toId)
            })
            dagre.layout(g)
            return {
                nodes: g.nodes().map(nId => g.node(nId)),
                edges: g.edges().map(eId => g.edge(eId))
            }
        })

    }

    public addLayerAfter(newLayer: Omit<ILayer, "nodeId">, connectedLayer: Layer): void {
        const nodeId: string = GraphApi.getId()
        this.layers.update(
            (ls) => {
                ls.push({ ...newLayer, nodeId })
                return ls
            }
        )

        this.addArrow({
            fromId: connectedLayer.nodeId,
            toId: nodeId
        })
    }

    public addLayer(layer: Omit<ILayer, "nodeId">): void {
        this.layers.update((ls) => {
            const nodeId = GraphApi.getId()
            ls.push({ ...layer, nodeId })
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


    public addArrow(arrow: Omit<IArrow, "edgeId">): void {
        this.arrows.update((ls) => {
            const edgeId = GraphApi.getId()
            ls.push({ ...arrow, edgeId })
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