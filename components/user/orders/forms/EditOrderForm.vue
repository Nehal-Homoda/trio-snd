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
const { submitMakeOrder, orderValidate, saveOrder, submitRelistOrder } = useMakeOrderStore();
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
  distanceBetweenFromTo
} = storeToRefs(makeOrderStore);

const loading = ref(false);
const loadingType = ref("direct");

const createOrderForm = ref(null);
const route = useRoute();
// const { params } = useRoute();
const currencies = ref<currency[]>([]);
const selectedCurrency = ref<currency | null>(null);

const showDistance = ref(false)



const {t} = useI18n();


const submit = async () => {
  //   if (!resetForm.value) return;
  //@ts-ignore
  const { valid } = await createOrderForm.value.validate();
  if (!orderValidate() || !valid) return;
  console.log(valid);

  submitRelistOrder().finally(() => {
    if (isOrderCompletedSuccessfully.value) {
      notify({
        type: t('success'),
        title: t('success_created_notification'),
      });
      replaceTo(RoutesManager.orders);
    }
  });
};

const submitSave = async () => {
  //   if (!resetForm.value) return;
  //@ts-ignore
  const { valid } = await createOrderForm.value.validate();
  if (!orderValidate() || !valid) return;
  console.log(valid);

  saveOrder().finally(() => {
    if (isOrderCompletedSuccessfully.value) {
      notify({
        type: "success",
        title: "Your Order has been successfuly saved",
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
  if (
    orderOption.type === "image" ||
    orderOption.type === "multi_image"
  ) {
    return value;
  }

  return undefined;
};
const getItemFiles = (orderOption: OrderOption, value: string[]) => {
  if (
    orderOption.type === "file" ||
    orderOption.type === "multi_file"
  ) {
    return value;
  }

  return undefined;
};


const fetchCurrencies = () => {
  useAppFetch<ResponseData<currency>>()
    .eventGetCurrencies()
    .then((response) => {
      currencies.value = response.data;
      if (currencies.value.length) {
        selectedCurrency.value = response.data[0];
        currencyId.value = response.data[0].id
      }
    });
};
const selectedCurrencyHandling = (currency: currency) => {
  selectedCurrency.value = currency;
  currencyId.value = currency.id
};
onMounted(() => {
  fetchCurrencies()
});
</script>

<template>
  <div>
    <div v-if="
      selectedParentService &&
      selectedChildService &&
      orderOptions &&
      !!orderOptions.data.length
    " class="d-flex align-start align-sm-end justify-space-between flex-column flex-sm-row ga-5">
      <div class="routes font-weight-bold mt-5 d-flex align-center ga-1">
        <NuxtLink class="text-brand-color-text-default" :to="localePath(RoutesManager.categories)">
          {{ selectedParentService.name }}
        </NuxtLink>
        <v-icon v-if="$vuetify.locale.isRtl">mdi-chevron-left</v-icon>
        <v-icon v-else>mdi-chevron-right</v-icon>
        <NuxtLink class="text-primary">
          {{ selectedChildService.name }}
        </NuxtLink>
      </div>


    </div>
    <div
      v-if="!!distanceBetweenFromTo"
      class="w-100">
      <div class="routes font-weight-bold w-100 mt-3 mb-5 d-flex flex-column align-end justify-end ga-1">
        <span class="text-primary">{{ $t('distance') }} </span>
        <span class="">
          {{ distanceBetweenFromTo }}
          km
        </span>
      </div>

    </div>

    <v-form ref="createOrderForm" @submit.prevent="submit" class="mt-10">
      <v-row>
        <template v-for="(orderOption, index) in orderOptions?.data">
          <v-col cols="12" sm="6">
            <component 
                :is="dynamicTextFieldComponent(orderOption)" 
                :label="orderOption.name"
                :placeholder="orderOption.placeholder" 
                :items="getItemValues(orderOption)" 
                :display-images="getItemImages(orderOption, orderFormData[index].value)"
                :display-files="getItemFiles(orderOption, orderFormData[index].value)"
                :required="orderOption.is_required" 
                v-model="orderFormData[index].value" 
                :isMultiple="orderOption.type === 'multi_image' ? true : undefined" 
                :orderOptionValue="orderOption"
              ></component>
          </v-col>
        </template>
      </v-row>

      <template v-if="orderOptions && orderOptions.data.length && selectedChildService">
        <div class="d-flex align-center justify-center flex-column mt-10">
          <base-gradient-btn @click="submitHandler('direct')" :disabled="submitLoading"
            :loading="submitLoading && loadingType === 'direct'" class="mb-5" width="400" v-if="
              selectedChildService.type === 'all' ||
              selectedChildService.type === 'direct'
            ">
             {{ $t('direct_order') }}
          </base-gradient-btn>

          <base-gradient-btn @click="submitHandler('bid')" type="submit" :disabled="submitLoading"
            :loading="submitLoading && loadingType === 'bid'" class="mb-5" width="400" v-if="
              selectedChildService.type === 'all' ||
              selectedChildService.type === 'bid'
            ">
             {{ $t('pending_order') }}
          </base-gradient-btn>

          <v-dialog v-if="selectedChildService.is_target_price" max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" :disabled="submitLoading"
                :loading="submitLoading && loadingType === 'targetPrice'" width="400" color="primary" variant="outlined"
                height="48" class="font-weight-bold" rounded="lg">
                 {{ $t('target_price') }}
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-plus-circle</v-icon>
                </template>
              </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
              <v-card rounded="lg" :title="$t('target_price')">
                <v-card-text>
                  <v-text-field type="number" v-model="targetPrice" :rules="[(v) => !!v || 'Required!']"
                    variant="solo-filled" placeholder="Enter your target price">
                    <template v-slot:prepend-inner>
                      <v-menu>
                        <template v-slot:activator="{ props, isActive }">
                          <v-btn size="small" color="transpernt" variant="plain" :ripple="false" v-bind="props">
                            {{ selectedCurrency?.slug }}
                            <template v-slot:append>
                              <v-icon v-if="isActive">mdi-chevron-up</v-icon>
                              <v-icon v-else>mdi-chevron-down</v-icon>
                            </template>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item v-for="(item, i) in currencies" :key="i" @click="selectedCurrencyHandling(item)">
                            <v-list-item-title>
                              {{ item.slug }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-text-field>
                  <v-btn text="Send" @click="submitHandler('targetPrice')" :disabled="!!!targetPrice" variant="elevated"
                    rounded="lg" block height="45"class="text-white mt-3" color="primary"
                    :loading="submitLoading && loadingType === 'targetPrice'"></v-btn>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </div>

        <!-- <div v-if="orderSelectedProvider" class="d-flex align-center justify-center flex-column mt-10">
          <base-gradient-btn :disabled="loadingSubmit" :loading="loadingSubmit" type="submit" class="mb-5" width="400">
             تأكيد الطلب
          </base-gradient-btn>
        </div> -->
      </template>
    </v-form>
  </div>
</template>

<style scoped></style>
