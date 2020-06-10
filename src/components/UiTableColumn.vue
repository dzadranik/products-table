<template lang="pug">
    tr(:class="{active: product.id === oneIdToDelete}")
        td
            .table__checkbox(
                :class="{'checked' : isChecked}"
                @click="setDeletedProducts"
                )

        td(
            v-for="item in productMatrixChecked"
            :key="item.value"
            ) {{product[item.value]}}

        td
            button.table__button-delete(
                @click="showConfirm"
                data-button="delete"
                ) delete
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
    name: "UiTableColumn",
    props: { product: Object },
    computed: {
        ...mapState(["oneIdToDelete"]),
        ...mapGetters(["isCheckToDelete", "productMatrixChecked"]),
        isChecked: function() {
            return this.isCheckToDelete(this.product.id);
        }
    },
    methods: {
        ...mapMutations(["SET_DELETED_PRODUCTS", "SHOW_CONFIRM"]),

        setDeletedProducts: function() {
            let action = this.checked ? "remove" : "add";
            this.SET_DELETED_PRODUCTS({
                id: [this.product.id],
                action: action
            });
        },
        showConfirm: function(e) {
            this.SHOW_CONFIRM({ event: e, id: this.product.id });
        }
    }
};
</script>
