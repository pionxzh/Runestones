class Resizer {
    constructor () {
        this.isMobile = false
        this.BALL_SIZE = 80
    }

    start () {
        this.canvas = window.document.getElementById('simulator')
        this.ctx = this.canvas.getContext('2d')

        this.isMobile = this.detectTouchDevice()
        this.resize()
    }

    getBallSize () {
        return this.BALL_SIZE
    }

    calcBallSize () {
        this.canvas.style.width = `100%`
        this.BALL_SIZE = ~~(this.canvas.offsetWidth / 6)
        return this.BALL_SIZE
    }

    // Resize the canvas
    resize () {
        this.calcBallSize()

        this.canvas.style.width = `${this.BALL_SIZE * 6}px`
        this.canvas.style.height = `${this.BALL_SIZE * 5}px`
        this.canvas.style.backgroundSize = `${(this.BALL_SIZE * 4)}px ${(this.BALL_SIZE * 4)}px`
        this.ctx.canvas.width = this.canvas.offsetWidth
        this.ctx.canvas.height = this.canvas.offsetHeight

        // console.log(this.ctx.canvas.width, this.ctx.canvas.height, this.BALL_SIZE)
    }

    detectTouchDevice () {
        if (navigator.userAgent.indexOf('iPhone') > 0 ||
            navigator.userAgent.indexOf('iPod') > 0 ||
            navigator.userAgent.indexOf('iPad') > 0 ||
            navigator.userAgent.indexOf('Android') > 0) {
            return true
        }
        return false
    }
}

export default Resizer
