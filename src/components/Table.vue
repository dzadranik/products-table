<template lang="pug">
    table
        thead
            tr
                th 
                    input(type="checkbox" v-model="checked") 
                th(v-for="item in productMatrix" :key="item") {{item[1]}}
                th
        TableColumn(v-for="product in products" :product="product" :key="product.id")
</template>

<script>
import { mapState } from "vuex";
import TableColumn from "./TableColumn.vue";

export default {
    name: "Table",
    components: {
        TableColumn
    },
    computed: {
        ...mapState(["productMatrix"]),
        products: function() {
            return this.$store.getters.productsOnPage;
        }
    }
};
</script>

<style lang="sass">
</style>
