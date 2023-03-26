import { writable } from 'svelte/store'

export const store = writable({
    foo: 'foo',
    bar: 'bar'
})