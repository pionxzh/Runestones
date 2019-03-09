<template lang='pug'>
    v-app
        v-toolbar(app)
            v-toolbar-title.headline.text-uppercase
                span TOS
                span.ml-1.font-weight-light SIMULATOR
            v-spacer
            v-btn(flat icon)
                v-icon.mr-5 settings
        v-content
            router-view

</template>

<style lang='stylus'>
    @import './stylus/main'
</style>

<script>

export default {
    data: () => ({

    }),
}
</script>
