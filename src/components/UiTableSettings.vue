<template lang="pug">
    .settings
        .settings__sorting
            .settings__sorting-title(:class="{disabled : !hasVisibleColumns}") Sorting by:
            button(
                v-for="button in sortingButtons"
                :key="button.value"
                :disabled="!button.checked"
                :class="{active : sortingValue === button.value}"
                :data-value="button.value"
                @click="setFirstColumn"
                ) {{button.name}}

        button.settings__button-delete(
            :disabled="isDeleteDisabled"
            @click="showConfirm" 
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
                @input="setProductsTotalVisible"
                placeholder=""
            )
                template(v-slot:singleLabel="{ option }")
                    span.multiselect__single {{ option }} Per Page

        .settings__paging-nav
            button.settings__paging-button.settings__paging-button--prev(
                :disabled="productFirstIndex === 0 || !hasVisibleColumns"
                @click="setPageNumber"
                data-value="prev"
                )
                include ../assets/svg/prev.svg

            .settings__paging-title(:class="{disabled : !hasVisibleColumns}")
                b {{productFirstIndex + 1}}-{{productLastIndex}} 
                | of
                b {{productsTotal}}

            button.settings__paging-button.settings__paging-button--next(
                :disabled="productLastIndex === productsTotal || !hasVisibleColumns"
                @click="setPageNumber"
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
                @input="setColumnsVisible"
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
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
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
            "productsTotalVisible"
        ]),
        ...mapGetters([
            "productFirstIndex",
            "productLastIndex",
            "productsTotal",
            "hasVisibleColumns"
        ]),

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
        ...mapMutations([
            "SET_PAGE_NUMBER",
            "SET_PRODUCTS_TOTAL_VISIBLE",
            "SET_FIRST_COLUMN",
            "SET_COLUMNS_VISIBLE",
            "SHOW_CONFIRM"
        ]),
        showConfirm: function(e) {
            this.SHOW_CONFIRM({ event: e });
        },
        setPageNumber: function(e) {
            this.SET_PAGE_NUMBER(e.currentTarget.dataset.value);
        },
        setProductsTotalVisible: function() {
            this.SET_PRODUCTS_TOTAL_VISIBLE(this.productsTotalVisibleModel);
        },
        setFirstColumn: function(e) {
            this.SET_FIRST_COLUMN(e.currentTarget.dataset.value);
        },

        setColumnsVisible: function() {
            //refact ---- !!!!!! ??includes
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
            this.SET_COLUMNS_VISIBLE(columnsValues);
        }
    }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="sass">
@import ../sass/mixins
@import ../sass/multiselect
=disabled
    &.disabled
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
        button
            margin: 0
            border-color: transparent
            padding-left: 6px
            padding-right: 6px

    &__sorting-title
        margin-right: 10px
        font-weight: 600
        +disabled

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
