const HorizonCol = 5
const VerticalCol = 6
// 消除長度(3消)
const EliminateLength = 3

// calculate the index of map
const mapIndex = (i, j) => (j * VerticalCol + i)

class Analyzer {
    constructor (balls) {
        this.lastID = 0
        this.balls = balls
        this.visited = new Array(this.balls.length).fill(0)

        this.flag = false
        this.rememberID = null
    }

    verticalScan () {
        /*
        for (let j = HorizonCol - 1; j >= 0; j--) {
            for (let i = 0; i < VerticalCol - 2; i++) {
                if (this.balls[idx].color === this.balls[idx + 1].color &&
                    this.balls[idx].color === this.balls[idx + 2].color) {
                    if (this.visited[idx]) {
                        // exist pair
                        this.visited[idx + 2] = this.visited[idx]
                    } else {
                        // new pair
                        this.lastID++
                        for (let k = 0; k < 3; k++) {
                            this.visited[idx + k] = this.lastID
                        }
                    }
                }
            }
        }
        */

        // 2~5消應該都可以?
        for (let j = HorizonCol - 1; j >= 0; j--) {
            let count = 0
            for (let i = 1; i < VerticalCol; i++) {
                let idx = mapIndex(i, j)
                // 偵測兩兩相同
                if (this.balls[idx].color === this.balls[idx - 1].color) {
                    count = count === 0 ? 2 : count + 1
                    // 走到尾部 提前處理
                    if ((i === VerticalCol - 1) && (count >= EliminateLength)) {
                        this.lastID++
                        for (let x = 0; x < count; x++) {
                            this.visited[idx - x] = this.lastID
                        }
                    }
                } else {
                    // 不再相同後 => 回頭將符合的標上visited
                    if (count >= EliminateLength) {
                        this.lastID++
                        for (let x = 0; x < count; x++) {
                            this.visited[idx - x - 1] = this.lastID
                        }
                    }
                    count = 0
                }
            }
        }
        /*
        this.visited 應該會像這樣:
        x x x 1 1 1
        2 2 2 x x x
        x x x x x x
        x 3 3 3 x x
        x x 4 4 4 4
        */
    }

    // 這裡應該還是限定3消 有空在改成2消也行
    // 重點是 2消通常只有1~2屬可以 好像會很複雜
    horizonScan () {
        for (let i = 0; i < VerticalCol; i++) {
            let count = 0
            for (let j = 1; j < HorizonCol; j++) {
                // 偵測兩兩相同
                if (this.balls[mapIndex(i, j)].color === this.balls[mapIndex(i, j - 1)].color) {
                    count++
                    if (j === HorizonCol - 1) {
                        // 處理相鄰
                        if (count >= (EliminateLength - 1)) {
                            this.lastID++
                        }
                        this.handleHorOverlap(i, j - 1, count, 1)
                        count = 0
                    }
                } else {
                    // 不再相同後 => 處理相鄰的橫排結合 | 處理多橫排合併
                    if (count >= 1) {
                        this.lastID++
                        this.handleHorOverlap(i, j - 1, count, 0)
                    }
                    count = 0
                }
            }
        }
    }

    handleHorOverlap (i, j, count, offset) {
        let firstID = 0
        let remainBall = []
        let overlapQueue = []

        for (let x = 0; x <= count; x++) {
            if (this.visited[(j - x + offset) * VerticalCol + i]) {
                overlapQueue.push(this.visited[(j - x + offset) * VerticalCol + i])
            } else if (count > 1) {
                remainBall.push((j - x + offset) * VerticalCol + i)
            }
        }

        if (overlapQueue.length) {
            firstID = Math.min(...overlapQueue)
        }
        for (const id of overlapQueue) {
            for (let x = 0; x < this.visited.length; x++) {
                if (this.visited[x] === id) this.visited[x] = firstID
            }
        }
        overlapQueue.length = 0
        // 沒有overlap的話 就用新ID
        // 處理掉相連時直排2珠也被偵測到的問題
        // 這邊還是有問題 remain的方法也不對 在想想ㄅ
        firstID = firstID === 0 ? (count === 1 ? false : this.lastID) : firstID
        if (firstID === 0) firstID = this.lastID

        // 回頭處理原本的直行
        for (const index of remainBall) {
            this.visited[index] = firstID
        }
    }

    printRecord () {
        let text = ''
        for (let i = 0; i < HorizonCol; i++) {
            for (let j = 0; j < VerticalCol; j++) {
                text += `${this.visited[i * VerticalCol + j] ? this.visited[i * VerticalCol + j] : 'x'} `
            }
            text += '\n'
        }
        console.log(text)
    }

    calcMatches () {
        this.verticalScan()
        this.horizonScan()

        // this.printRecord()

        let deleteList = new Array(this.lastID).fill([])
        for (let id = 1; id <= this.lastID; id++) {
            deleteList[id] = this.visited.reduce((arr, item, idx) => {
                if (item === id) arr.push(idx)
                return arr
            }, [])
        }
        deleteList = deleteList.filter(item => item.length)

        return deleteList
    }
}

export default Analyzer
