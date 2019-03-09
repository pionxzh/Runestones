import { getRadianByPoints, getDirectionByPoints } from '../Util'
import { DROP_SPEED, DELETE_SPEED, EXCHANGE_SPEED, BallState, Direction8 } from '../Global'

// const MOVE_FRAME    = 5
// const REPLAY_SPEED  = BALL_SIZE / MOVE_FRAME

// const SHIFT_BIAS    = BALL_SIZE / 20

class Ball {
    constructor (point, item, size) {
        this.state = BallState.NORMAL
        this.point = point
        this.animated = point
        this.size = size

        this.item = item
        this.setColor(item)

        this.alpha = 1.0
        this.dropGrid = 0
        this.stateFrameCount = 0
        this.frameCountToDelete = DELETE_SPEED
        this.frameCountToDropEnd = DROP_SPEED
        this.frameCountToExchangeEnd = EXCHANGE_SPEED

        this.from = null
        this.destination = null
        this.exchanging = false

        this.locusMode = null
    }

    setState (state) {
        this.state = state
        this.stateFrameCount = 0
        if (this.state === BallState.SELECTED) {
            this.alpha = 0.3
        } else if (this.state === BallState.EXCHANGING) {
            // this.alpha = 1.0
        } else if (this.state === BallState.MOVING) {
            this.alpha = 1.0
        } else if (this.state === BallState.DELETED) {
            this.alpha = 0.0
        } else {
            this.alpha = 1.0
        }
    }

    setColor (item) {
        this.item = item
        this.color = item[0]
        this.strong = item.indexOf('+') >= 0 ? 1 : null
        this.inhibit = item.indexOf('x') >= 0 ? 1 : null
        this.locking = item.indexOf('k') >= 0 ? 1 : null
        this.frozen = item.indexOf('i') >= 0 ? parseInt(item[item.indexOf('i') + 1]) : null
        this.weather = item.indexOf('*') >= 0 ? 1 : null
        this.reverse = item.indexOf('_') >= 0 ? 1 : null
        this.unknown = item.indexOf('q') >= 0 ? 1 : null
    }

    setPoint (point) {
        this.point = point.clone()
        this.animated = this.point
    }

    setDestination (point) {
        this.from = this.point.clone()
        this.destination = point.clone()
        this.point = this.destination

        // this.setState(BallState.EXCHANGING)
        this.exchanging = true
        this.stateFrameCount = 0
        this.frameCountToExchangeEnd = EXCHANGE_SPEED
    }

    update () {
        if (this.state === BallState.DELETING) {
            if (this.stateFrameCount >= this.frameCountToDelete - DELETE_SPEED) {
                this.alpha = 1.0 * (this.frameCountToDelete - this.stateFrameCount) / DELETE_SPEED
            }
            if (this.stateFrameCount >= this.frameCountToDelete) {
                this.setState(BallState.DELETED)
            }
        } else if (this.state === BallState.DROPPING) {
            this.point.y = this.point.y + (this.size / this.frameCountToDropEnd) * this.dropGrid
            if (this.stateFrameCount === this.frameCountToDropEnd - 1) {
                this.setState(BallState.NORMAL)
            }
        } else if (this.exchanging) {
            const radian = Math.PI / 180.0

            const centerPointX = (this.from.x + this.destination.x) / 2
            const centerPointY = (this.from.y + this.destination.y) / 2
            const baseRadian = getRadianByPoints(this.destination, this.from)
            const direction = getDirectionByPoints(this.destination, this.from)
            const distance = Math.sqrt(Math.pow((this.destination.x - this.from.x), 2) + Math.pow((this.destination.y - this.from.y), 2)) / 2

            let directionFactor = 1
            if (this.state === BallState.SELECTED) {
                directionFactor = (direction === Direction8.TENKEY_2 || direction === Direction8.TENKEY_4 || direction === Direction8.TENKEY_1 || direction === Direction8.TENKEY_7) ? 1 : -1
            } else {
                directionFactor = (direction === Direction8.TENKEY_6 || direction === Direction8.TENKEY_8 || direction === Direction8.TENKEY_3 || direction === Direction8.TENKEY_9) ? 1 : -1
            }
            let percent = 1 - ((this.frameCountToExchangeEnd - this.stateFrameCount) / EXCHANGE_SPEED)
            let angle = baseRadian + (percent * 180 * directionFactor) * radian
            this.animated.x = centerPointX + Math.cos(angle) * distance
            this.animated.y = centerPointY + Math.sin(angle) * distance

            if (this.stateFrameCount === this.frameCountToExchangeEnd - 1) {
                // this.setState(BallState.NORMAL)
                this.animated = this.destination
                this.exchanging = false
            }
        }
        ++this.stateFrameCount
    }

    checkInhibit () {
        if (this.inhibit || this.weather) { return true }
        return false
    }

    mapImgSrc (item) {
        if (!item) { item = this.item }
        var plus = item.indexOf('+') >= 0 ? '+' : ''
        var reverse = item.indexOf('_') >= 0 ? '_' : ''

        var itemSrc = ''
        if (item.indexOf('x') >= 0) {
            itemSrc = 'x'
        } else if (item.indexOf('q') >= 0) {
            itemSrc = 'q'
        } else if (item.indexOf('k') >= 0) {
            itemSrc = this.color + 'k'
        } else {
            itemSrc = this.color + plus + reverse
        }
        return require(`@/assets/Icon/${itemSrc}.png`)
    }

    mapColorSrc (item) {
        if (!item) { item = this.item }
        var plus = item.indexOf('+') >= 0 ? '+' : ''
        var reverse = item.indexOf('_') >= 0 ? '_' : ''

        var itemSrc = ''
        if (item.indexOf('k') >= 0) {
            itemSrc = this.color + 'k'
        } else {
            itemSrc = this.color + plus + reverse
        }
        return '/Icon/' + itemSrc + '.png'
    }

    itemInformation () {
        var info = ''
        if (this.inhibit) { info += '隱藏風化\n' }
        if (this.frozen) { info += '冰凍' + this.frozen + '\n' }
        if (this.unknown) { info += '問號\n' }
        if (this.weather) { info += '風化\n' }
        return info
    }

    clone () {
        let point = this.point.clone()
        return new Ball(point, this.item, this.size)
    }
}

export default Ball
