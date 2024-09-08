<script setup lang="ts">
// const dialog=ref(false);
// const emit=defineEmits(['confirm'])
// const confirm=()=>{
//   dialog.value=false
//   emit('confirm')
  
// }
const props=defineProps(['loading','dialog'])
</script>


<template>
  <v-dialog v-model="props.dialog"  max-width="350" >
    <template v-slot:activator="{ props: activatorProps }">
      <slot v-bind="activatorProps"></slot>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card  class="pb-7 pt-3 px-10" title="" rounded="lg">
        <h2 class="text-center mb-10">{{ $t('are_you_sure') }}</h2>
        <slot name="delete-message"></slot>
        <div class="d-flex justify-space-between align-center">
          <v-btn width="45%"  rounded="lg" color="primary" variant="outlined" @click="isActive.value = false">{{ $t('cancel') }}</v-btn>
          <v-btn :loading="props.loading" width="45%" @click="$emit('confirm')" class="text-white" rounded="lg" color="primary">{{ $t('confirm') }}</v-btn>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>


<style scoped lang="scss">
</style>