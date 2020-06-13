<template lang="pug">
    tr.table__tr(:class="{'is-active': product.id === productOneToDelete}")
        td.table__td
            .table__checkbox(
                :class="{'is-checked' : isChecked}"
                @click="setDeletedProducts"
                )

        td.table__td(
            v-for="item in productMatrixChecked"
            :key="item.value"
            ) {{product[item.value]}}

        td.table__td
            button.table__button-delete(
                @click="showConfirm"
                data-button="delete"
                ) delete
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
	name: "UiTableColumn",
	props: { product: Object },
	computed: {
		...mapState(["productOneToDelete"]),
		...mapGetters(["isCheckToDelete", "productMatrixChecked"]),
		isChecked: function() {
			return this.isCheckToDelete(this.product.id);
		}
	},
	methods: {
		...mapMutations(["SET_DELETED_PRODUCTS"]),
		...mapActions({ showConfirmDelete: "showConfirm" }),

		setDeletedProducts: function() {
			let action = this.checked ? "remove" : "add";
			this.SET_DELETED_PRODUCTS({
				id: [this.product.id],
				action: action
			});
		},
		showConfirm: function(e) {
			this.showConfirmDelete({ event: e, id: this.product.id });
		}
	}
};
</script>
