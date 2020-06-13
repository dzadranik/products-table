<template lang="pug">
    tr.table__tr(:class="{'is-active': product.id === productOneToDelete}")
        td.table__td
            .table__checkbox(
                :class="{'is-checked' : isChecked}"
                @click="changeDeletedProducts"
                )

        td.table__td(
            v-for="item in productMatrixChecked"
            :key="item.value"
            ) {{product[item.value]}}

        td.table__td
            button.table__button-delete(
                @click="showConfirmDelete"
                data-button="delete"
                ) delete
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

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
		...mapActions(["showConfirm", "setDeletedProducts"]),

		changeDeletedProducts: function() {
			let action = this.isChecked ? "remove" : "add";
			this.setDeletedProducts({
				id: [this.product.id],
				action: action
			});
		},
		showConfirmDelete: function(e) {
			this.showConfirm({ event: e, id: this.product.id });
		}
	}
};
</script>
