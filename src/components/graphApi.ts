import { derived, get, writable } from 'svelte/store'
import type { IArrow, IDrawArrow, IDrawLayer, ILayer } from './types'
import dagre from 'dagre'



export class GraphApi {
    public layers
    public arrows
    public targetLayout

    blockDimensions = { width: 120, height: 75 }

    public static selectedIds = writable<string[]>([])
    private static currentAvailableId = writable<number>(0)
    private static getId = () => {
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
                g.setEdge(arrow.fromId, arrow.toId, {
                    edgeId: arrow.edgeId
                })
            })

            try {
                dagre.layout(g)
            } catch (e) {
                console.error(e)
                return {
                    layers: [],
                    arrows: [],
                }
            }
            return {
                layers: g.nodes().map(nId => {
                    return { ...g.node(nId), ...$layers.find(l => l.nodeId === nId) }
                }),
                arrows: g.edges().map(edge => {
                    const fullEdge = g.edge(edge)
                    const points = fullEdge.points
                    return { ...$arrows.find(a => a.edgeId === fullEdge.edgeId), points }
                })
            } as {
                layers: IDrawLayer[],
                arrows: IDrawArrow[],
            }
        })

        const id1 = this.addLayer({
            name: 'Input', params: []
        })

        this.addLayerAfter({
            name: "Conv2D",
            params: []
        }, id1)
    }

    public addLayerAfterCurrent(newLayer: Omit<ILayer, "nodeId">): string {
        const connectedLayerId: string = get(GraphApi.selectedIds)[0]
        return this.addLayerAfter(newLayer, connectedLayerId)
    }

    public addLayerAfter(newLayer: Omit<ILayer, "nodeId">, connectedLayerId: string): string {
        const nodeId = `l${GraphApi.getId()}`
        this.layers.update(
            (ls) => {
                ls.push({ ...newLayer, nodeId })
                return ls
            }
        )

        this.addArrow({
            fromId: connectedLayerId,
            toId: nodeId
        })
        GraphApi.selectedIds.set([nodeId])
        return nodeId
    }

    public addLayer(layer: Omit<ILayer, "nodeId">): string {
        const nodeId = `l${GraphApi.getId()}`
        this.layers.update((ls) => {
            ls.push({ ...layer, nodeId })
            return ls
        })
        GraphApi.selectedIds.set([nodeId])
        return nodeId
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


    public addArrow(arrow: Omit<IArrow, "edgeId">): string {
        const edgeId = `a${GraphApi.getId()}`
        this.arrows.update((ls) => {
            ls.push({ ...arrow, edgeId })
            return ls
        })
        return edgeId
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