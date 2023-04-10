import { get, writable } from 'svelte/store'
import type { Point } from './types'
import { GraphApi } from './graphApi'
import layers from '../layers.json'

export const graphApi = new GraphApi()
export const targetLayout = graphApi.targetLayout

export const lastParams = writable(layers)

export const mapOffset = writable<Point>({
    x: 300,
    y: 50,
})



export type panels = 'navigation' | 'params' | 'search'

export const activeBlock = writable<panels>('navigation')

export class NavigationAPI {
    public static Tree = () => {
        activeBlock.set('navigation')
    }

    public static Search = () => {
        activeBlock.set('search')
    }

    public static Params = () => {
        activeBlock.set('params')
    }

    public static keyUpListener = (e: KeyboardEvent) => {
        console.log(e.key)

        switch (get(activeBlock)) {
            case "navigation":
                break
        }

    }
}