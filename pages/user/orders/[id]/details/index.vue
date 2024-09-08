<script setup lang="ts">
import RoutesManager from "~/core/manager/RoutesManager";
import { heros } from "~/core/manager/AssetsManager";
import type { ResponseWithValue } from "~/interfaces/response/response.interface";
import type {
  Option,
  UserOffer,
} from "~/interfaces/user/orders/order.interface";
const makeOrderStore = useMakeOrderStore();
const route = useRoute();

const orderDetails = ref<UserOffer | null>(null);

const mulitImage = computed(() => {
  if (!orderDetails.value) return;
  [];

  const ar: string[] = [];

  orderDetails.value.options.forEach((item, index) => {
    if (item.type === "multi_image" || item.type === "image") {
      // item.native_value
      ar.push(item.native_value);
    }
  });

  return [...ar];
});

const mulitFile = computed(() => {
  if (!orderDetails.value) return;
  [];

  const ar: string[] = [];

  orderDetails.value.options.forEach((item, index) => {
    if (item.type === "file") {
      // item.native_value
      ar.push(item.native_value);
    }
  });

  return [...ar];
});

const unRepeatedOptions = computed(() => {
  if (!orderDetails.value) return;
  [];

  let arID: number[] = [];
  let ar: Option[] = [];

  orderDetails.value.options.forEach((item, index) => {
    if (!arID.includes(item.id)) {
      arID.push(item.id);
      ar.push(item);
    }
  });

  return ar;
});
const localePath = useLocalePath();
const fetchOrderOffer = () => {
  useAppFetch<ResponseWithValue<UserOffer>>()
    .eventGetUserOrder(route.params.id.toString())
    .then((response) => {
      orderDetails.value = response.data;
    });
};

const reorder = () => {
  goTo(
    RoutesManager.editOrderForm.replace(
      "__order_id__",
      route.params.id.toString()
    )
  );
};

definePageMeta({ middleware: ["auth", "order-details"] });
onMounted(() => {
  fetchOrderOffer();
});
</script>
<template>
  <v-sheet color="transparent" class="py-16">
    <v-container>
      <div
        v-if="makeOrderStore.optionsLoading && !makeOrderStore.orderOptions && !orderDetails"
        class="d-flex justify-center align-center my-16"
      >
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <div
        v-if="
          !makeOrderStore.optionsLoading &&
          makeOrderStore.orderOptions &&
          !!!makeOrderStore.orderOptions.data.length
        "
        class="d-flex align-center justify-center flex-column"
      >
        <v-sheet
          color="transparent"
          width="100%"
          max-width="600"
          :height="$vuetify.display.smAndDown ? '400' : '600'"
        >
          <v-img :src="heros.hero_11" width="100%" height="100%" contain>
          </v-img>
        </v-sheet>
        <BaseGradientBtn
          @click="goTo(RoutesManager.categories)"
          :ripple="false"
        >
          {{ $t('unavailable_service') }}  
        </BaseGradientBtn>
      </div>
      <UserOrdersFormsDetailsOrderForm />
    </v-container>
  </v-sheet>
</template>

<style scoped>
.image-box {
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
  border-radius: 8px;
}
</style>
