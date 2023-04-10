import { get } from 'svelte/store'
import { pendingBlock } from './layerApi'
import { activeBlock, graphApi } from './state'


export class NavigationAPI {
    public static Tree = () => {
        activeBlock.set('navigation')
    };

    public static Search = () => {
        activeBlock.set('search')
    };

    public static Params = () => {
        activeBlock.set('params')
    };

    private static manageKeyInTree(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowUp":
                graphApi.upArrow()
                break
            case "ArrowDown":
                graphApi.downArrow()
                break
            case "ArrowLeft":
                graphApi.leftArrow()
                break
            case "ArrowRight":
                graphApi.rightArrow()
                break

            case "Enter":
                this.Search()
                break
        }
    }

    private static manageKeyInParams(e: KeyboardEvent) {
        const newBlock = get(pendingBlock)
        switch (e.key) {
            case "Escape":
                this.Search()
                break
            case "Enter":
                if (newBlock) {
                    graphApi.addLayerAfterCurrent(newBlock)
                }
                this.Tree()
                break
        }
    }

    private static manageKeyInSearch(e: KeyboardEvent) {

        switch (e.key) {
            case "Escape":
                this.Tree()
                break
        }
    }

    public static keyUpListener = (e: KeyboardEvent) => {
        console.log(e.key)

        switch (get(activeBlock)) {
            case "navigation":
                this.manageKeyInTree(e)
                break

            case 'params':
                this.manageKeyInParams(e)
                break

            case 'search':
                this.manageKeyInSearch(e)
                break

        }

    };
}
