import dagre from 'dagre'
import { derived, get, writable } from 'svelte/store'
import type { IArrow, IDrawArrow, IDrawLayer, ILayer } from './types'



export class GraphApi {
    public layers
    public arrows
    public targetLayout

    blockDimensions = { width: 120, height: 75 }

    public static selectedIds = writable<string[]>([])
    private static currentAvailableId = writable<number>(0)
    public static getId = (layer = true) => {
        let id = 0
        GraphApi.currentAvailableId.update(i => {
            id = i
            return i + 1
        })

        return (layer ? "l" : "a") + id.toString()
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

    public loadJson(modelJson: any) {
        const [layers, arrows] = GraphApi.parseKerasModel(modelJson)
        this.layers.set(layers)
        this.arrows.set(arrows)
    }

    public static parseKerasModel(model: any): [ILayer[], IArrow[]] {
        const layers: ILayer[] = []
        const arrows: IArrow[] = []
        const layerIds: { [id: string]: boolean } = {}

        model.config.layers.forEach((layer) => {
            const layerId = layer.name

            if (!layerIds[layerId]) {
                const inputIds: string[] = layer.inbound_nodes
                    .map((node) => node.inbound_layers)
                    .flat()
                    .map((inputLayer) => inputLayer.name)

                inputIds.forEach((inputId) => {
                    arrows.push({
                        edgeId: `${inputId}-${layerId}`,
                        fromId: inputId,
                        toId: layerId,
                    })
                })

                layers.push({
                    nodeId: layerId,
                    // name: layer.name,
                    // type: layer.constructor.name,
                    name: layer.constructor.name,
                    // inputIds: inputIds,
                    // outputIds: layer.outbound_nodes
                    //     .map((node) => node.outbound_layers)
                    //     .flat()
                    //     .map((outputLayer) => outputLayer.name),
                    params: layer.config,
                })

                layerIds[layerId] = true
            }
        })

        return [layers, arrows]
    }

    public addLayerAfterCurrent(newLayer: Omit<ILayer, "nodeId">): string {
        const connectedLayerId: string = get(GraphApi.selectedIds)[0]
        return this.addLayerAfter(newLayer, connectedLayerId)
    }

    public addLayerAfter(newLayer: Omit<ILayer, "nodeId">, connectedLayerId: string): string {
        const nodeId = GraphApi.getId()
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
        const nodeId = GraphApi.getId()
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
        const edgeId = GraphApi.getId(false)
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

    private deduplicateIds(array: string[]) {
        return array.filter((value, index) => array.indexOf(value) === index)
    }

    private nodeParents(id: string) {
        const arr = get(this.arrows).filter(a => a.toId == id)

        return this.deduplicateIds(arr.map(a => a.fromId))
    }

    private nodeChildren(id: string) {
        const arr = get(this.arrows).filter(a => a.fromId == id)

        return this.deduplicateIds(arr.map(a => a.toId))
    }

    public upArrow() {
        const [currentId, ..._] = get(GraphApi.selectedIds)
        const parents = this.nodeParents(currentId)
        if (parents.length) {
            GraphApi.selectedIds.set([parents[0]])
        }
    }

    public downArrow() {
        const [currentId, ..._] = get(GraphApi.selectedIds)
        const children = this.nodeChildren(currentId)
        if (children.length) {
            GraphApi.selectedIds.set([children[0]])
        }
    }

    public leftArrow() {
        const [currentId, ..._] = get(GraphApi.selectedIds)
        const parentIds = this.nodeParents(currentId)
        if (!parentIds.length) return

        const relatives = this.nodeChildren(parentIds[0])

        const myIdx = relatives.indexOf(currentId)

        const newIdx = (myIdx - 1 + relatives.length) % relatives.length
        GraphApi.selectedIds.set([
            relatives[newIdx],
        ])

    }
    public rightArrow() {
        const [currentId, ..._] = get(GraphApi.selectedIds)
        const parentIds = this.nodeParents(currentId)
        if (!parentIds.length) return

        const relatives = this.nodeChildren(parentIds[0])

        const myIdx = relatives.indexOf(currentId)

        const newIdx = (myIdx + 1) % relatives.length
        GraphApi.selectedIds.set([
            relatives[newIdx],
        ])
    }
}