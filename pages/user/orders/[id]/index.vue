<template>
  <v-sheet class="py-16" color="transparent">
    <v-container>
      <UserOrdersCardsOrderOfferCardHorizontalWithDetailsBtn v-if="userOffer" :user-offer="userOffer" />
      <template v-for="(item ,index) in userBids">
        <ProviderOrdersCardsAcceptAndRejectOrderCardHorizontal v-if="item.status !== 'rejected'" :availableProvider="item"    @remove-item="removeItemFromList(index)" />
      </template>
     
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
// import { UserOrdersCardsOrderOfferCardHorizontalWithDetailsBtn } from "#build/components";
import type { ResponseData, ResponseWithValue } from "~/interfaces/response/response.interface";
import type { UserOffer } from "~/interfaces/user/orders/order.interface";
import type { orderBids } from "~/interfaces/user/orders/orderBids.interface";


const userOffer = ref<UserOffer | null>(null)
const userBids=ref<orderBids[] |null> (null)
 
const route = useRoute();

definePageMeta({middleware:'auth'})
const fetchOrderOffer = () => {
  useAppFetch<ResponseWithValue<UserOffer>>().eventGetUserOrder(route.params.id.toString())
  .then((response) => {
    userOffer.value = response.data;
  })
}

const fetchAvailableProvider=()=>{
  useAppFetch<ResponseData<orderBids>>().eventGetUserOrderBids(route.params.id.toString())
  .then((response)=>{
      userBids.value=response.data;
  })
  
}



const removeItemFromList = (index:number) => {
  userBids.value?.splice(index,1)
}

onMounted(() => {
  fetchOrderOffer();
  fetchAvailableProvider();
 
})


</script>

<style scoped>
.half-shadow {
  box-shadow: 0 0 0 2px #fff, 3px 3px 10px #0000002a !important;
}
</style>
