<template lang="pug">
    .settings
        .settings__sorting
            .settings__sorting-title Sorting by:
            button(v-for="button in sortingButtons" :disabled="!button.checked" :key="button.value" :class="{active : sortingActive === button.value}" :data-value="button.value" @click="changeFirstColumn") {{button.name}}

        button.settings__button-delete(@click="showConfirm({'event': $event})" data-button="delete" :disabled="productsToDelete.length === 0 || !isVisibleColumn") Delete {{totalDeletedProducts}}
        
        .settings__total-visible
            multiselect(
                @input="changeTotalVisible"
                v-model="totalVisibleModel"
                :options="totalVisibleOptions"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                :preselect-first="true"
                :allow-empty="false"
                :disabled="!isVisibleColumn"
                placeholder=""
            )
                template(slot="singleLabel" slot-scope="{ option }")
                    span.multiselect__single {{ option }} Per Page

        .settings__paging-nav
            button.settings__paging-button.settings__paging-button--prev(@click="changePageNumber" :disabled="firstProduct === 0 || !isVisibleColumn" data-value="prev")
                include ../assets/svg/prev.svg

            .settings__paging-title 
                b {{firstProduct + 1}}-{{lastProduct}} 
                | of 
                b {{totalProducts}}

            button.settings__paging-button.settings__paging-button--next(@click="changePageNumber"  :disabled="lastProduct === totalProducts || !isVisibleColumn" data-value="next")
                include ../assets/svg/next.svg
            
        .settings__select-column
            multiselect(
                @input="changeDisplayColumn"
                v-model="columnsVisibleModel"
                :options="columnsVisibleOptions"
                :multiple="true"
                :searchable="false"
                :close-on-select="false"
                :showLabels="false"
                label="name",
                track-by="value",
                placeholder="Select columns"
            )
                template(slot="option", slot-scope="{ option }", dala-selected="option.checked")
                    .settings__select-option
                        .settings__select-checkbox
                        span {{ option.name }}
                template(slot="selection")
                    span.multiselect__single(v-if="columnsVisibleValue") {{ columnsVisibleValue }} columns selected
</template>

<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import Multiselect from "vue-multiselect";

export default {
    name: "Settings",
    components: {
        Multiselect
    },
    data() {
        return {
            sortingButtons: { ...this.$store.state.productMatrix },

            totalVisibleOptions: ["10", "15", "20"],
            totalVisibleModel: "",

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
    computed: {
        ...mapState(["productsToDelete", "sortingActive"]),
        ...mapGetters([
            "firstProduct",
            "lastProduct",
            "totalProducts",
            "isVisibleColumn"
        ]),

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
    methods: {
        ...mapMutations([
            "CHANGE_PAGE_NUMBER",
            "CHANGE_TOTAL_VISIBLE",
            "CHANGE_FIRST_COLUMN",
            "CHANGE_DISPLAY_COLUMN",
            "showConfirm"
        ]),
        changePageNumber: function(e) {
            this.CHANGE_PAGE_NUMBER(e.currentTarget.dataset.value);
        },
        changeTotalVisible: function() {
            this.CHANGE_TOTAL_VISIBLE(this.totalVisibleModel);
        },
        changeFirstColumn: function(e) {
            this.CHANGE_FIRST_COLUMN(e.currentTarget.dataset.value);
        },

        changeDisplayColumn: function() {
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
            this.CHANGE_DISPLAY_COLUMN(columnsValues);
        }
    }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="sass">
@import ../sass/mixins
@import ../sass/multiselect

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
