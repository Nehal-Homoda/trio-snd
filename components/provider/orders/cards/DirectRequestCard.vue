<script setup lang="ts">
import type { Provider } from "~/interfaces/user/orders/orderBids.interface";
import { brand } from '~/core/manager/AssetsManager'
import RoutesManager from "~/core/manager/RoutesManager";
import { useNotification } from "@kyvg/vue3-notification";


const makeOrderStore = useMakeOrderStore();
const notificationsStore = useNotificationsStore();
const { notifications } = storeToRefs(notificationsStore);
const { fetchNotifications } = useNotificationsStore();
const { submitMakeOrder, submitRelistOrder } = useMakeOrderStore();
const { orderSelectedProvider, isOrderCompletedSuccessfully, submitLoading, latestSubmitOrder, isDirectOrderAccepted, isDirectOrderRejected } = storeToRefs(makeOrderStore);

const props = defineProps<{
    availableProvider: Provider
}>()


const { notify } = useNotification()
const sharedStore = useSharedStore();
const timer = ref(60);
const timerDialog = ref(false);
const loading = ref(false);
const router = useRouter();
const localePath = useLocalePath();


let intervalId: NodeJS.Timeout;
let restTimeout: NodeJS.Timeout;


const emit = defineEmits(['provider-request'])


const handleProviderRequest = () => {

    orderSelectedProvider.value = props.availableProvider;

    
    isDirectOrderAccepted.value = false;
    isDirectOrderRejected.value = false;
    
    loading.value = true;
    if (latestSubmitOrder.value && (latestSubmitOrder.value.status === 'saved' || latestSubmitOrder.value.status === 'canceled')) {
        edit();
    } else {
        submit();
    }
}
const submit = () => {
    submitMakeOrder()
        .finally(() => {

            loading.value = false;

            if (isOrderCompletedSuccessfully.value) {
                timerDialog.value = true;
                timer.value = 60;
                // notify({
                //     type: 'success',
                //     title: 'Your Order has been successfuly created'
                // })

                intervalId = setInterval(() => {
                    timer.value--;

                    if (timer.value <= 0) {

                        clearInterval(intervalId)
                        timerDialog.value = false
                    }
                }, 1000)
            }
        })
}
const edit = () => {
    submitRelistOrder()
        .finally(() => {

            loading.value = false;

            if (isOrderCompletedSuccessfully.value) {
                timerDialog.value = true;
                timer.value = 60;
                // notify({
                //     type: 'success',
                //     title: 'Your Order has been successfuly created'
                // })

                intervalId = setInterval(() => {
                    timer.value--;

                    if (timer.value <= 0) {

                        clearInterval(intervalId)
                        timerDialog.value = false
                    }
                }, 1000)
            }
        })
}
const {t} = useI18n();

const cancelOrder = async () => {

    if (!latestSubmitOrder.value) return;
    loading.value = true;
    await useAppFetch().eventCancelOrder(latestSubmitOrder.value.id.toString())
        .then(respose => {
            notify({
                type: t('success'),
                title: t('success_canceled_notification')
            })
            clearInterval(intervalId)
            timerDialog.value = false
            // replaceTo(RoutesManager.orders)
        })
        .catch(error => {
            sharedStore.SET_ERROR(error)
        })
        .finally(() => {
            loading.value = false;

        })
}

watch(isDirectOrderAccepted, (newValue) => {


    if (newValue) {
        clearInterval(intervalId);
        // replaceTo(RoutesManager.orders);

        router.push({
            path: localePath(RoutesManager.orders),
            query: { type: 'in_progress' }
        })

    }
})
watch(isDirectOrderRejected, (newValue) => {


    if (newValue) {
        clearInterval(intervalId);
        timerDialog.value = false;
        restTimeout = setTimeout(() => {
            isDirectOrderRejected.value = false;
            clearTimeout(restTimeout)
        }, 300);
    }
})
onBeforeUnmount(() => {
    clearInterval(intervalId)
    clearTimeout(restTimeout)
})

</script>



<template>
    <div class="w-100">
        <v-card width="100%" color="secondary-lighten" class="d-flex justify-space-between align-center direct-request-border pa-8 rounded-lg"
            :class="$vuetify.display.smAndDown ? 'flex-column ga-4' : ''">
            <div class="d-flex ga-6 " :class="$vuetify.display.smAndDown ? 'flex-column align-center' : ''">
                <v-avatar rounded="lg" size="70" class="half-shadow">
                    <v-img :lazy-src="brand.avatar" :src="availableProvider.avatar_path"></v-img>
                </v-avatar>
                <v-sheet width="200px" class="d-flex flex-column justify-center text-center text-md-start">
                    <p class="font-size-large-+ font-weight-bold ">{{ availableProvider.name }}</p>
                    <p v-if="availableProvider.company_name" class="text-primary">{{ availableProvider.company_name }}
                        {{ $t('company') }}</p>
                </v-sheet>
            </div>
            <div class="d-flex flex-column align-center ga-2">
                <!-- <p class="text-primary font-weight-bold text-md-h5 h6 text-center">{{ availableProvider..price }}</p> -->
                <!-- <span  class="mdi mdi-star text-primary "></span> -->
                <v-rating size="25" active-color="primary" readonly empty-icon="mdi-star" color="blue-grey-lighten-5"
                    v-model="availableProvider.avg_rate"></v-rating>
                <!-- <template v-for="index in 5">
                        <v-icon v-if="index <= userRate" color="primary"> mdi-star </v-icon>
                        <v-icon color="blue-grey-lighten-5" v-else> mdi-star </v-icon>
                    </template> -->
            </div>
            <div class="d-flex ga-4">
                <v-btn @click="handleProviderRequest" :loading="loading" :disabled="submitLoading" width="110" height="45"
                    rounded="lg" color="primary" class="text-white">{{$t('request')}}</v-btn>
            </div>
        </v-card>
        <v-dialog v-model="timerDialog" persistent max-width="300">
            <v-card>
                <v-card-text class="text-center">
    
                    <h6 class="text-h5 font-weight-bold text-brand-text-color-default">{{ $t('please_waititng') }}</h6>
                    <h3 class="text-h4 font-weight-medium text-primary d-flex align-center justify-center ga-2 my-4">
                        <v-icon size="35" color="primary">mdi-alarm-check</v-icon>
                        {{ timer }}
                    </h3>
                    <p class="font-weight-bold text-brand-text-color-default">
                    {{ $t('waiting_provider') }}
                    </p>
                    <v-btn @click="cancelOrder" :disabled="loading" :loading="loading" height="45" rounded="lg" block
                        color="primary" class="mt-5 text-white" append-icon="mdi-close-circle-outline"> {{ $t('cancel_order') }}
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>

</template>



<style lang="scss">
.direct-request-border {
    box-shadow: 0 0 0 1px #91919150 !important;
}
</style>