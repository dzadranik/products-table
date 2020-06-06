<template lang="pug">
    table.table(v-if="hasVisibleColumns")
        thead
            tr 
                td.table__td--first                 
                    .table__checkbox(
                        :class="{'checked' : isAllCheckToDelete}"
                        @click="checkedAll" 
                        )
                td(
                    v-for="item in productMatrixChecked"
                    :key="item.value"
                    :class="getColumnClass(item)"
                    @click="reversSorting"
                    ) {{item.name}}
                td.table__td--last
        tbody
            UiTableColumn(
                v-for="product in productsOnPage"
                :key="product.id"
                :product="product"
                )
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import UiTableColumn from "./UiTableColumn.vue";

export default {
    name: "UiTable",
    components: { UiTableColumn },
    computed: {
        ...mapState(["sortingValue", "isSortingReverse"]),
        ...mapGetters([
            "productsOnPage",
            "hasVisibleColumns",
            "isAllCheckToDelete",
            "productMatrixChecked"
        ])
    },
    methods: {
        ...mapMutations(["SET_DELETED_PRODUCTS", "REVERS_SORTING"]),

        checkedAll: function() {
            let indexes = this.productsOnPage.map(item => item.id);
            if (!this.isAllCheckToDelete) {
                this.SET_DELETED_PRODUCTS({
                    id: indexes,
                    action: "add"
                });
            } else {
                this.SET_DELETED_PRODUCTS({
                    id: indexes,
                    action: "remove"
                });
            }
        },
        reversSorting: function(e) {
            if (e.target.classList.contains("active")) {
                this.REVERS_SORTING();
            }
        },
        getColumnClass: function(item) {
            return [
                `table__td--${item.value}`,
                { active: this.sortingValue === item.value },
                {
                    reverse:
                        this.isSortingReverse &&
                        this.sortingValue === item.value
                }
            ];
        }
    }
};
</script>

<style lang="sass">
@import ~@/sass/mixins
.table
    width: 100%

    thead
        text-align: left
        border-bottom: 1px solid #EDEDED
        td
            font-weight: 600
            vertical-align: middle
            &.active
                color: $color-green
                cursor: pointer
                &:after
                    display: inline-block
                    content: ''
                    background-image: $icon-sort
                    width: 8px
                    height: 12px
                    background-position: center
                    background-repeat: no-repeat
                    margin-left: 10px
                    position: relative
                    bottom: -2px
                    transform: rotate(180deg)
            &.reverse:after
                transform: rotate(0) 

    tbody
        tr
            &:nth-child(even)
                background: #F8F9FA
            &:hover,
            &.active
                background: rgba(0, 161, 30, 0.07)
                .table__product
                    text-shadow: 0 0 .52px $color-default, 0 0 .52px $color-default
                .table__button-delete
                    display: flex

    td
        padding: 0 12px
        vertical-align: middle
        height: 50px
        box-sizing: border-box

    &__td
        &--first
            width: 60px
        &--product
            min-width: 300px
        &--last
            width: 120px

    &__checkbox
        float: right
        cursor: pointer
        +checkbox
        &.checked
            +checkbox-checked

    &__button-delete
        display: none
        border: 0
        align-items: center
        &:before
            content: ''
            display: inline-block
            background-image: $icon-delete
            background-position: center
            background-repeat: no-repeat
            width: 16px
            height: 16px
            margin-right: 7px
</style>
