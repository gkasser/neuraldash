import { writable } from 'svelte/store'

export const state = writable({
    tree: {
        "type": "Input",
        "params": {
            "size": "b,x,x,3"
        },
        "inputs": []
    } as Block,
    position: [0]
})

export type Block = {
    type: string
    params: any
    inputs: Array<Block>
}