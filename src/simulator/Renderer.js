import Map from './Map'
// import { BALL_SIZE, BallColorList, DROP_SPEED, DELETE_SPEED, BallState, GAME_STATE } from './Global'
// import { BallState } from './Global'
// const HorizonCol = 5
// const VerticalCol = 6

// const COL_WIDTH = 80
// const COL_HEIGHT = 80

const Images = {
    frozen: require(`@/assets/Icon/i1.png`),
    weather: require('@/assets/Icon/+.png'),
    plus: require('@/assets/Icon/+.png'),
    w: require('@/assets/Icon/w.png'),
    f: require('@/assets/Icon/f.png'),
    p: require('@/assets/Icon/p.png'),
    l: require('@/assets/Icon/l.png'),
    d: require('@/assets/Icon/d.png'),
    h: require('@/assets/Icon/h.png'),
}

// Draws stuff on the canvas
export default class Renderer {
    // Create renderer object
    static start () {
        this.canvas = window.document.getElementById('simulator')
        this.ctx = this.canvas.getContext('2d')
        this.pi2 = Math.PI * 2

        this.touchDevice = Map.touchDevice
        this.BALL_SIZE = Map.BALL_SIZE

        this.fps = {
            now: 0,
            filter: 50,
            lastUpdate: (new Date()) * 1,
            value: 0,
            display: 0,
        }

        this.resize()
        window.onresize = () => this.resize()
    }

    // Runs in game loop
    static run () {
        this.refresh()
        this.draw()
        this.restore()
        // this.calcFps()
    }

    // Refresh the screen
    static refresh () {
        this.ctx.save()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    // Draw the things
    static draw () {
        this.runeStone()
    }

    // Restore context
    static restore () {
        this.ctx.restore()
    }

    // Resize the canvas
    static resize () {
        Map.resize()
        this.BALL_SIZE = Map.resizer.BALL_SIZE
    }

    static detectTouchDevice () {
        if (navigator.userAgent.indexOf('iPhone') > 0 ||
            navigator.userAgent.indexOf('iPod') > 0 ||
            navigator.userAgent.indexOf('iPad') > 0 ||
            navigator.userAgent.indexOf('Android') > 0) {
            return true
        }
        return false
    }

    // Draw the runeStones
    static runeStone () {
        // 先畫一般的珠，再畫移動中的珠
        for (let ball of Map.balls) {
            if (ball != null) {
                this.drawBall(ball)
            }
        }
        /*
        // 繪製場地障礙(幻界)
        if (this.environment.phantom) {
            // this.environment.drawPhantom(ctx)
        }

        // 繪製軌跡效果
        if (this.environment.isRecordLocus() && this.environment.locusShow) {
            this.environment.drawLocus(ctx)
        }
        */
        // 繪製移動中的珠
        if (Map.movingBall) {
            this.drawBall(Map.movingBall)
        }
        /*
        // 繪製軌跡路徑
        if (this.environment.showRecord && this.panelMode === PANEL_MODE.REPLAY) {
            this.historyManager.drawRecord(ctx)
        }
        */
    }

    static drawBall (ball) {
        let ctx = this.ctx

        var image = new Image()
        if (ball.locusMode) {
            image.src = Images[ball.item + ball.locusMode]
        } else {
            image.src = Images[ball.item]
        }
        // ctx.save()
        ctx.globalAlpha = ball.alpha
        ctx.drawImage(image, ball.animated.getX(), ball.animated.getY(), this.BALL_SIZE, this.BALL_SIZE)

        if (ball.frozen) {
            var frozenImage = new Image()
            frozenImage.src = Images.frozen
            ctx.drawImage(frozenImage, this.animated.getX(), ball.animated.getY(), this.BALL_SIZE, this.BALL_SIZE)
        }
        if (ball.weather) {
            var weatherImage = new Image()
            weatherImage.src = Images.plus
            ctx.drawImage(weatherImage, ball.animated.getX(), ball.animated.getY(), this.BALL_SIZE, this.BALL_SIZE)
        }
    }
    /*
    // Draw map border
    static border () {
        let ctx = this.ctx
        let size = World.border.right - World.border.left + 200
        ctx.strokeStyle = this.borderColor
        ctx.lineWidth = 200
        ctx.strokeRect(World.border.left - 100, World.border.top - 100, size, size)
    }

    // Draw grid
    static grid () {
        let ctx = this.ctx
        let x1 = World.border.left,
            y1 = World.border.top,
            x2 = World.border.right,
            y2 = World.border.bottom,
            sectionNum = ~~((x2 - x1) / 2828),
            loc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
            i, j, x, y

        if (1) {
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.beginPath()
            for (i = 0; i < sectionNum; i++) {
                x = x1 + (i * 2828)
                y = y1 + (i * 2828)
                ctx.moveTo(x, y1)
                ctx.lineTo(x, y2)
                ctx.moveTo(x1, y)
                ctx.lineTo(x2, y)
            };
            ctx.closePath()

            ctx.lineWidth = 150
            ctx.strokeStyle = '#161616'
            ctx.stroke()
        }
    }

    // Draw cells
    static cells () {
        let ctx = this.ctx

        World.cells.forEach((cell) => {
            cell.animated.x = this.animate(cell.animated.x, cell.position.x, 6)
            cell.animated.y = this.animate(cell.animated.y, cell.position.y, 6)
            cell.animated.r = this.animate(cell.animated.r, cell.position.r, 7)

            ctx.beginPath()
            ctx.arc(cell.animated.x, cell.animated.y, cell.animated.r, 0, this.pi2, false)
            ctx.closePath()

            if (cell.type === 2) { // virus
                ctx.fillStyle = this.virusColor
                ctx.globalAlpha = 0.7
                ctx.fill()
                ctx.globalAlpha = 1
                ctx.lineWidth = 10
                ctx.strokeStyle = this.virusStroke
                ctx.stroke()
            }

            if (cell.type === 4) { // eject
                ctx.fillStyle = '#24815d'
                ctx.fill()
            }

            if (cell.type === 1) { // cell
                let cellY = ~~cell.animated.y

                ctx.lineWidth = 0
                ctx.fillStyle = cell.color
                ctx.fill()

                if (cell.animated.r < 150) return
                // NAME CACHE
                let nameCache = cell.nameCache
                nameCache.setValue(cell.name || 'An unnamed Cell')
                nameCache.setSize(cell.getNameSize() / 1.2)

                let nameRatio = Math.ceil(10 * Camera.animated.v) / 10
                nameCache.setScale(nameRatio)

                let name = nameCache.render()
                let nameWidth = ~~(name.width / nameRatio)
                let nameHeight = ~~(name.height / nameRatio)

                ctx.drawImage(name, ~~cell.animated.x - ~~(nameWidth / 2), cellY - ~~(nameHeight / 2), nameWidth, nameHeight)

                cellY += name.height / 2 / nameRatio + 4

                // MASS CACHE
                let sizeCache = cell.sizeCache
                sizeCache.setSize(cell.getNameSize() / 2)
                sizeCache.setValue(~~(cell.animated.r * cell.animated.r / 100))
                let sizeRatio = Math.ceil(10 * Camera.animated.v) / 10
                sizeCache.setScale(sizeRatio)

                let size = sizeCache.render()
                let sizeWidth = ~~(size.width / sizeRatio)
                let sizeHeight = ~~(size.height / sizeRatio)

                ctx.drawImage(size, ~~cell.animated.x - ~~(sizeWidth / 2), cellY - ~~(sizeHeight / 2), sizeWidth, sizeHeight)
            }
        })
    }

    // Draw food
    static food () {
        let ctx = this.ctx

        ctx.beginPath()
        World.food.forEach((food) => {
            ctx.moveTo(food.position.x + food.position.r + 4, food.position.y)
            ctx.arc(food.position.x, food.position.y, food.position.r + 4, 0, this.pi2, false)
        })
        ctx.closePath()
        ctx.fillStyle = this.foodColor
        ctx.fill()
    }
    */

    // Animation formula
    static animate (previous, next, factor) {
        return previous + ((next - previous) / factor)
    }

    static calcFps () {
        let current = 1000 / ((this.fps.now = Date.now()) - this.fps.lastUpdate)
        if (this.fps.now !== this.fps.lastUpdate) {
            window.document.getElementById('fps').textContent = ~~this.fps.value
            // this.fps.value += (current - this.fps.value) / this.fps.filter
            this.fps.value = current
            this.fps.lastUpdate = this.fps.now
        }
    }
}
