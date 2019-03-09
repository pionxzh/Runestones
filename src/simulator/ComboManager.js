class ComboManager {
    static start () {
        this.comboList = []
        this.comboCount = 0
    }

    static addCombo (mode, color, length) {
        this.comboCount += 1
        this.comboList.push({
            mode: mode,
            color: color,
            amount: length,
            balls: new Array(length).fill(color),
        })
    }

    static reset () {
        this.comboCount = 0
        this.comboList.splice(0, this.comboList.length)
    }
}

export default ComboManager
