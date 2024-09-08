<script setup lang="ts">
import type {
  OrderOption,
  OrderOptionsResponse,
} from "~/interfaces/user/orders/orderOptions.interface";
import type { UserServicesList } from "~/interfaces/user/services-list/servicesList.interface";
import { heros } from "~/core/manager/AssetsManager";
import RoutesManager from "~/core/manager/RoutesManager";
import { useNotification } from "@kyvg/vue3-notification";
import type { currency } from "~/interfaces/shared/shared.interface";
import type { ResponseData } from "~/interfaces/response/response.interface";

const { notify } = useNotification();
const localePath = useLocalePath();
const sharedStore = useSharedStore();
const makeOrderStore = useMakeOrderStore();
const { submitMakeOrder, orderValidate, saveOrder, submitRelistOrder } =
  useMakeOrderStore();
const {
  orderFormData,
  orderOptions,
  isOrderCompletedSuccessfully,
  targetPrice,
  currencyId,
  submitLoading,
  selectedChildService,
  selectedParentService,
  orderType,
  indexFrom,
  indexTo,
  distanceBetweenFromTo,
  latestSubmitOrder,
} = storeToRefs(makeOrderStore);

const loading = ref(false);
const loadingType = ref("direct");

const createOrderForm = ref(null);
const route = useRoute();
const router = useRouter();
// const { params } = useRoute();
const currencies = ref<currency[]>([]);
const selectedCurrency = ref<currency | null>(null);

const showDistance = ref(false);
const removeOrder = () => {
  if (!latestSubmitOrder.value) return;
  loading.value = true;
  useAppFetch()
    .eventCancelOrder(latestSubmitOrder.value.id.toString())
    .then((response) => {
      notifyAlert("success", "Your Order has been successfuly Canceled");
    })
    .catch((error) => {
      SET_ERROR(error);
    })
    .finally(() => {
      loading.value = false;
      router.push({
        path: localePath(RoutesManager.orders),
        query: { type: "canceled" },
      });
    });
};
const submit = async () => {
  //   if (!resetForm.value) return;
  //@ts-ignore
  const { valid } = await createOrderForm.value.validate();
  if (!orderValidate() || !valid) return;
  console.log(valid);

  submitRelistOrder().finally(() => {
    if (isOrderCompletedSuccessfully.value) {
      notify({
        type: "success",
        title: "Your Order has been successfuly created",
      });
      replaceTo(RoutesManager.orders);
    }
  });
};

const {t} = useI18n();

const submitSave = async () => {
  //   if (!resetForm.value) return;
  //@ts-ignore
  const { valid } = await createOrderForm.value.validate();
  if (!orderValidate() || !valid) return;
  console.log(valid);

  saveOrder().finally(() => {
    if (isOrderCompletedSuccessfully.value) {
      notify({
        type: t('success'),
        title: t('success_saved_notification'),
      });
      replaceTo(RoutesManager.orders);
    }
  });
  return;
};

const submitHandler = async (type: string) => {
  console.log("in");
  //@ts-ignore
  const { valid } = await createOrderForm.value.validate();
  if (!orderValidate() || !valid) return;
  loadingType.value = type;

  if (type === "direct") {
    orderType.value = "direct";
    goTo(RoutesManager.DirectRequest);
    return;
  }
  if (type === "save") {
    submitSave();
    return;
  }
  if (type === "bid") {
    orderType.value = "bid";
  }
  if (type === "targetPrice") {
    orderType.value = "target-price";
  }

  submit();
};

const getItemValues = (orderOption: OrderOption) => {
  if (
    orderOption.type === "select" ||
    orderOption.type === "multiselect" ||
    orderOption.type === "multicheckbox"
  ) {
    return orderOption.values;
  }

  return undefined;
};
const getItemImages = (orderOption: OrderOption, value: string[]) => {
  if (orderOption.type === "image" || orderOption.type === "multi_image") {
    return value;
  }

  return undefined;
};
const getItemFiles = (orderOption: OrderOption, value: string[]) => {
  if (orderOption.type === "file" || orderOption.type === "multi_file") {
    return value;
  }

  return undefined;
};
const reorder = () => {
  goTo(
    RoutesManager.editOrderForm.replace(
      "__order_id__",
      route.params.id.toString()
    )
  );
};

const fetchCurrencies = () => {
  useAppFetch<ResponseData<currency>>()
    .eventGetCurrencies()
    .then((response) => {
      currencies.value = response.data;
      if (currencies.value.length) {
        selectedCurrency.value = response.data[0];
        currencyId.value = response.data[0].id;
      }
    });
};
const selectedCurrencyHandling = (currency: currency) => {
  selectedCurrency.value = currency;
  currencyId.value = currency.id;
};
onMounted(() => {
  fetchCurrencies();
});
</script>

<template>
  <div>
    <div
      v-if="
        selectedParentService &&
        selectedChildService &&
        orderOptions &&
        !!orderOptions.data.length
      "
      class="d-flex align-start align-sm-end justify-space-between flex-column flex-sm-row ga-5"
    >
      <div class="routes font-weight-bold mt-5 d-flex align-center ga-1">
        <NuxtLink
          class="text-brand-color-text-default"
          :to="localePath(RoutesManager.categories)"
        >
          {{ selectedParentService.name }}
        </NuxtLink>
        <v-icon v-if="$vuetify.locale.isRtl">mdi-chevron-left</v-icon>
        <v-icon v-else>mdi-chevron-right</v-icon>
        <NuxtLink class="text-primary">
          {{ selectedChildService.name }}
        </NuxtLink>
      </div>
    </div>
    <div v-if="!!distanceBetweenFromTo" class="w-100">
      <div
        class="routes font-weight-bold w-100 mt-3 mb-5 d-flex flex-column align-end justify-end ga-1"
      >
        <span class="text-primary">{{ $t('distance') }} </span>
        <span class="">
          {{ distanceBetweenFromTo }}
          km
        </span>
      </div>
      <div
        v-if="
          latestSubmitOrder &&
          (latestSubmitOrder.accepted_price || latestSubmitOrder.target_price)
        "
        class="routes font-weight-bold w-100 mt-3 mb-5 d-flex flex-column align-end justify-end ga-1"
      >
        <span class="text-primary">{{ $t('price') }}</span>
        <span class="">
          {{
            latestSubmitOrder.accepted_price || latestSubmitOrder.target_price
          }}
        </span>
      </div>
    </div>

    <v-form ref="createOrderForm" @submit.prevent="submit" class="mt-10">
      <v-row>
        <template v-for="(orderOption, index) in orderOptions?.data">
          <v-col v-if="orderFormData[index].value" cols="12" sm="6">
            <component
              :disabled="true"
              :is="dynamicTextFieldComponent(orderOption)"
              :label="orderOption.name"
              :placeholder="orderOption.placeholder"
              :items="getItemValues(orderOption)"
              :display-images="
                getItemImages(orderOption, orderFormData[index].value)
              "
              :display-files="
                getItemFiles(orderOption, orderFormData[index].value)
              "
              :required="orderOption.is_required"
              v-model="orderFormData[index].value"
              :isMultiple="
                orderOption.type === 'multi_image' ? true : undefined
              "
              :orderOptionValue="orderOption"
            ></component>
          </v-col>
        </template>
      </v-row>

      <template
        v-if="orderOptions && orderOptions.data.length && selectedChildService"
      >
        <div class="d-flex align-center justify-center flex-column mt-10">
          <base-gradient-btn @click="reorder" class="mb-5" width="400"   v-if="
              latestSubmitOrder?.status == 'saved' ||
              latestSubmitOrder?.status == 'canceled'
            ">
            {{ $t('reorder') }}
          </base-gradient-btn>
          <base-gradient-btn
            v-if="
              latestSubmitOrder?.status == 'in_progress' ||
              latestSubmitOrder?.status == 'in_progress_live'
            "
            @click="removeOrder"
            class="mb-5"
            width="400"
          >
          {{ $t('cancel_order') }}
          </base-gradient-btn>
        </div>
      </template>
    </v-form>
  </div>
</template>

<style scoped></style>
