<script setup lang="ts">

import type { Provider, UserOffer } from "~/interfaces/user/orders/order.interface";

const props = defineProps<{
  availableProvider: Provider;
  downloadDetails : UserOffer;
}>();
</script>

<template>
  <v-container>
    <div
      class="d-flex justify-space-between align-center"
      :class="$vuetify.display.smAndDown ? 'flex-column ga-4' : ''"
    >
      <div
        class="d-flex ga-6"
        :class="$vuetify.display.smAndDown ? 'flex-column align-center' : ''"
      >
        <v-avatar
          :image="props.availableProvider.avatar_path"
          rounded="lg"
          size="70"
          class="half-shadow"
        >
        </v-avatar>
        <v-sheet width="200px" class="d-flex flex-column justify-center align-center">
          <p
            class="text-md-h6 h6 font-weight-bold text-brand-color-text-default"
          >
             {{ $t('order_number') }}
          </p>
          <p class="text-primary">
            {{ props.availableProvider.company_name }}
          </p>
        </v-sheet>
      </div>
      <div class="d-flex flex-column align-center ga-2">
        <p
          class="text-brand-color-text-default font-weight-bold text-md-h5 h6 text-center"
        >
          {{ props.availableProvider.name }}
        </p>
        <!-- <span  class="mdi mdi-star text-primary "></span> -->
        <v-rating
          size="25"
          active-color="primary"
          readonly
          empty-icon="mdi-star"
          color="blue-grey-lighten-5"
          v-model="props.availableProvider.avg_rate"
        ></v-rating>
      </div>
      <div class="d-flex flex-column align-center ga-2">
        <p
          class="text-brand-color-text-default font-weight-bold text-md-h5 h6 text-center"
        >
          {{ $t('phone_number') }} 
        </p>
        <p class="text-primary font-weight-bold text-md-h5 h6 text-center">
          {{ props.availableProvider.full_phone_number }}
        </p>
      </div>
      <div class="d-flex ga-4">
        <v-btn icon :ripple="false" :href="props.downloadDetails.invoice_path" target="blank">
            <v-icon color="primary" size="x-large">mdi-download</v-icon>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style lang="scss">
.half-shadow {
  box-shadow: 0 0 0 2px #fff, 3px 3px 10px #0000002a !important;
}
</style>
