<template lang='pug'>
    v-container(fluid fill-height style='background-color: #0c0c0c')
        v-layout(row wrap)
            v-flex(xs12 md12)
                p.mt-3(style='font-size: 35px;color: orange;font-weight: 800;') TOS Simulator
                span#fps(style='color: yellow;font-size: 25px;font-family: "Orbitron", sans-serif;') 0
                br
                span(style='color: yellow;font-size: 25px;font-family: "Orbitron", sans-serif;') {{ comboList.length }} Combo

            v-flex(xs12 sm6 md6 lg5 offset-lg1)
                div.simulator-wrapper
                    canvas#simulator

            v-flex(xs12 sm6 md6 lg6)
                v-tabs.right-panel(v-model='mode' color='primary' style='border-radius: 10px 10px 0 0;' dark grow icons-and-text)
                    v-tabs-slider(color='yellow')
                    v-tab(href='#EDIT' style='font-size: 20px;') 版面設置
                        v-icon build
                    v-tab(href='#MOVE' style='font-size: 20px;') 轉珠模式
                        v-icon favorite
                    v-tab(href='#PATH' style='font-size: 20px;') 路徑規劃
                        v-icon gesture
                    v-tab-item(value='EDIT')
                        v-card.panel-card.pa-3(flat height=350)
                            p.white--text(style='font-size: 25px;') 選擇顏色
                            v-btn-toggle(v-model='selectedColor' mandatory)
                                v-btn.color-selection-btn(flat large)
                                    img(src='@/assets/Icon/w.png')
                                v-btn.color-selection-btn(flat large)
                                    img(src='@/assets/Icon/f.png')
                                v-btn.color-selection-btn(flat large)
                                    img(src='@/assets/Icon/p.png')
                                br
                                v-btn.color-selection-btn(flat large)
                                    img(src='@/assets/Icon/l.png')
                                v-btn.color-selection-btn(flat large)
                                    img(src='@/assets/Icon/d.png')
                                v-btn.color-selection-btn(flat large)
                                    img(src='@/assets/Icon/h.png')
                            br
                            v-btn.mt-3(@click='shuffle' large)
                                v-icon.mr-2 cached
                                span 隨機盤面
                            v-checkbox.mt-3(dark v-model='animationMode' label='啟用動畫' style='display:')
                    v-tab-item(value='MOVE')
                        v-card.panel-card.pa-3.combo-panel(flat height=350)
                            p.white--text(style='font-size: 25px;') 消珠結果
                            v-divider(dark)
                            template(v-for='combo in comboList')
                                div.combo-wrapper
                                    v-layout(row wrap)
                                        v-flex(xs2 offset-xs1)
                                            v-avatar.combo-type(color='primary' size=40 v-if='combo.mode === "首"')
                                                span.white--text.headline {{ combo.mode }}
                                            v-avatar.combo-type(color='red' size=40 v-if='combo.mode === "疊"')
                                                span.white--text.headline {{ combo.mode }}
                                        v-flex(xs9)
                                            img(width=40 src='@/assets/Icon/w.png' v-for='item in combo.balls' v-if='item === "w"')
                                            img(width=40 src='@/assets/Icon/f.png' v-for='item in combo.balls' v-if='item === "f"')
                                            img(width=40 src='@/assets/Icon/p.png' v-for='item in combo.balls' v-if='item === "p"')
                                            img(width=40 src='@/assets/Icon/l.png' v-for='item in combo.balls' v-if='item === "l"')
                                            img(width=40 src='@/assets/Icon/d.png' v-for='item in combo.balls' v-if='item === "d"')
                                            img(width=40 src='@/assets/Icon/h.png' v-for='item in combo.balls' v-if='item === "h"')
                                v-divider(dark)
                    v-tab-item(value='PATH')
                        v-card.panel-card.pa-3(flat height=350)
                            p 3
</template>

<script>
import Map from '../simulator/Map.js'
import Engine from '../simulator/Engine'
import ComboManager from '../simulator/ComboManager.js'
import { BallColorList } from '../simulator/Global'

export default {
    data: () => ({
        mode: 'EDIT',
        selectedColor: null,
        comboList: [],
        // comboCount: 0,
        animationMode: false,
    }),

    computed: {
        comboCount () {
            return ComboManager.comboCount || 0
        },
    },

    watch: {
        mode (cur, old) {
            Engine.setPanelMode(cur)
        },
        selectedColor (cur, old) {
            Map.setSelectedColor(BallColorList[cur])
        },
        animationMode (cur, old) {
            Map.setAnimationMode(cur)
        },
    },

    mounted () {
        Engine.start()
        this.comboList = ComboManager.comboList
        // this.comboCount = ComboManager.comboCount
    },

    methods: {
        shuffle () {
            Map.shuffle()
        },
    },
}
</script>
