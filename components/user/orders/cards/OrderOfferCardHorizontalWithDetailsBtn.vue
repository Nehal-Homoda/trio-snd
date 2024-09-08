<script setup lang="ts">
import { heros } from "~/core/manager/AssetsManager";
import RoutesManager from "~/core/manager/RoutesManager";
import type { UserOffer } from "~/interfaces/user/orders/order.interface";

const props = defineProps<{
  userOffer: UserOffer;
}>();
</script>

<template>
  <v-container>
    <v-card
      class="pa-5 d-flex justify-space-between align-center card-border"
      :class="$vuetify.display.smAndDown ? 'flex-column ga-3' : ''"
      rounded="lg"
    >
      <v-sheet width="100px" height="100px">
        <v-img width="100%" height="100%" :src="userOffer.service.icon_path">
        </v-img>
      </v-sheet>

      <div class="d-flex flex-column text-md-h5 text-h6 align-center">
        <span class="font-weight-bold text-center"> {{ $t('order_number') }}</span>
        <v-card-subtitle class="text-primary text-h6 font-weight-bold mt-2">
          {{ userOffer.uid }}
        </v-card-subtitle>
      </div>

      <div class="text-h6 d-flex align-center ga-2">
        <v-icon
          size="25"
          icon="mdi-clock-outline"
          color="primary"
          class=""
        ></v-icon>
        {{ userOffer.created_at }}
      </div>
      <v-btn
        min-width="175"
        height="45px"
        color="primary"
        class="text-white"
        rounded="lg"
        @click="goTo(RoutesManager.userOrderDetails.replace('__order_id__',$route.params.id.toString()))"
        >{{ $t('order_details') }}</v-btn
      >
    </v-card>
  </v-container>
</template>

<style lang="scss">
.card-border {
  box-shadow: 0 0 0 0.5px #e0ddddbe !important  ;
}
</style>
