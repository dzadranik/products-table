<template lang="pug">
    tr(@click="changeChecket")
        td
            input(type="checkbox" v-model="checked") 
        td(v-for="item in productMatrix" :key="item" v-if="item[2] === true") {{product[item[0]]}}

        td 
            button(v-if="this.checked") Delete
                include ../assets/svg/basket.svg 
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "TableColumn",
    props: ["product"],
    data: function() {
        return { checked: false };
    },
    computed: {
        ...mapState(["productMatrix"])
    },
    methods: {
        changeChecket: function() {
            this.checked = !this.checked;
            this.$store.commit("changeDeleteArray", this.product.id);
        }
    }
};
</script>
