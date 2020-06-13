<template lang="pug">
    main.main#App
        h1 Table UI
        
        Loader(v-if="isLoading && !errorLoad")
        button(
            v-if="errorLoad"
            @click="loadProducts()" 
            ) Load again...

        template(v-if="!isLoading && !errorLoad")
            UiTableSettings
            UiTable

        Confirm(v-if="isConfirmShow")
</template>

<script>
import { mapState, mapActions } from "vuex";
import Loader from "./components/Loader.vue";
import UiTableSettings from "./components/UiTableSettings.vue";
import UiTable from "./components/UiTable.vue";
import Confirm from "./components/Confirm.vue";

export default {
	name: "App",
	components: {
		Loader,
		UiTableSettings,
		UiTable,
		Confirm
	},
	computed: {
		...mapState(["products", "errorLoad", "isConfirmShow"]),
		isLoading() {
			return this.products.length > 0 ? false : true;
		}
	},
	methods: {
		...mapActions(["loadProducts"])
	},
	mounted: function() {
		this.loadProducts();
	}
};
</script>

<style lang="sass">
@import ~@/sass/reset.css
@import ~@/sass/main

.main
    max-width: 1140px
    margin: 40px auto 60px
</style>
