<template lang="pug">
    .settings
        div Sorting by:
        div
            button(v-for="item in columnButtons" v-if="item.checked" :key="item.value" :class="{active : activeButton === item.value}" :data-value="item.value" @click="changeFirstColumn($event), activeButton = item.value") {{item.name}}

        button(:class="{active : productsToDelete.length > 0}") Delete ({{productsToDelete.length}})
        div
            multiselect(
                @input="changeTotalVisible"
                v-model="valueTotal"
                :options="optionsTotal"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                :preselect-first="true"
                :allow-empty="false"
            )
                template(slot="selection" slot-scope="{ values }")
                    span.multiselect__single(v-if="values") {{ values }} Per Page

        button(@click="changePage" data-value="prev")
            include ../assets/svg/prev.svg

        div {{firstProduct + 1}} - {{lastProduct}} of {{totalProducts}}

        button(@click="changePage" data-value="next")
            include ../assets/svg/next.svg
        
        .settings__column-select
            multiselect(
                @input="changeDisplayColumn"
                v-model="hideColumn"
                :options="columnOptions"
                :multiple="true"
                :searchable="false"
                :close-on-select="false"
                :preserve-search="false"
                :showLabels="false"
                label="name",
                track-by="value",
                placeholder="Select column"
            )
                template(slot="option", slot-scope="{ option }", dala-selected="option.checked")
                    .settings__option
                        .settings__checkbox
                        span {{ option.name }}
                template(slot="selection")
                    span.multiselect__single(v-if="selectionValues") {{ selectionValues }} columns selected


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
            columnButtons: { ...this.$store.state.productMatrix },
            optionsTotal: ["10", "15", "20"],
            valueTotal: "",
            activeButton: "product",
            hideColumn: [
                { value: "all", name: "Select All" },
                ...this.$store.state.productMatrix
            ],
            columnOptions: [
                { value: "all", name: "Select All" },
                ...this.$store.state.productMatrix
            ]
        };
    },
    computed: {
        ...mapState(["productsToDelete"]),
        ...mapGetters(["firstProduct", "lastProduct", "totalProducts"]),

        selectionValues: function() {
            if (this.hideColumn.length === this.columnOptions.length) {
                return this.hideColumn.length - 1;
            }
            return this.hideColumn.length;
        }
    },
    methods: {
        ...mapMutations([
            "CHANGE_PAGE",
            "CHANGE_TOTAL_VISIBLE",
            "CHANGE_FIRST_COLUMN"
        ]),
        changePage: function(e) {
            this.CHANGE_PAGE(e.currentTarget.dataset.value);
        },
        changeTotalVisible: function() {
            this.CHANGE_TOTAL_VISIBLE(this.valueTotal);
        },
        changeFirstColumn: function(e) {
            this.CHANGE_FIRST_COLUMN(e.currentTarget.dataset.value);
        },
        changeDisplayColumn: function() {
            let allIndex = this.hideColumn.findIndex(
                item => item.value === "all"
            );
            if (allIndex !== -1 && this.hideColumn.length < 6) {
                this.hideColumn = this.columnOptions;
            } else if (allIndex === -1 && this.hideColumn.length === 6) {
                this.hideColumn = [];
            } else if (allIndex !== -1 && this.hideColumn.length === 6) {
                this.hideColumn.splice(allIndex, 1);
            }
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
    &__column-select
        .multiselect
            width: 195px
    &__option
        display: flex
    &__checkbox
        margin: 1px 10px 0 0
        +checkbox

        
button
    background: transparent
    border: 0
    padding: 5px 10px
    margin: 0 5px
    color: $color-default
    border-radius: 2px
    &.active
        background: $color-green
        color: $color-white


.multiselect__tags
    padding: 6px 20px 0 6px

.multiselect__select
    background: url(~@/assets/svg/select-arrow.svg) no-repeat center center
    width: 10px
    height: 8px
    top: 15px
    right: 3px
    &:before
        display: none

.multiselect__single,
.multiselect__placeholder
    font-size: 14px
    line-height: 24px
    padding-left: 5px
    margin-bottom: 8px
    min-height: 20px
    padding-top: 0

.multiselect__option--highlight
    background: rgba(0, 161, 30, 0.07) !important
    color: $color-default !important

.multiselect__option--selected
    background: transparent

    .settings__checkbox
        background: $color-green url(~@/assets/svg/checked.svg) no-repeat center center
        border-color: $color-green
</style>
