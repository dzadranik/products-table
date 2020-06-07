<template lang="pug">
    main.main#App
        h1 Table UI
        
        Loader(v-if="isLoading && !errorLoad")
        button(
            v-if="errorLoad"
            @click="GET_PRODUCTS()" 
            ) Load again...

        template(v-if="!isLoading && !errorLoad")
            UiTableSettings
            UiTable

        Confirm(v-if="isConfirmShow")
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Loader from "./components/Loader.vue";
import UiTableSettings from "./components/UiTableSettings.vue";
import UiTable from "./components/UiTable.vue";
import Confirm from "./components/Confirm.vue";

export default {
    name: "App",
    components: {
        Loader,
        UiTableSettings,
        UiTable,
        Confirm
    },
    computed: {
        ...mapState(["isLoading", "errorLoad", "isConfirmShow"])
    },
    methods: {
        ...mapMutations(["GET_PRODUCTS"])
    },
    mounted: function() {
        this.GET_PRODUCTS();
    }
};
</script>

<style lang="sass">
@import ~@/sass/reset.css
@import ~@/sass/main
</style>
