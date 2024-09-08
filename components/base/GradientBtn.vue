<script setup>

</script>




<template>
    <v-btn min-width="150px" height="48px" class="gradient-btn text-white font-weight-bold" rounded="lg" >
        <slot />
    </v-btn>
</template>



<style lang="scss" scoped>


.gradient-btn {
    background: linear-gradient(to bottom right, rgb(var(--v-theme-primary)) 100%, rgb(var(--v-theme-primary-darken)));
}

</style>