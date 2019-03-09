import Point from '@/simulator/Entities/point'

class Mouse {
    constructor (BALL_SIZE) {
        this.pressed = false
        this.lastPressed = false
        this.point = new Point(0, 0, false, BALL_SIZE)
    }

    update (event) {
        const rect = event.target.getBoundingClientRect()
        this.point.x = event.clientX - rect.left
        this.point.y = event.clientY - rect.top
    }

    clone () {
        let bak = new Mouse()
        bak.pressed = this.pressed
        bak.lastPressed = this.lastPressed
        bak.point = this.point.clone()
        return bak
    }
}

export default Mouse
