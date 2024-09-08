<script setup lang="ts">
import { heros } from "~/core/manager/AssetsManager"
import RoutesManager from "~/core/manager/RoutesManager";
import type { orderBids } from "~/interfaces/user/orders/orderBids.interface";


const sharedStore = useSharedStore();
const localePath = useLocalePath();


const actionBtnLoading = ref(false);
const userRate = ref(2)
const props = defineProps<{
    availableProvider: orderBids
}>();
const emit = defineEmits(['remove-item']);



const acceptOffer = () => {

    actionBtnLoading.value = true;
    useAppFetch().eventOrderBidsAccept(props.availableProvider.id.toString())
        .then(() => {
            replaceTo(RoutesManager.userOrderOffers);
        })
        .catch((error) => {
            sharedStore.SET_ERROR(error);
        })
        .finally(() => {
            actionBtnLoading.value = false;
        })
}
const declineOffer = () => {

    actionBtnLoading.value = true;
    useAppFetch().eventOrderBidsReject(props.availableProvider.id.toString())
        .then(() => {
            emit('remove-item');
        })
        .catch((error) => {
            sharedStore.SET_ERROR(error);
        })
        .finally(() => {
            actionBtnLoading.value = false;
        })
}

</script>

<template>


    <v-container>
        <div class="d-flex  justify-space-between align-center"
            :class="$vuetify.display.smAndDown ? 'flex-column ga-4' : ''">
            <div class="d-flex ga-6 " :class="$vuetify.display.smAndDown ? 'flex-column align-center' : ''">
                <v-avatar :image="availableProvider.provider.avatar_path" rounded="lg" size="70" class="half-shadow">
                </v-avatar>
                <v-sheet width="200px" class="d-flex flex-column justify-center">
                    <p class="text-md-h6 h6 font-weight-bold">{{ availableProvider.provider.name }}</p>
                    <p v-if="availableProvider.provider.company_name" class="text-primary">{{ availableProvider.provider.company_name }} {{ $t('company') }}</p>
                </v-sheet>
            </div>
            <div class="d-flex flex-column align-center ga-2">
                <p class="text-primary font-weight-bold text-md-h5 h6 text-center ">{{ availableProvider.price }}</p>
                <!-- <span  class="mdi mdi-star text-primary "></span> -->
                <!-- <v-rating size="25" active-color="primary" readonly empty-icon="mdi-star" color="blue-grey-lighten-5"
                    v-model="availableProvider.provider.avg_rate"></v-rating> -->


                <div class="d-flex">
                    <v-icon size="25" v-for="star in 5"
                        :color="star <= availableProvider.provider.avg_rate ? 'primary' : 'blue-grey-lighten-5'">
                        mdi-star
                    </v-icon>
                </div>


            </div>
            <div class="d-flex ga-4">
                <v-btn @click="acceptOffer" :disabled="actionBtnLoading" width="100" height="40" rounded="lg" color="green-darken-1">{{ $t('approve') }}</v-btn>
                <v-btn @click="declineOffer" :disabled="actionBtnLoading" width="100" height="40" rounded="lg" color="red-accent-4">{{ $t('decline') }}</v-btn>
            </div>
        </div>
    </v-container>


</template>


<style lang="scss">
.half-shadow {
    box-shadow: 0 0 0 2px #fff, 3px 3px 10px #0000002a !important;
}
</style>