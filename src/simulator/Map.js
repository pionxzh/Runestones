import ComboManager from './ComboManager'

import Ball from './Entities/ball'
import Point from './Entities/point'
import Mouse from './Entities/mouse'
import Analyzer from './Analyzer'
import Resizer from './Resizer'

import { getRandColor } from './Util'
import { DROP_SPEED, DELETE_SPEED, BallState, GAME_STATE } from './Global'
// import { getAngleByPoints, getDirectionByPoints } from './util'

const HorizonCol = 5
const VerticalCol = 6

class Map {
    static start () {
        this.balls = []
        this.canvas = null
        this.gameState = GAME_STATE.WAITING

        this.frameCount = 0
        this.lastPoint = null
        this.movingBall = null
        this.selectedBall = null
        this.selectedColor = null
        this.firstTimeDelete = true

        this.resizer = new Resizer()
        this.resizer.start()
        this.animationMode = false

        this.touchDevice = this.resizer.isMobile
        this.BALL_SIZE = this.resizer.getBallSize()
        this.mouseInfo = new Mouse(this.BALL_SIZE)

        this.bindEvent()
        // this.shuffle()
    }

    static resize () {
        this.resizer.resize()
        this.BALL_SIZE = this.resizer.BALL_SIZE
        this.shuffle()
    }

    static bindEvent () {
        this.canvas = window.document.getElementById('simulator')

        if (!this.touchDevice) {
            this.canvas.onmousemove = (e) => this.mouseMove(e)
            this.canvas.onmousedown = (e) => this.mouseDown(e)
            this.canvas.onmouseup = (e) => this.mouseUp(e)
            this.canvas.onmouseout = (e) => this.mouseOut(e)
        } else {
            this.canvas.ontouchmove = (e) => this.touchMove(e)
            this.canvas.ontouchstart = (e) => this.touchStart(e)
            this.canvas.ontouchend = (e) => this.touchEnd(e)
        }
        this.canvas.onclick = (e) => this.click
    }

    static setGameState (state) {
        this.gameState = state
    }

    static setSelectedColor (color) {
        this.selectedColor = color
    }

    static setAnimationMode (mode) {
        this.animationMode = mode
    }

    static mouseDown (event) {
        this.mouseInfo.update(event)
        this.mouseInfo.pressed = true
        return false
    }
    static mouseUp (event) {
        this.mouseInfo.update(event)
        this.mouseInfo.pressed = false
        ComboManager.reset()
        return false
    }
    static mouseMove (event) {
        this.mouseInfo.update(event)
        return false
    }
    static mouseOut (event) {
        this.mouseInfo.update(event)
        this.mouseInfo.pressed = false
        return false
    }

    static touchStart (event) {
        let e = event.touches[0]
        this.mouseInfo.update(e)
        this.mouseInfo.pressed = true
        return false
    }
    static touchEnd () {
        try {
            this.mouseInfo.pressed = false
            if (this.touchDevice) {
                this.click()
            }
            ComboManager.reset()
        } catch (e) { alert(e) }
        return false
    }
    static touchMove = function () {
        let e = event.touches[0]
        this.mouseInfo.update(e)
        return false
    }

    // 這是幹啥...
    static click (e) {
        if (this.onCanvasClick) {
            this.onCanvasClick()
        }
    }

    // =========================================================
    // SceneManager update 時會一直call update, updateMouseInfo, draw
    // =========================================================

    static updateWaiting () {
        const point = this.mouseInfo.point.clone()
        if (this.checkIllegalPoint(point)) return

        // this.lastMousePoint = this.mouseInfo.point.clone().toGrid()
        // const mouseMoved = this.lastMousePoint ? mouseInfo && (mouseInfo.point.getX() !== this.lastMousePoint.getX() ||
        //   mouseInfo.point.getY() !== this.lastMousePoint.getY()) : false

        this.lastPoint = point.clone().toGrid()

        if (this.mouseInfo.pressed) {
            this.selectedBall = this.getBallAtPoint(point, false)
            if (this.selectedBall === null) return
            this.selectedBall.setState(BallState.SELECTED)

            this.movingBall = this.selectedBall.clone()
            this.movingBall.setState(BallState.MOVING)
            this.updateMovingBall(point)

            this.setGameState(GAME_STATE.MOVING)
        }
    }

    static updateEdit () {
        if (this.mouseInfo.pressed) {
            if (this.selectedColor) {
                const point = this.mouseInfo.point.clone().toGrid()
                let selectedBall = this.getBallAtPoint(point, false)
                if (selectedBall === null) return

                selectedBall.setColor(this.selectedColor)
            }
        }
    }

    static updateMoving () {
        // ComboManager.reset()

        const point = this.mouseInfo.point.clone()
        if (this.checkIllegalPoint(point)) return

        const mouseReleased = this.mouseInfo && !this.mouseInfo.pressed

        if (this.mouseInfo.pressed) {
            // 1. 計算滑鼠移動量
            // 2. 更新移動珠位置
            // 3. 計算移動珠所在格

            this.updateMovingBall(point)

            let newPoint = this.mouseInfo.point.clone().toGrid()
            let selectedBall = this.getBallAtPoint(newPoint, false)
            if (selectedBall === null) return

            /*
            let direction = getDirectionByPoints(this.lastPoint, newPoint)
            let angle = getAngleByPoints(this.lastPoint, this.movingBall.point)

            let angleIsSlant = (angle > (90 * 0) + 45 - 15 && angle < (90 * 0) + 45 + 15) ||
                                (angle > (90 * 1) + 45 - 15 && angle < (90 * 1) + 45 + 15) ||
                                (angle > (90 * 2) + 45 - 15 && angle < (90 * 2) + 45 + 15) ||
                                (angle > (90 * 3) + 45 - 15 && angle < (90 * 3) + 45 + 15)
            let slantMove = (direction === Direction8.TENKEY_1) ||
                            (direction === Direction8.TENKEY_3) ||
                            (direction === Direction8.TENKEY_7) ||
                            (direction === Direction8.TENKEY_9)
            */
            if (this.lastPoint !== newPoint && selectedBall !== this.selectedBall) {
                this.exchangeBall(selectedBall, this.lastPoint)
            }
        }

        if (mouseReleased) {
            if (!this.movingBall) return

            // this.movingBall.setPoint(point.toGrid())
            this.selectedBall.setState(BallState.Normal)
            this.movingBall = null
            this.setGameState(GAME_STATE.TRY_DELETE)
            this.firstTimeDelete = true
        }
    }

    static updateMovingBall (point) {
        this.movingBall.setPoint(point.clone().offset(-(this.BALL_SIZE / 2), -(this.BALL_SIZE / 2)))
    }

    static updateTryDelete () {
        let analyzer = new Analyzer(this.balls)
        this.deleteList = analyzer.calcMatches()

        if (this.deleteList.length) {
            for (let i = 0; i < this.deleteList.length; i++) {
                let startFrame = DELETE_SPEED * (i + 1)
                for (let index of this.deleteList[i]) {
                    let ball = this.balls[index]
                    ball.setState(BallState.DELETING)
                    ball.frameCountToDelete = startFrame
                }
            }

            this.setGameState(GAME_STATE.DELETING)
        } else {
            this.setGameState(GAME_STATE.WAITING)
            if (this.firstTimeDelete === true) ComboManager.reset()
        }
    }

    static updateDeleting () {
        let isAllDeleted = () => {
            for (let i = 0; i < this.balls.length; i++) {
                if (this.balls[i] != null && this.balls[i].state === BallState.DELETING) {
                    return false
                }
            }
            for (let i = 0; i < this.deleteList.length; i++) {
                for (let index of this.deleteList[i]) {
                    let ball = this.balls[index]
                    if (ball === null || ball.state !== BallState.DELETED) break
                }
                ComboManager.addCombo(this.firstTimeDelete ? '首' : '疊', this.balls[this.deleteList[i][0]].color, this.deleteList[i].length)
            }
            return true
        }

        if (isAllDeleted()) {
            // clear the deleted ball
            for (let i = 0; i < this.balls.length; i++) {
                if (this.balls[i] != null && this.balls[i].state === BallState.DELETED) {
                    this.balls[i] = null
                }
            }
            this.setGameState(GAME_STATE.TRY_DROP)
            this.frameCount = 0
            this.firstTimeDelete = false
        }
    }

    static updateTryDrop () {
        // 計算落下距離
        this.dropSpace = new Array(VerticalCol).fill([])
        for (let i = 0; i < VerticalCol; i++) {
            let dropGrid = 0
            let spacePoints = []
            for (let j = HorizonCol - 1; j >= 0; j--) {
                let ball = this.balls[j * VerticalCol + i]
                if (!ball) {
                    dropGrid += 1
                    spacePoints.push(new Point(i, j, true, this.BALL_SIZE))
                } else if (dropGrid > 0) {
                    ball.dropGrid = dropGrid
                    ball.setState(BallState.DROPPING)
                    ball.frameCountToDropEnd = dropGrid * DROP_SPEED
                    this.balls[(j + dropGrid) * VerticalCol + i] = ball
                    this.balls[j * VerticalCol + i] = null
                }
            }

            // 新增珠落下
            for (let j = 1; j <= dropGrid; j++) {
                let ball = new Ball(new Point(i, -1 * j, true, this.BALL_SIZE), getRandColor(), this.BALL_SIZE)
                ball.setState(BallState.DROPPING)
                ball.dropGrid = dropGrid
                ball.frameCountToDropEnd = dropGrid * DROP_SPEED
                this.balls[(dropGrid - j) * VerticalCol + i] = ball
            }
            spacePoints.length = 0
        }
        this.setGameState(GAME_STATE.DROPPING)
    }

    static updateDropping () {
        let isAllDropped = () => {
            for (let i = 0; i < this.balls.length; i++) {
                if (this.balls[i] != null && this.balls[i].state === BallState.DROPPING) {
                    return false
                }
            }
            return true
        }

        if (isAllDropped()) {
            this.setGameState(GAME_STATE.TRY_DELETE)
            this.frameCount = 0
        }
    }

    static updateBalls () {
        for (let i = 0; i < this.balls.length; i++) {
            if (this.balls[i]) {
                this.balls[i].update()
            }
        }
    }

    static shuffle () {
        this.balls.length = 0
        for (let i = 0; i < HorizonCol; i++) {
            for (let j = 0; j < VerticalCol; j++) {
                const point = new Point(j, i, true, this.BALL_SIZE)
                const color = getRandColor()
                const ball = new Ball(point, color, this.BALL_SIZE)
                this.balls.push(ball)
            }
        }
        console.log('shuffle done')
    }

    static checkIllegalPoint (point) {
        return point.getGridX() < 0 ||
            point.getGridX() >= VerticalCol ||
            point.getGridY() < 0 ||
            point.getGridY() >= HorizonCol
    }

    static getBallAtPoint (point, movingInclude) {
        if (this.checkIllegalPoint(point)) { return null }
        return this.balls[point.getGridY() * VerticalCol + point.getGridX()]
    }

    static exchangeBall (oldBall, destination) {
        // console.log('exc')
        let oldBallPoint = oldBall.point.clone().toGrid()
        this.animationMode ? oldBall.setDestination(destination) : oldBall.setPoint(destination)
        this.animationMode ? this.selectedBall.setPoint(oldBallPoint) : this.selectedBall.setPoint(oldBallPoint)

        this.balls[oldBallPoint.getGridY() * VerticalCol + oldBallPoint.getGridX()] = this.selectedBall
        this.balls[destination.getGridY() * VerticalCol + destination.getGridX()] = oldBall
        this.lastPoint = oldBallPoint
    }

    /*
    setBallAtPoint (ball, point) {
        if (this.checkIllegalPoint(point)) { return null }
        if (ball != null) {
            ball.point = point.clone()
        }
        this.balls[point.getGridY() * VerticalCol + point.getGridX()] = ball
    }

    getBallCenterPoint (ball) {
        return new Point(Math.floor((ball.point.getX() + this.BALL_SIZE / 2) / BALL_SIZE, this.BALL_SIZE),
            Math.floor((ball.point.getY() + this.BALL_SIZE / 2) / BALL_SIZE), true)
    }
    */
}

export default Map
