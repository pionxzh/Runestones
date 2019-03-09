import Map from './Map'
import Renderer from './Renderer'
import ComboManager from './ComboManager'
import { PANEL_MODE, GAME_STATE } from './Global'

const SECOND_FRAMES = 60

class Engine {
    static start () {
        this.timerId = null
        this.startTime = null
        this.prev = null
        this.panelMode = PANEL_MODE.EMPTY
        this.fpsInterval = 1000 / SECOND_FRAMES

        Map.start()
        Renderer.start()
        ComboManager.start()
        this.startGameLoop()
    }

    static timerFunc () {
        let now = new Date().getTime()
        let elapsed = now - this.prev

        if (elapsed > this.fpsInterval) {
            this.prev = now - (elapsed % this.fpsInterval)
            this.loopManager()
        }

        this.timerId = window.requestAnimationFrame(this.timerFunc.bind(this))
    }

    static loopManager () {
        switch (this.panelMode) {
            case PANEL_MODE.EMPTY: {
                // Map.shuffle()
                this.panelMode = PANEL_MODE.EDIT
                break
            }
            case PANEL_MODE.EDIT: {
                Map.updateEdit()
                break
            }
            case PANEL_MODE.MOVE: {
                Map.updateBalls()

                if (Map.gameState === GAME_STATE.WAITING) {
                    Map.updateWaiting()
                } else if (Map.gameState === GAME_STATE.MOVING) {
                    Map.updateMoving()
                } else if (Map.gameState === GAME_STATE.TRY_DELETE) {
                    Map.updateTryDelete()
                } else if (Map.gameState === GAME_STATE.DELETING) {
                    Map.updateDeleting()
                } else if (Map.gameState === GAME_STATE.TRY_DROP) {
                    Map.updateTryDrop()
                } else if (Map.gameState === GAME_STATE.DROPPING) {
                    Map.updateDropping()
                }

                break
            }

            case PANEL_MODE.TEAM: {
                // do something
                break
            }

            case PANEL_MODE.REPLAY: {
                // do something
                break
            }

            case PANEL_MODE.PATH: {
                // do something
                break
            }

            default:
                // do nothing
        }

        Renderer.run(Map.balls)
    }

    static startGameLoop () {
        // clear the old timer
        this.stopGameLoop()

        this.startTime = new Date().getTime()
        this.prev = this.startTime
        this.timerFunc()
    }

    static stopGameLoop () {
        if (this.timerId) {
            window.cancelAnimationFrame(this.timerId)
            this.timerId = null
        }
    }

    static setPanelMode (mode) {
        this.panelMode = PANEL_MODE[mode]
    }
}

export default Engine
