import { BallColorList, Direction8 } from '@/simulator/Global'

export function getRandColor () {
    const rand = ~~(Math.random() * BallColorList.length)
    return BallColorList[rand]
}

export function getDirectionByPoints (lastPoint, newPoint) {
    if (newPoint.getGridX() > lastPoint.getGridX()) {
        if (newPoint.getGridY() > lastPoint.getGridY()) return Direction8.TENKEY_3
        else if (newPoint.getGridY() < lastPoint.getGridY()) return Direction8.TENKEY_9
        else if (newPoint.getGridY() === lastPoint.getGridY()) return Direction8.TENKEY_6
    } else if (newPoint.getGridX() < lastPoint.getGridX()) {
        if (newPoint.getGridY() > lastPoint.getGridY()) return Direction8.TENKEY_1
        else if (newPoint.getGridY() < lastPoint.getGridY()) return Direction8.TENKEY_7
        else if (newPoint.getGridY() === lastPoint.getGridY()) return Direction8.TENKEY_4
    } else {
        if (newPoint.getGridY() > lastPoint.getGridY()) return Direction8.TENKEY_2
        else if (newPoint.getGridY() < lastPoint.getGridY()) return Direction8.TENKEY_8
        else return Direction8.TENKEY_5
    }
}

export function getRadianByPoints (lastPoint, newPoint) {
    var offsetX = newPoint.getX() - lastPoint.getX()
    var offsetY = newPoint.getY() - lastPoint.getY()
    var angle = Math.atan2(offsetY, offsetX)
    return angle
}

export function getAngleByPoints (lastPoint, newPoint) {
    var offsetX = newPoint.getX() - lastPoint.getX()
    var offsetY = newPoint.getY() - lastPoint.getY()
    var angle = Math.atan2(offsetY, offsetX) * (180.0 / Math.PI)
    angle = (angle + 360) % 360
    return angle
}
