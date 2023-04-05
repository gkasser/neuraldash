import { writable } from 'svelte/store'
import layers from '../layers.json'
import type { ILayer } from './types'



export const pendingBlock = writable<Omit<ILayer, 'nodeId'> | undefined>()

class LayerApi {
    private lastParams
    constructor() {
        this.lastParams = this.initializeParams()
    }

    private initializeParams() {
        const output: {
            [n: string]: {
                [name: string]: any
            }
        } = {}

        Object.entries(layers).forEach(([layerName, obj]) => {
            output[layerName] = obj.params.map(p => {
                return {
                    [p.name]: undefined
                }
            })
        })

        return output
    }

    public newLayer(layerName: string) {
        const last = this.lastParams[layerName]
        pendingBlock.set({
            name: layerName,
            params: Object.entries(last).map(([paramName, paramValue]) => {
                return {
                    name: paramName,
                    value: paramValue,
                    doc: layers[layerName].params[paramName].doc || "",
                    type: layers[layerName].params[paramName].type
                }
            })
        })
    }

}


export const layerApi = new LayerApi()