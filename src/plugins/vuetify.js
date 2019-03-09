import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import {
    VTab,
    VCheckbox,
    VIcon
} from 'vuetify'

Vue.use(Vuetify, {
    iconfont: 'md',
    components: {
        VTab,
        VCheckbox,
        VIcon,
    },
})
