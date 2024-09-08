<script setup lang="ts">
import { heros } from '~/core/manager/AssetsManager';
import RoutesManager from "~/core/manager/RoutesManager";
import orderDetails from '~/middleware/orderDetails';
const makeOrderStore = useMakeOrderStore();


definePageMeta({ middleware: ['auth', 'make-order'] })


</script>

<template>
  <v-sheet color="transparent" class="py-16">
    <v-container>
      <div v-if="makeOrderStore.optionsLoading  && !makeOrderStore.orderOptions?.data.length && !orderDetails" class="d-flex justify-center align-center my-16">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
      <div
        v-if="!makeOrderStore.optionsLoading && makeOrderStore.orderOptions && !!!makeOrderStore.orderOptions.data.length"
        class="d-flex align-center justify-center flex-column">
        <v-sheet color="transparent" width="100%" max-width="600" :height="$vuetify.display.smAndDown ? '400' : '600'">
          <v-img :src="heros.hero_11" width="100%" height="100%" contain> </v-img>
        </v-sheet>
        <BaseGradientBtn @click="goTo(RoutesManager.categories)" :ripple="false">{{ $t('unavailable_service') }}</BaseGradientBtn>
      </div>
      <UserOrdersFormsCreateOrderForm v-if="!makeOrderStore.optionsLoading" />
    </v-container>
  </v-sheet>
</template>

<style scoped></style>
