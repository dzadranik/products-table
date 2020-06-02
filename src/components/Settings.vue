<template lang="pug">
    .settings
        div Sorting by:
        div
            button(v-for="item in columnButtons" :key="item.value" :class="{active : activeButton === item.value}" :data-value="item.value" @click="changeFirstColumn($event), activeButton = item.value") {{item.name}}

        button(:class="{active : productsToDelete.length > 0}") Delete ({{productsToDelete.length}})

        select(@change="changeTotalVisible")
            option(value="10") 10
            option(value="15") 15
            option(value="20") 20

        button(@click="changePage" data-value="prev")
            include ../assets/svg/prev.svg

        div {{firstProduct + 1}} - {{lastProduct}} of {{totalProducts}}

        button(@click="changePage" data-value="next")
            include ../assets/svg/next.svg
        div
            multiselect(
                placeholder="Pick at least one",
                select-label="Enter doesn’t work here!",
                v-model="value",
                :options="columnOptions",
                :multiple="true",
                :searchable="false"
                :close-on-select="false",
                :clear-on-select="false",
                :preserve-search="false",
                label="name",
                track-by="value",
                :preselect-first="true"
            )
                template(slot="selection", slot-scope="{values}")
                    span.multiselect__single {{ values.length }} columns selected


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
            columnButtons: { ...this.$store.state.productMatrix },
            columnOptions: [
                { value: "all", name: "Select All", checked: true },
                ...this.$store.state.productMatrix
            ],
            activeButton: ""
        };
    },
    computed: {
        ...mapState(["productsToDelete"]),
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
        },
        changeFirstColumn: function(e) {
            this.$store.commit(
                "changeFirstColumn",
                e.currentTarget.dataset.value
            );
        }
    }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="sass">
@import ../sass/mixins
.settings
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 20px
button
    fill: #333333
    background: transparent
    border: 0
    padding: 5px 10px
    margin: 0 5px
    color: $color-default
    border-radius: 2px
    &.active
        background: $color-green
        color: $color-white
        
</style>
