<template lang="pug">
    tr
        td
            .table__checkbox(@click="changeChecked" :class="{checked : this.checked}")

        td(v-for="item in productMatrix" v-if="item.checked === true" :class="'table__' + item.value" :key="item.value") {{product[item.value]}}

        td
            button.table__delete Delete
                //- include ../assets/svg/basket.svg 
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";

export default {
    name: "TableColumn",
    props: ["product"],
    data() {
        return { checked: false };
    },
    computed: {
        ...mapState(["productMatrix"])
    },
    methods: {
        ...mapMutations(["changeDeleteArray"]),

        changeChecked: function() {
            this.checked = !this.checked;
            this.changeDeleteArray(this.product.id);
        }
    }
};
</script>
