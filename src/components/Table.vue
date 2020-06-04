<template lang="pug">
    table.table(v-if="isVisibleColumn")
        thead
            tr
                td.table__td--first                 
                    .table__checkbox(@click="checkedAll" :class="{'checked' : isAllCheckToDelete}")
                td(v-for="item in productMatrix" v-if="item.checked === true" @click="reversSort" :class="columnClass(item)" :key="item.value") {{item.name}}
                td.table__td--last
        tbody
            TableColumn(v-for="product in productsOnPage" :product="product" :key="product.id")
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import TableColumn from "./TableColumn.vue";

export default {
    name: "Table",
    components: {
        TableColumn
    },
    computed: {
        ...mapState(["productMatrix", "sortingActive", "isSortingReverse"]),
        ...mapGetters([
            "productsOnPage",
            "isVisibleColumn",
            "isAllCheckToDelete"
        ])
    },
    methods: {
        ...mapMutations(["changeDeleteArray", "reversSorting"]),

        checkedAll: function() {
            let ids = this.productsOnPage.map(item => item.id);
            if (!this.isAllCheckToDelete) {
                this.changeDeleteArray({
                    id: ids,
                    action: "add"
                });
            } else {
                this.changeDeleteArray({
                    id: ids,
                    action: "remove"
                });
            }
        },
        reversSort: function(e) {
            if (e.target.classList.contains("active")) {
                this.reversSorting();
            }
        },
        columnClass: function(item) {
            return [
                `table__td--${item.value}`,
                { active: this.sortingActive === item.value },
                {
                    reverse:
                        this.isSortingReverse &&
                        this.sortingActive === item.value
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
