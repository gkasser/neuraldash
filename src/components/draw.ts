import type { IBlock } from './types'

export type Point = { x: number; y: number }

export class Draw {
    constructor(
        private scale: number,
        private xOffset: number,
        private yOffset: number,
        private ctx: CanvasRenderingContext2D,
        private width: number,
        private height: number
    ) { }

    convertPoint(p: Point): Point {
        return {
            x: p.x * this.scale + this.xOffset,
            y: p.y * this.scale + this.yOffset
        }
    }

    private moveTo(p: Point) {
        const convertedPoint = this.convertPoint(p)
        this.ctx.moveTo(convertedPoint.x, convertedPoint.y)
    }

    private lineTo(p: Point) {
        const convertedPoint = this.convertPoint(p)
        this.ctx.lineTo(convertedPoint.x, convertedPoint.y)
    }


    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }


    link(p1: Point, p2: Point) {
        this.ctx.lineWidth = 1
        this.moveTo(p1)
        this.ctx.strokeStyle = '#333'
        this.lineTo(p2)
    }

    fillRect(p1: Point, p2: Point) {
        this.ctx.fillRect(
            p1.x, p1.y, p2.x - p1.x, p2.y - p1.y
        )
    }

    drawBlock(b: IBlock, p: Point) {
        const w = 200
        const h = 100

        const pc = this.convertPoint(p)

        const p1 = {
            x: p.x - w / 2,
            y: p.y - h / 2
        }
        const p2 = {
            x: p.x + w / 2,
            y: p.y + h / 2
        }

        const p1c = this.convertPoint(p1)
        const p2c = this.convertPoint(p2)

        this.fillRect(p1c, p2c)

        this.ctx.font = "20px Georgia"
        this.ctx.fillStyle = 'black'
        this.ctx.fillText("Hello World!", p1c.x, pc.y)
    }

}
