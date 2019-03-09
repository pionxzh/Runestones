export const ICON_SIZE = 50
export const DROP_SPEED = 4
export const DELETE_SPEED = 10
export const EXCHANGE_SPEED = 6
export const BallColorList = ['w', 'f', 'p', 'l', 'd', 'h']
export const BallState = {
    NORMAL: 0,
    SELECTED: 1,
    MOVING: 2,
    DELETING: 3,
    DELETED: 4,
    DROPPING: 5,
    EXCHANGING: 6,
}

// panelMode 為遊戲狀態 指遊戲內部的版面變化等
export const PANEL_MODE = {
    EMPTY: 1,
    EDIT: 2,
    TEAM: 3,
    MOVE: 4,
    REPLAY: 5,
    PATH: 6,
}

// mapMode 為盤面狀態 版面設置等外部大狀態
export const GAME_STATE = {
    WAITING: 0,
    MOVING: 1,
    TRY_DELETE: 2,
    DELETING: 3,
    TRY_DROP: 4,
    DROPPING: 5,
}

// 8個方向 就像鍵盤右手邊那樣
export const Direction8 = {
    TENKEY_1: 1, // </
    TENKEY_2: 2, // ↓
    TENKEY_3: 3, // \>
    TENKEY_4: 4, // ←
    TENKEY_5: 5, // x
    TENKEY_6: 6, // →
    TENKEY_7: 7, // <\
    TENKEY_8: 8, // ↑
    TENKEY_9: 9, // />
}
