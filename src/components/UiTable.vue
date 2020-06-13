<template lang="pug">
    table.table(v-if="hasVisibleColumns")
        thead.table__thead
            tr 
                td.table__td.table__td--first                 
                    .table__checkbox(
                        :class="{'is-checked' : isAllCheckToDelete}"
                        @click="checkedAll" 
                        )
                td.table__td(
                    v-for="item in productMatrixChecked"
                    :key="item.value"
                    :class="getColumnClass(item)"
                    @click="reversSorting"
                    ) {{item.name}}
                td.table__td.table__td--last
        tbody
            UiTableColumn(
                v-for="product in productsOnPage"
                :key="product.id"
                :product="product"
                )
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
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
			if (e.target.classList.contains("is-active")) {
				this.REVERS_SORTING();
			}
		},
		getColumnClass: function(item) {
			return [
				`table__td--${item.value}`,
				{ "is-active": this.sortingValue === item.value },
				{
					"is-reverse":
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

    &__thead
        text-align: left
        border-bottom: 1px solid #EDEDED
        .table__td
            font-weight: 600
            vertical-align: middle
            &.is-active
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
            &.is-reverse:after
                transform: rotate(0) 

    &__tr
        &:nth-child(even)
            background: #F8F9FA
        &:hover,
        &.is-active
            background: rgba(0, 161, 30, 0.07)
            .table__product
                text-shadow: 0 0 .52px $color-default, 0 0 .52px $color-default
            .table__button-delete
                display: flex

    &__td
        padding: 0 12px
        vertical-align: middle
        height: 50px
        box-sizing: border-box
        &--first
            width: 60px
        &--product
            width: 300px
        &--last
            width: 120px

    &__checkbox
        float: right
        cursor: pointer
        +checkbox
        &.is-checked
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
