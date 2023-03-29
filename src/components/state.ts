import { writable } from 'svelte/store'
import type { IBlock, ITree } from './types'

export const position = writable([0])

export const tree = writable<ITree>({
    nodes: [

    ],
    edges: [

    ]

})

export type panels = 'navigation' | 'params' | 'search'

export const activeBlock = writable<{ position: panels }>({ position: 'navigation' })

export const pendingBlock = writable<IBlock | undefined>()
