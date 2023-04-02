import { t } from 'svelte-canvas'
import { derived, writable } from 'svelte/store'

const times = writable([0, 0])

t.subscribe((_time) => {
    times.update((vals) => {
        const seconds = _time / 1000
        return [seconds, seconds - vals[0]]
    })
})

export const time = derived(times, ($times) => {
    return $times[0]
})

export const deltaTime = derived(times, ($times) => {
    return $times[1]
})

export const timeToMove = writable(0)

export const DEFAULT_MOVETIME = 3
