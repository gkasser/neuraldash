import { writable } from 'svelte/store'

export const position = writable([0])

export const state = writable({
    tree: {
        "type": "Input",
        "params": {
            "size": "b,x,x,3"
        },
        "inputs": []
    } as Block
})

export type panels = 'navigation' | 'params' | 'search'

export const activeBlock = writable<{ position: panels }>({ position: 'navigation' })

export const pendingBlock = writable<Block | undefined>()

export type Block = {
    type: string
    params: any
    inputs: Array<Block>
}