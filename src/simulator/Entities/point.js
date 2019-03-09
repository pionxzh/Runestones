// import { BALL_SIZE } from '@/simulator/Global'

class Point {
    constructor (x, y, grid, BALL_SIZE) {
        this.BALL_SIZE = BALL_SIZE
        if (grid) {
            this.x = x * BALL_SIZE
            this.y = y * BALL_SIZE
        } else {
            this.x = x
            this.y = y
        }
    }

    getX () {
        return this.x
    }
    getY () {
        return this.y
    }
    getGridX () {
        const BALL_SIZE = this.BALL_SIZE
        return Math.floor(this.x / BALL_SIZE)
    }
    getGridY () {
        const BALL_SIZE = this.BALL_SIZE
        return Math.floor(this.y / BALL_SIZE)
    }
    toGrid () {
        const BALL_SIZE = this.BALL_SIZE
        this.x = Math.floor(this.x / BALL_SIZE) * BALL_SIZE
        this.y = Math.floor(this.y / BALL_SIZE) * BALL_SIZE
        return this
    }
    offset (x, y) {
        let ret = this.clone()
        ret.x += x
        ret.y += y
        return ret
    }

    toText () {
        return `${this.x},${this.y}`
    }

    buildFromText (text) {
        return new Point(parseInt(text.split(',')[0]), parseInt(text.split(',')[1]), false, this.BALL_SIZE)
    }

    clone () {
        return new Point(this.x, this.y, false, this.BALL_SIZE)
    }
}

export default Point
