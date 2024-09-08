<script setup lang="ts">
import type { ResponseData } from "~/interfaces/response/response.interface";
import type { UserOrder } from "~/interfaces/user/orders/order.interface";
import { heros } from "~/core/manager/AssetsManager";

const props = defineProps(["status"]);

// const status = ref("canceled");
const page = ref(1);
const orders = ref<ResponseData<UserOrder> | null>(null);
const sharedStore = useSharedStore();
const loading = ref(true);

const fetchOrdersListing = () => {
  loading.value = true;
  useAppFetch<ResponseData<UserOrder>>()
    .eventGetUserOrders(props.status, "all", page.value)
    .then((response) => {
      // has list
      if (orders.value) {
        orders.value.data.push(...response.data);
        orders.value.meta = response.meta;
        return;
      }

      // first time
      orders.value = response;
    })
    .catch((error) => {
      sharedStore.SET_ERROR(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const loadMoreHandler = () => {
  if (!orders.value) return;

  // increament page value
  page.value++;

  // check if max page number is >= last_page set last_page value to current page
  if (orders.value.meta.current_page >= orders.value.meta.last_page) {
    page.value = orders.value.meta.last_page;
    return;
  }

  // fetch data of new page
  fetchOrdersListing();
};

const refreshData =()=>{
  orders.value=null;
  fetchOrdersListing();
}
onMounted(() => {
  fetchOrdersListing();
});
</script>
<template>
  <v-sheet color="transparent" class="py-16">
    <v-row v-if="loading">
      <template v-for="i in 8">
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader
            class="border"
            type="image, article"
          ></v-skeleton-loader>
        </v-col>
      </template>
    </v-row>

    <v-row v-if="orders">
      <v-col
        cols="12"
        md="4"
        lg="3"
        sm="6"
        v-for="(order, index) in orders?.data"
        :key="index"
      >
        <UserOrdersCardsOrderCardVertical :status="status" :userOrder="order"/>
      </v-col>
    </v-row>

    <div
      v-if="orders && orders.meta.current_page < orders.meta.last_page"
      class="mt-16 d-flex justify-center"
    >
      <v-btn
        class="load-more text-white"
        @click="loadMoreHandler"
        color="primary"
        rounded="lg"
        width="175px"
        height="50"
        >{{ $t('load_more') }}</v-btn
      >
    </div>
  </v-sheet>
  <v-sheet
    v-if="orders && !!!orders.data.length"
    color="transparent"
    class="py-16"
  >
    <div class="d-flex align-center justify-center flex-column">
      <v-sheet
        color="transparent"
        width="100%"
        max-width="600"
        :height="$vuetify.display.smAndDown ? '400' : '600'"
      >
        <v-img :src="heros.hero_11" width="100%" height="100%" contain> </v-img>
      </v-sheet>
      <BaseGradientBtn :ripple="false"> {{ $t('no_requests') }} </BaseGradientBtn>
    </div>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
