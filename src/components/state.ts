import { writable } from 'svelte/store'

export const state = writable({
    tree: {
        "type": "input",
        "params": {
            "size": "b,x,x,3"
        },
        "children": []
    } as Block,
    position: [0]
})

export type Block = {
    type: string
    params: any
    children: Array<Block>
}