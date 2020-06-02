<template lang="pug">
    .settings
        div Sorting by:
        div
            button(v-for="item in productMatrix" :key="item") {{item[1]}}

        button Delete {{productsToDelete.length}}

        select(@change="changeTotalVisible")
            option(value="10") 10
            option(value="15") 15
            option(value="20") 20

        button(@click="changePage" data-value="prev")
            include ../assets/svg/prev.svg

        div {{firstProduct + 1}} - {{lastProduct}} of {{totalProducts}}

        button(@click="changePage" data-value="next")
            include ../assets/svg/next.svg

        multiselect(
            v-model="value",
            :options="options",
            :multiple="true",
            :close-on-select="false",
            :clear-on-select="false",
            :preserve-search="true",
            placeholder="Pick some"
            label="name",
            track-by="name",
            :preselect-first="true"
        )
            template(
            slot="selection"
            slot-scope="{ values, search, isOpen }"
            )
            span.multiselect__single(v-if="values.length && !isOpen")
                | {{ values.length }} options selected


</template>

<script>
import { mapState } from "vuex";
import Multiselect from "vue-multiselect";

export default {
    name: "Settings",
    components: {
        Multiselect
    },
    data() {
        return {
            value: [],
            options: [
                { name: "Vue.js", language: "JavaScript" },
                { name: "Adonis", language: "JavaScript" },
                { name: "Rails", language: "Ruby" },
                { name: "Sinatra", language: "Ruby" },
                { name: "Laravel", language: "PHP" },
                { name: "Phoenix", language: "Elixir" }
            ]
        };
    },
    computed: {
        ...mapState(["productsToDelete", "productMatrix"]),
        firstProduct: function() {
            return this.$store.getters.firstProduct;
        },
        lastProduct: function() {
            return this.$store.getters.lastProduct;
        },
        totalProducts: function() {
            return this.$store.getters.totalProducts;
        }
    },
    methods: {
        changePage: function(e) {
            this.$store.commit("changePage", e.currentTarget.dataset.value);
        },
        changeTotalVisible: function(e) {
            this.$store.commit("changeTotalVisible", e.currentTarget.value);
        }
    }
};
</script>

<style lang="sass" scoped>
.settings
    display: flex
    justify-content: space-between
    margin-bottom: 20px
button
    fill: #333333
</style>
