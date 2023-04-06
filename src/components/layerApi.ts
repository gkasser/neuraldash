import { get, writable } from 'svelte/store'
import layers from '../layers.json'
import type { ILayer } from './types'
import type { GraphApi } from './graphApi'
import { activeBlock, graphApi } from './state'



export const pendingBlock = writable<Omit<ILayer, 'nodeId'> | undefined>()

class LayerApi {
    private lastParams
    constructor(private graphApi: GraphApi) {
        this.lastParams = this.initializeParams()
    }

    private initializeParams() {
        const output: {
            [n: string]: {
                [name: string]: any
            }
        } = {}

        Object.entries(layers).forEach(([layerName, obj]) => {
            output[layerName] = {
                name: layerName,
                params: obj.params.map(param => {
                    return {
                        name: param.name,
                        value: "",
                        doc: param.doc || "",
                        type: param.type,
                    }
                })
            }
        })

        return output
    }

    public newLayer(layerName: string) {
        const last = this.lastParams[layerName]

        pendingBlock.set({
            name: layerName,
            params: last.params.map((param) => {
                return {
                    name: param.name,
                    value: param.value,
                    doc: param.doc || "",
                    type: param.type
                }
            })
        })


        if (layers[layerName].params.length == 0) {
            this.addPendinglayer()
        }
    }

    public addPendinglayer() {
        const pending = get(pendingBlock)!

        if (!this.validatePendingLayer()) {
            return
        }

        this.graphApi.addLayerAfterCurrent({
            name: pending?.name,
            params: pending?.params
        })

        pendingBlock.set(undefined)
        activeBlock.set({ position: "search" })
    }

    private validatePendingLayer(): boolean {
        return true
    }

}


export const layerApi = new LayerApi(graphApi)