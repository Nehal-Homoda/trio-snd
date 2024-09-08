<template>
  <v-card @click.self="handleOpenCardDetails" class="order-card mx-auto d-flex flex-column align-center text-center mb-1 pa-3 pointer" variant="elevated"
    rounded="lg">
    <div @click="handleOpenCardDetails">
      <div v-if="status === 'pending' && userOrder.bids_count > 0" class="d-flex align-center justify-end w-100">
        <v-badge color="primary" :content="userOrder.bids_count" text-color="white">
        </v-badge>
      </div>
      <p class="text-brand-color-text-default text-h6 font-weight-medium w-100">
        {{ userOrder.service.name }}
      </p>
      <v-divider width="100%" color="primary" class="mt-5 mb-4" thickness="2"></v-divider>
      <p class="text-center text-h6 font-weight-medium mb-1 text-brand-color-text-muted">
         {{ $t('order_number') }}
      </p>
      <p class="text-primary text-h6 font-weight-medium mb-2">
        {{ userOrder.uid }}
      </p>

      <p class="text-body-1 d-flex align-center ga-2 font-weight-medium mb-5">
        <v-icon size="17" icon="mdi-clock-outline" color="primary"></v-icon>
        {{ userOrder.created_at }}
      </p>

      <div class="img-wrap d-flex align-center justify-center py-3">
        <v-img :src="userOrder.service.icon_path" width="50%" height="100px"></v-img>
      </div>
    </div>
    <template v-if="props.status === 'completed'">
      <div class="text-center mt-3 w-100">
        <base-gradient-btn @click="dialog = true" :loading="loading" :disabled="loading" height="40px" block
          width="100%">
          {{ $t('evaluation') }}
        </base-gradient-btn>
        <v-dialog v-model="dialog" width="auto">
          <v-card class="d-flex align-center flex-column pa-10" rounded="lg">
            <h5 class="text-h5">{{ $t('evaluationn') }}</h5>
            <v-rating hover v-model="rating" active-color="primary" color="grey-lighten-1" class="mt-6 mb-6" size="30"
              empty-icon="mdi-star"></v-rating>
            <div class="d-flex flex-column">
              <v-text-field :placeholder="$t('add_comment')" v-model="textInput" class="mt-2" variant="solo-filled" type="text"
                density="compact">
              </v-text-field>
              <base-gradient-btn @click="addRating" min-width="325px" height="40" :loading="loading"
                :disabled="loading">
                {{ $t('confirm') }}
              </base-gradient-btn>
            </div>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <!-- <template v-if="props.status === 'in_progress' ||  props.status === 'in_progress_live'">
      <div class="text-center pa-1 w-100" >
        <base-gradient-btn @click="removeOrder" :loading="loading" height="40px" block width="100%">الغاء الطلب</base-gradient-btn>

      </div>
    </template> -->
  </v-card>
</template>

<script setup lang="ts">
import RoutesManager from "~/core/manager/RoutesManager";
import type { ResponseWithValue } from "~/interfaces/response/response.interface";
import type { UserOrder } from "~/interfaces/user/orders/order.interface";

const props = defineProps<{
  userOrder: UserOrder;
  status: string;
}>();



const dialog = ref(false);
const rating = ref(1);
const textInput = ref(null);
const loading = ref(false);

const handleOpenCardDetails = () => {
  if (props.status === "pending") {
    goTo(RoutesManager.userOrderOffers + props.userOrder.id);
  } else {
    goTo(
      RoutesManager.userOrderDetails.replace(
        "__order_id__",
        props.userOrder.id.toString()
      )
    );
  }
};

const addRating = () => {
  loading.value = true;
  const fd = new FormData();
  fd.append("rate", rating.value.toString());
  if (textInput.value) {
    fd.append("comment", textInput.value);
  }

  useAppFetch<ResponseWithValue<string>>()
    .eventAddRating(props.userOrder.id.toString(), fd)
    .then((response) => {
      notifyAlert("success", response.meta.message);
    })
    .catch((error) => {
      SET_ERROR(error);
    })
    .finally(() => {
      loading.value = false;
      dialog.value = false;
    });
};

// const removeOrder = () => {
//   loading.value=true;
//   useAppFetch()
//     .eventCancelOrder(props.userOrder.id.toString())
//     .then((response) => {
//       notifyAlert('success','Your Order has been successfuly Canceled')
//     })
//     .catch((error) => {
//       SET_ERROR(error);

//     }).finally(()=>{
//       loading.value=false;
//       emit('refresh');
//     })
// };
</script>

<style scoped>
.order-card {
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary)) !important;
}
</style>
