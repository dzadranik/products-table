<template lang="pug">
    tr(:class="{active: product.id === oneIdToDelete}")
        td
            .table__checkbox(@click="changeDeletedProducts" :class="{'checked' : checked}")

        td(v-for="item in productMatrix" v-if="item.checked === true" :class="'table__' + item.value" :key="item.value") {{product[item.value]}}

        td
            button.table__button-delete(@click="showConfirm" data-button="delete") delete
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
    name: "TableColumn",
    props: ["product"],
    computed: {
        ...mapState(["productMatrix", "oneIdToDelete"]),
        ...mapGetters(["isCheckToDelete"]),
        checked: function() {
            return this.isCheckToDelete(this.product.id);
        }
    },
    methods: {
        ...mapMutations(["CHANGE_DELETED_PRODUCTS", "SHOW_CONFIRM"]),

        changeDeletedProducts: function() {
            let action = this.checked ? "remove" : "add";
            this.CHANGE_DELETED_PRODUCTS({
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
