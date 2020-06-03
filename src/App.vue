<template lang="pug">
    main.main#App
        h1  Table
        
        Loader( v-if="!isLoad && !loadAgain")
        button(@click="getProducts" v-if="loadAgain") Load again...

        Settings(v-if="isLoad")
        Table(v-if="isLoad")
</template>

<script>
import Loader from "./components/Loader.vue";
import Table from "./components/Table.vue";
import Settings from "./components/Settings.vue";
import { mapState } from "vuex";

export default {
    name: "App",
    components: {
        Loader,
        Table,
        Settings
    },
    computed: {
        ...mapState(["products", "loadAgain"]),
        isLoad: function() {
            return this.products.length != 0;
        }
    },
    methods: {
        getProducts: function() {
            this.$store.commit("load");
        }
    },
    mounted: function() {
        this.$store.commit("load");
    }
};
</script>

<style lang="sass">
@import sass/reset.css
@import sass/main
</style>
