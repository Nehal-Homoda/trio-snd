<template>
    <div>
        <h2 class="mb-10 font-weight-bold text-h3 ga-2">
            <bdi class="text-primary"> {{ first }} </bdi>  <bdi class=""> {{ second }} </bdi> 
        </h2>

    </div>
</template>

<script setup lang="ts">

const props = defineProps(['first', 'second'])

</script>

<style scoped></style>