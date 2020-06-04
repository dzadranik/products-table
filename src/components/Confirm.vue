<template lang="pug">
    .confirm(:style="confirmPosition")
        .confirm__title Are you sure you want to 
            b delete item
            | ?
        button.confirm__button(@click="hideConfirm()")  Cancel
        button.confirm__button.confirm__button--confirm(@click="deleteProducts()") Confirm
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
function hideConfirm(e) {
    let isDeleteButton = e.target.dataset.button === "delete",
        isConfirm = e.target.closest(".confirm");
    if (!isConfirm && !isDeleteButton) {
        this.hideConfirm();
    }
}

export default {
    name: "Confirm",
    computed: {
        ...mapState(["confirmPosition"])
    },
    methods: {
        ...mapMutations(["hideConfirm"]),
        ...mapMutations({
            deleteProducts: "delete"
        })
    },
    mounted() {
        var vue = this;
        document.addEventListener("click", hideConfirm.bind(vue));
    },
    destroyed() {
        document.removeEventListener("click", hideConfirm);
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