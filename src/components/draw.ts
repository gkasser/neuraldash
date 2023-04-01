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
        this.ctx.beginPath()
        this.moveTo(p1)
        this.ctx.strokeStyle = '#333'
        this.lineTo(p2)
        this.ctx.stroke()
        console.log("draw from ", p1, p1)
    }

    fillRect(p1: Point, p2: Point) {
        this.ctx.fillRect(
            p1.x, p1.y, p2.x - p1.x, p2.y - p1.y
        )
    }

    drawLine(points: Point[]) {
        while (points.length >= 2) {
            const p1 = points.shift()!
            const p2 = points[0]

            this.link(p1, p2)
        }

    }

    drawBlock(b: IBlock) {
        const w = b.width
        const h = b.height
        const p = { x: b.x, y: b.y }


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

        this.ctx.fillStyle = 'cyan'
        this.fillRect(p1c, p2c)

        this.write(b.label, { x: p1.x, y: p.y })
    }

    write(text: string, p: Point) {
        const pc = this.convertPoint(p)
        this.ctx.font = "20px Georgia"
        this.ctx.fillStyle = 'black'
        this.ctx.fillText(text, pc.x, pc.y)
    }

}
