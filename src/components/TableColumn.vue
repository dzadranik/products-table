<template lang="pug">
    tr(:class="{active: product.id === deleteOneId}")
        td
            .table__checkbox(@click="changeChecked" :class="{'checked' : checked}")

        td(v-for="item in productMatrix" v-if="item.checked === true" :class="'table__' + item.value" :key="item.value") {{product[item.value]}}

        td
            button.table__button-delete(@click="showConfirm({'event': $event, 'id': product.id})" data-button="delete") delete
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
    name: "TableColumn",
    props: ["product"],
    computed: {
        ...mapState(["productMatrix", "deleteOneId"]),
        ...mapGetters(["isCheckToDelete"]),
        checked: function() {
            return this.isCheckToDelete(this.product.id);
        }
    },
    methods: {
        ...mapMutations(["changeDeleteArray", "showConfirm"]),

        changeChecked: function() {
            if (!this.checked) {
                this.changeDeleteArray({
                    id: [this.product.id],
                    action: "add"
                });
            } else {
                this.changeDeleteArray({
                    id: [this.product.id],
                    action: "remove"
                });
            }
        }
    }
};
</script>
