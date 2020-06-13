<template lang="pug">
    .settings
        .settings__sorting
            .settings__sorting-title(:class="{disabled : !hasVisibleColumns}") Sorting by:
            button.settings__sorting-button(
                v-for="button in sortingButtons"
                :key="button.value"
                :disabled="!button.checked"
                :class="{'is-active' : sortingValue === button.value}"
                :data-value="button.value"
                @click="changeFirstColumn"
                ) {{button.name}}

        button.settings__button-delete(
            :disabled="isDeleteDisabled"
            @click="showConfirmDelete" 
            data-button="delete" 
            ) Delete {{totalDeletedProducts}}
        
        .settings__total-visible
            multiselect(
                v-model="productsTotalVisibleModel"
                :options="productsTotalVisibleOptions"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                :preselect-first="false"
                :allow-empty="false"
                :disabled="!hasVisibleColumns"
                @input="changeProductsTotalVisible"
                placeholder=""
            )
                template(v-slot:singleLabel="{ option }")
                    span.multiselect__single {{ option }} Per Page

        .settings__paging-nav
            button.settings__paging-button.settings__paging-button--prev(
                :disabled="productFirstIndex === 0 || !hasVisibleColumns"
                @click="changePageNumber"
                data-value="prev"
                )
                include ../assets/svg/prev.svg

            .settings__paging-title(:class="{disabled : !hasVisibleColumns}")
                b {{productFirstIndex + 1}}-{{productLastIndex}} 
                | of 
                b {{productsTotal}}

            button.settings__paging-button.settings__paging-button--next(
                :disabled="productLastIndex === productsTotal || !hasVisibleColumns"
                @click="changePageNumber"
                data-value="next"
                )
                include ../assets/svg/next.svg
            
        .settings__select-column
            multiselect(
                v-model="columnsVisibleModel"
                :options="columnsVisibleOptions"
                :multiple="true"
                :searchable="false"
                :close-on-select="false"
                :showLabels="false"
                @input="changeColumnsVisible"
                label="name",
                track-by="value",
                placeholder="Select columns"
            )
                template(v-slot:option="{ option }")
                    .settings__select-option
                        .settings__select-checkbox
                        span {{ option.name }}
                template(v-slot:selection="{isOpen}")
                    span.multiselect__single(v-if="columnsVisibleValue") {{ columnsVisibleValue }} columns selected
                    span.multiselect__single(v-if="!columnsVisibleValue && isOpen") 
                        b Select columns
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Multiselect from "vue-multiselect";

export default {
	name: "UiTableSettings",
	components: {
		Multiselect
	},
	computed: {
		...mapState([
			"productsToDelete",
			"sortingValue",
			"productsTotalVisible",
			"products"
		]),
		...mapGetters([
			"productFirstIndex",
			"productLastIndex",
			"hasVisibleColumns"
		]),

		productsTotal: function() {
			return this.products.length;
		},

		isDeleteDisabled: function() {
			return (
				this.productsToDelete.length === 0 || !this.hasVisibleColumns
			);
		},

		columnsVisibleValue: function() {
			if (
				this.columnsVisibleModel.length ===
				this.columnsVisibleOptions.length
			) {
				return this.columnsVisibleModel.length - 1;
			}
			return this.columnsVisibleModel.length;
		},
		totalDeletedProducts: function() {
			if (this.productsToDelete.length !== 0) {
				return `(${this.productsToDelete.length})`;
			}
			return "";
		}
	},
	data() {
		return {
			sortingButtons: { ...this.$store.state.productMatrix },

			productsTotalVisibleOptions: ["10", "15", "20"],
			productsTotalVisibleModel: this.$store.state.productsTotalVisible,

			columnsVisibleOptions: [
				{ value: "all", name: "Select All", checked: "checked" },
				...this.$store.state.productMatrix
			],
			columnsVisibleModel: [
				{ value: "all", name: "Select All" },
				...this.$store.state.productMatrix
			]
		};
	},
	methods: {
		...mapActions([
			"showConfirm",
			"setFirstColumn",
			"setColumnsVisible",
			"setPageNumber",
			"setProductsTotalVisible"
		]),
		showConfirmDelete: function(e) {
			this.showConfirm({ event: e });
		},
		changePageNumber: function(e) {
			this.setPageNumber(e.currentTarget.dataset.value);
		},
		changeProductsTotalVisible: function() {
			this.setProductsTotalVisible(this.productsTotalVisibleModel);
		},
		changeFirstColumn: function(e) {
			this.setFirstColumn(e.currentTarget.dataset.value);
		},

		changeColumnsVisible: function() {
			let allIndex = this.columnsVisibleModel.findIndex(
					item => item.value === "all"
				),
				allChecked = this.columnsVisibleOptions[0].checked,
				modelLength = this.columnsVisibleModel.length;

			if (
				allIndex === -1 &&
				allChecked === "checked" &&
				modelLength >= 6
			) {
				this.columnsVisibleModel = [];
				this.columnsVisibleOptions[0].checked = "unchecked";
			} else if (
				allIndex !== -1 &&
				allChecked === "checked" &&
				modelLength === 6
			) {
				this.columnsVisibleModel.splice(allIndex, 1);
				this.columnsVisibleOptions[0].checked = "unchecked";
			} else if (
				allIndex !== -1 &&
				allChecked === "unchecked" &&
				modelLength <= 6
			) {
				this.columnsVisibleModel = this.columnsVisibleOptions;
				this.columnsVisibleOptions[0].checked = "checked";
			} else if (
				allIndex === -1 &&
				allChecked === "unchecked" &&
				modelLength === 6
			) {
				this.columnsVisibleModel = this.columnsVisibleOptions;
				this.columnsVisibleOptions[0].checked = "checked";
			}
			let columnsValues = this.columnsVisibleModel.map(
				item => item.value
			);
			this.setColumnsVisible(columnsValues);
		}
	}
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="sass">
@import ../sass/mixins
@import ../sass/multiselect
=disabled
    &.is-disabled
        opacity: 0.15

.settings
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 20px

    &__sorting
        margin-right: auto
        display: flex
        align-items: center

    &__sorting-title
        margin-right: 10px
        font-weight: 600
        +disabled
        
    &__sorting-button
        margin: 0
        border-color: transparent
        padding-left: 6px
        padding-right: 6px

    &__button-delete:not(:disabled)
        background: $color-green
        border-color: $color-green
        color: $color-white

    &__total-visible
        width: 115px
        margin-right: 10px

    &__paging-nav
        display: flex
        align-items: center

    &__paging-button
        padding-left: 14px
        padding-right: 14px
        fill: $color-default
    
    &__paging-title
        margin-right: 10px
        +disabled

    &__select-column
        .multiselect
            width: 160px

    &__select-option
        display: flex
        padding-left: 5px

    &__select-checkbox
        margin: 5px 10px 0 0
        +checkbox
</style>
