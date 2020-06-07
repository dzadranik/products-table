<template lang="pug">
    .confirm(:style="confirmPosition")
        div(v-show="!isDeleting")
            .confirm__title(v-if="!errorDelete") Are you sure you want to 
                b delete item
                | ?
            .confirm__title(v-if="errorDelete") Oooops, try again...
            
            button.confirm__button(@click="HIDE_CONFIRM()") Cancel
            button.confirm__button.confirm__button--confirm(@click="DELETE_PRODUCTS()") Confirm

        loader(v-if="isDeleting")

</template>

<script>
import { mapState, mapMutations } from "vuex";
import loader from "./Loader.vue";

export default {
    name: "Confirm",
    components: { loader },
    computed: {
        ...mapState(["confirmPosition", "errorDelete", "isDeleting"])
    },
    methods: {
        ...mapMutations(["HIDE_CONFIRM", "DELETE_PRODUCTS"]),
        hideConfirm: function(e) {
            let isDeleteButton = e.target.dataset.button === "delete",
                isConfirm = e.target.closest(".confirm");
            if (!isConfirm && !isDeleteButton) {
                this.HIDE_CONFIRM();
            }
        }
    },
    mounted() {
        document.addEventListener("click", this.hideConfirm);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.hideConfirm);
    }
};
</script>

<style scoped lang="sass">
@import ~@/sass/mixins
.confirm
    border: 1px solid $color-border
    padding: 16px
    background: $color-white
    position: absolute
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16)
    border-radius: 4px
    text-align: center
    transform: translate(-50%, 10px)
    min-width: 250px

    &__title
        margin-bottom: 10px

    &__button
        padding-left: 15px
        padding-right: 15px
            
        &--confirm
            background: $color-green
            border-color: $color-green
            color: $color-white
</style>