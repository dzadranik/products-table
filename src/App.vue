<template lang="pug">
    main.main#App
        h1 Table UI
        
        Loader( v-if="!isLoad && !errorLoad")
        button(@click="LOAD()" v-if="errorLoad") Load again...

        Settings(v-if="isLoad")
        Table(v-if="isLoad")

        Confirm(v-if="isConfirmShow")
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import Loader from "./components/Loader.vue";
import Settings from "./components/Settings.vue";
import Table from "./components/Table.vue";
import Confirm from "./components/Confirm.vue";

export default {
    name: "App",
    components: {
        Loader,
        Settings,
        Table,
        Confirm
    },
    computed: {
        ...mapState(["products", "errorLoad", "isConfirmShow"]),
        isLoad: function() {
            return this.products.length != 0;
        }
    },
    methods: {
        ...mapMutations(["LOAD"])
    },
    mounted: function() {
        this.LOAD();
    }
};
</script>

<style lang="sass">
@import ~@/sass/reset.css
@import ~@/sass/main
</style>
