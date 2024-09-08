/*##########[ IMPORTS ]##########*/
import { defineStore } from "pinia";
import RoutesManager from "~/core/manager/RoutesManager";
import type {
  ResponseData,
  ResponseWithValue,
} from "~/interfaces/response/response.interface";
import type { MakeOrderFormDataItem, UserOrder } from "~/interfaces/user/orders/order.interface";
import type { Provider } from "~/interfaces/user/orders/orderBids.interface";
import type { OrderOptionsResponse } from "~/interfaces/user/orders/orderOptions.interface";
import type {
  UserServicesList,
  Parent,
} from "~/interfaces/user/services-list/servicesList.interface";

export const useMakeOrderStore = defineStore("makeOrder", () => {


  interface SavedSelectImageOrFileComponentsData {
    [key: number]: SavedSelectImageOrFileComponentsDataItem
  }
  interface SavedSelectImageOrFileComponentsDataItem {
    files: File[];
    images: string[];
    base64: string[];
  }

  /*##########[ DEFINES ]##########*/
  const sharedStore = useSharedStore();
  /*##########[ STATE ]##########*/
  const orderFormData = ref<MakeOrderFormDataItem[]>([]);
  const orderType = ref('')
  const selectedParentService = ref<Parent | null>(null);
  const selectedChildService = ref<UserServicesList | null>(null);
  const orderOptions = ref<OrderOptionsResponse | null>(null);
  const orderSelectedProvider = ref<Provider | null>(null);
  const isOrderCompletedSuccessfully = ref(false);
  const targetPrice = ref(null);
  const currencyId = ref<number | null>(null);
  const submitLoading = ref(false);
  const optionsLoading = ref(false);
  const latestSubmitOrder = ref<UserOrder | null>(null);
  const invalidInputs = ref<number[]>([]);
  const isDirectOrderAccepted = ref(false);
  const isDirectOrderRejected = ref(false);
  const indexFrom = ref(0);
  const indexTo = ref(0);
  const isIndexFromSet = ref(false);
  const isIndexToSet = ref(false);
  const savedSelectImageComponentsData = ref<SavedSelectImageOrFileComponentsData>({})
  const savedSelectFileComponentsData = ref<SavedSelectImageOrFileComponentsData>({})

  // const locationFrom=ref<number[]>([])
  /*##########[ COMPUTED ]##########*/
  const distanceBetweenFromTo = computed(() => {
    if (!isIndexFromSet.value || !isIndexToSet.value) return '';
    if (!!!orderFormData.value.length || !orderFormData.value[indexFrom.value].value || !orderFormData.value[indexTo.value].value) return '';
    
    return distanceInKm(parseFloat(orderFormData.value[indexFrom.value].value.lat), parseFloat(orderFormData.value[indexFrom.value].value.lng), parseFloat(orderFormData.value[indexTo.value].value.lat), parseFloat(orderFormData.value[indexTo.value].value.lng));
  })
  /*##########[ ACTIONS ]##########*/

  const orderValidate = () => {
    // if return true form is valid
    // if return false form is invalid

    if (!orderOptions.value) return false;

    orderOptions.value.data.forEach((item, index) => {


      if (!item.is_required) return;

      if (!!!orderFormData.value[index].value && !invalidInputs.value.includes(item.id)) {
        invalidInputs.value.push(item.id);
      }
      if (!!orderFormData.value[index].value && invalidInputs.value.includes(item.id)) {
        invalidInputs.value.splice(invalidInputs.value.indexOf(item.id), 1);
      }


    });

    if (!!invalidInputs.value.length) return false;

    return true;
  };
  




  const resetMakeOrderFormData = () => {
    orderFormData.value = [];
    orderSelectedProvider.value = null;
    targetPrice.value = null;
    latestSubmitOrder.value = null;
    invalidInputs.value = [];
    isDirectOrderAccepted.value = false;
    isDirectOrderRejected.value = false;
  };
  const fetchOrderOptions = async () => {
    if (!selectedChildService.value) return;
    optionsLoading.value = true;
    await useAppFetch<OrderOptionsResponse>()
      .eventGetOrderOptions(selectedChildService.value.id.toString())
      .then((response) => {
        orderOptions.value = response;
        orderFormData.value = [];
        isIndexFromSet.value = false;
        isIndexToSet.value = false;
        savedSelectImageComponentsData.value = {};
        savedSelectFileComponentsData.value = {};
        orderOptions.value.data.forEach((item, index) => {

          orderFormData.value.push({
            id: item.id,
            value: null,
            type: item.type
          });
          if (item.type === 'location') {

            if (!isIndexFromSet.value) {
              isIndexFromSet.value = true;
              indexFrom.value = index;
              return;
            }
            if (!isIndexToSet.value) {
              isIndexToSet.value = true;
              indexTo.value = index;
            }
          }

          if (item.type === 'image' || item.type === 'multi_image') {
            savedSelectImageComponentsData.value[item.id] = {
              base64: [],
              images: [],
              files: [],
            }
          }
          if (item.type === 'file' || item.type === 'multi_file') {
            savedSelectFileComponentsData.value[item.id] = {
              base64: [],
              images: [],
              files: [],
            }
          }

        });
      })
      .catch((error) => {
        sharedStore.SET_ERROR(error);
      })
      .finally(() => {
        optionsLoading.value = false;
      });
  };
  const saveOrder = async () => {
    if (!selectedChildService.value) return;

    submitLoading.value = true;
    const fd = new FormData();


    fd.append("service_id", selectedChildService.value.id.toString());
    if (distanceBetweenFromTo.value) {
      fd.append(`distance_from_to`, distanceBetweenFromTo.value);
    }



    for (const [i, data] of orderFormData.value.entries()) {

      if (!data.value || (Array.isArray(data.value) && !data.value.length)) continue;

      fd.append(`service_options[${i}][option_id]`, data.id.toString());

      
      if (Array.isArray(data.value) && (data.type === 'multicheckbox' )) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][option_values][${index}][option_value_id]`, item);
        });
        continue;
      }
      if (Array.isArray(data.value) && (data.type === 'multiselect')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][option_values][${index}][option_value_id]`, item.id);
          fd.append(`service_options[${i}][option_values][${index}][quantity]`, item.quantity);
        });
        continue;
      }
      if (data.type === 'select') {
        fd.append(`service_options[${i}][option_values][0][option_value_id]`, data.value);
        continue;
      }
      if (Array.isArray(data.value) && (data.type === 'multi_image' || data.type === 'image')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][native_value][${index}]`, item);
        });
        continue;
      }
      if (Array.isArray(data.value) && (data.type === 'file')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][native_value][${index}]`, item);
        });
        fd.append(`service_options[${i}][type]`, data.type);
        continue;
      }

      if (data.type === "location") {
        fd.append(`service_options[${i}][native_value]`, JSON.stringify(data.value));
        continue;
      }

      fd.append(`service_options[${i}][native_value]`, data.value);
    }


    isOrderCompletedSuccessfully.value = false;
    await useAppFetch<ResponseWithValue<UserOrder>>()
      .eventSaveOrder(fd)
      .then((response) => {
        isOrderCompletedSuccessfully.value = true;
        latestSubmitOrder.value = response.data;


        if (orderType.value === 'direct') {

          // resetMakeOrderFormData();
        }
        if (orderType.value === 'bid') {
          // resetMakeOrderFormData();
        }
        if (orderType.value === 'target-price') {
          // resetMakeOrderFormData();
        }
      })
      .catch((error) => {
        isOrderCompletedSuccessfully.value = false;
        sharedStore.SET_ERROR(error);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  };
  const submitMakeOrder = async () => {
    if (!selectedChildService.value) return;

    submitLoading.value = true;
    const fd = new FormData();


    if (orderType.value === 'direct') {

      if (!orderSelectedProvider.value) return;
      ///######################## orderselectedprovider ??? ##############################
      fd.append("provider_id", orderSelectedProvider.value.id.toString());
    }

    if (orderType.value === 'target-price') {

      if (!targetPrice.value) return;
      if (!!!currencyId.value) return;

      fd.append("target_price", targetPrice.value);
      fd.append("currency_id", currencyId.value.toString());
    }

    fd.append("service_id", selectedChildService.value.id.toString());

    if (distanceBetweenFromTo.value) {
      fd.append(`distance_from_to`, distanceBetweenFromTo.value);
    }


    for (const [i, data] of orderFormData.value.entries()) {

      if (!data.value || (Array.isArray(data.value) && !data.value.length)) continue;

      // if (!data.value) return;

      fd.append(`service_options[${i}][option_id]`, data.id.toString());

      if (Array.isArray(data.value) && (data.type === 'multicheckbox' )) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][option_values][${index}][option_value_id]`, item);
        });
        continue;
      }
      if (Array.isArray(data.value) && (data.type === 'multiselect')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][option_values][${index}][option_value_id]`, item.id);
          fd.append(`service_options[${i}][option_values][${index}][quantity]`, item.quantity);
        });
        continue;
      }
      if (data.type === 'select') {
        fd.append(`service_options[${i}][option_values][0][option_value_id]`, data.value);
        continue;
      }

      if (Array.isArray(data.value) && (data.type === 'multi_image' || data.type === 'image')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][native_value][${index}]`, item);
        });
        continue;
      }
      if (Array.isArray(data.value) && (data.type === 'file')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][native_value][${index}]`, item);
        });
        fd.append(`service_options[${i}][type]`, data.type);
        continue;
      }

      if (data.type === "location") {
        fd.append(`service_options[${i}][native_value]`, JSON.stringify(data.value));
        continue;
      }


      fd.append(`service_options[${i}][native_value]`, data.value);
    }


    isOrderCompletedSuccessfully.value = false;
    await useAppFetch<ResponseWithValue<UserOrder>>()
      .eventMakeOrder(fd)
      .then((response) => {
        isOrderCompletedSuccessfully.value = true;
        // to cancel order
        latestSubmitOrder.value = response.data;


        if (orderType.value === 'direct') {

          // resetMakeOrderFormData();
        }
        if (orderType.value === 'bid') {
          // resetMakeOrderFormData();
        }
        if (orderType.value === 'target-price') {
          // resetMakeOrderFormData();
        }

      })
      .catch((error) => {
        isOrderCompletedSuccessfully.value = false;
        sharedStore.SET_ERROR(error);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  };
  const submitRelistOrder = async () => {
    if (!selectedChildService.value) return;
    if (!latestSubmitOrder.value) return;

    submitLoading.value = true;
    const fd = new FormData();


    if (orderType.value === 'direct') {

      if (!orderSelectedProvider.value) return;
      ///######################## orderselectedprovider ??? ##############################
      fd.append("provider_id", orderSelectedProvider.value.id.toString());
    }

    if (orderType.value === 'target-price') {

      if (!targetPrice.value) return;
      if (!!!currencyId.value) return;

      fd.append("target_price", targetPrice.value);
      fd.append("currency_id", currencyId.value.toString());
    }

    fd.append("service_id", selectedChildService.value.id.toString());

    if (distanceBetweenFromTo.value) {
      fd.append(`distance_from_to`, distanceBetweenFromTo.value);
    }


    for (const [i, data] of orderFormData.value.entries()) {

      if (!data.value || (Array.isArray(data.value) && !data.value.length)) continue;

      fd.append(`service_options[${i}][option_id]`, data.id.toString());

      if (Array.isArray(data.value) && (data.type === 'multicheckbox' )) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][option_values][${index}][option_value_id]`, item);
        });
        continue;
      }
      if (Array.isArray(data.value) && (data.type === 'multiselect')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][option_values][${index}][option_value_id]`, item.id);
          fd.append(`service_options[${i}][option_values][${index}][quantity]`, item.quantity);
        });
        continue;
      }
      if (data.type === 'select') {
        fd.append(`service_options[${i}][option_values][0][option_value_id]`, data.value);
        continue;
      }

      if (Array.isArray(data.value) && (data.type === 'multi_image' || data.type === 'image')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][native_value][${index}]`, item);
        });
        continue;
      }
      if (Array.isArray(data.value) && (data.type === 'file')) {
        data.value.forEach((item, index) => {
          fd.append(`service_options[${i}][native_value][${index}]`, item);
        });
        fd.append(`service_options[${i}][type]`, data.type);
        continue;
      }

      if (data.type === "location") {
        fd.append(`service_options[${i}][native_value]`, JSON.stringify(data.value));
        continue;
      }

      fd.append(`service_options[${i}][native_value]`, data.value);
    }


    isOrderCompletedSuccessfully.value = false;
    await useAppFetch<ResponseWithValue<UserOrder>>()
      .eventRelistOrder(latestSubmitOrder.value.id.toString(), fd)
      .then((response) => {
        isOrderCompletedSuccessfully.value = true;
        // to cancel order
        latestSubmitOrder.value = response.data;


        if (orderType.value === 'direct') {

          // resetMakeOrderFormData();
        }
        if (orderType.value === 'bid') {
          // resetMakeOrderFormData();
        }
        if (orderType.value === 'target-price') {
          // resetMakeOrderFormData();
        }

      })
      .catch((error) => {
        isOrderCompletedSuccessfully.value = false;
        sharedStore.SET_ERROR(error);
      })
      .finally(() => {
        submitLoading.value = false;
      });
  };



  return {
    orderFormData,
    selectedChildService,
    selectedParentService,
    orderOptions,
    orderType,
    orderSelectedProvider,
    isOrderCompletedSuccessfully,
    isDirectOrderAccepted,
    isDirectOrderRejected,
    targetPrice,
    currencyId,
    submitLoading,
    invalidInputs,
    latestSubmitOrder,
    optionsLoading,
    indexFrom,
    indexTo,
    savedSelectImageComponentsData,
    savedSelectFileComponentsData,
    distanceBetweenFromTo,
    fetchOrderOptions,
    submitMakeOrder,
    saveOrder,
    orderValidate,
    resetMakeOrderFormData,
    submitRelistOrder
  };
});
