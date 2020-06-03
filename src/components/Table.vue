<template lang="pug">
    table.table
        thead
            tr
                td 
                    //- сделать выделение всех продуктов на странице                    
                    .table__checkbox(:model="checked") 
                td(v-for="item in productMatrix" v-if="item.checked === true" :key="item.value") {{item.name}}
                td
        tbody
            TableColumn(v-for="product in productsOnPage" :product="product" :key="product.id")
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import TableColumn from "./TableColumn.vue";

export default {
    name: "Table",
    components: {
        TableColumn
    },
    data() {
        return {
            checked: false
        };
    },
    computed: {
        ...mapState(["productMatrix"]),
        ...mapGetters(["productsOnPage"])
    }
};
</script>

<style lang="sass">
@import ../sass/mixins
.table
    width: 100%
    thead
        text-align: left
        border-bottom: 1px solid #EDEDED
        td
            font-weight: 600
    tbody
        tr
            &:nth-child(even)
                background: #F8F9FA
            &:hover
                background: rgba(0, 161, 30, 0.07)
                cursor: pointer
                .table__product
                    text-shadow: 0 0 .65px $color-default, 0 0 .65px $color-default
                .table__delete
                    display: block
    td
        padding: 12px
        height: 48px
    &__checkbox
        margin-top: 5px
        +checkbox
    &__delete
        // display: none
</style>
