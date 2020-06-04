<template lang="pug">
    main.main#App
        h1 Table UI
        
        Loader( v-if="!isLoad && !loadAgain")
        button(@click="getProducts" v-if="loadAgain") Load again...

        Settings(v-if="isLoad")
        Table(v-if="isLoad")
        Confirm(v-if="isShowConfirm")
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import Loader from "./components/Loader.vue";
import Table from "./components/Table.vue";
import Settings from "./components/Settings.vue";
import Confirm from "./components/Confirm.vue";

export default {
    name: "App",
    components: {
        Loader,
        Table,
        Settings,
        Confirm
    },
    computed: {
        ...mapState(["products", "loadAgain", "isShowConfirm"]),
        isLoad: function() {
            return this.products.length != 0;
        }
    },
    methods: {
        ...mapMutations(["load"]),
        getProducts: function() {
            this.load();
        }
    },
    mounted: function() {
        this.load();
    }
};
</script>

<style lang="sass">
@import ~@/sass/reset.css
@import ~@/sass/main
</style>
