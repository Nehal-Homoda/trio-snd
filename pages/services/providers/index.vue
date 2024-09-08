<script setup lang="ts">
import type { ResponseData } from '~/interfaces/response/response.interface';
import type { Provider } from '~/interfaces/user/orders/orderBids.interface';
import { heros } from '~/core/manager/AssetsManager';



const loading = ref(true);
const sharedStore = useSharedStore();

const providers = ref<Provider[]>([])
const route = useRoute();
const router = useRouter();

const makeOrderStore = useMakeOrderStore();
const { selectedChildService, isDirectOrderRejected, isDirectOrderAccepted, orderSelectedProvider } = storeToRefs(makeOrderStore)


const fetchProviders = () => {
    if (!selectedChildService.value) return;
    loading.value = true;
    useAppFetch<ResponseData<Provider>>()
        .eventGetUserServiceProviders(selectedChildService.value.id.toString())
        .then((response) => {

            providers.value = response.data
        })
        .catch((error) => {
            sharedStore.SET_ERROR(error);
        })
        .finally(() => {
            loading.value = false;
        });
};

definePageMeta({ middleware: ['service-providers', 'auth'] })

onMounted(() => {
    fetchProviders();
})
onBeforeUnmount(() => {
    isDirectOrderAccepted.value = false;
    isDirectOrderRejected.value = false;
    orderSelectedProvider.value = null;

})
</script>



<template>

    <v-sheet class="py-16" color="transparent">
        <v-container>
            <ProviderOrdersCardsDirectRequestHeaderMap :providers="providers" class="mb-10" />
            <div v-if="loading" class="d-flex justify-center align-center my-16">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>
            <ProviderOrdersCardsDirectRequestCard :available-provider="item" v-for="item in providers" class="mb-5" />
            <div v-if="!loading && !!!providers.length" class="d-flex align-center justify-center flex-column">
                <v-sheet color="transparent" width="100%" max-width="600"
                    :height="$vuetify.display.smAndDown ? '400' : '600'">
                    <v-img :src="heros.hero_11" width="100%" height="100%" contain> </v-img>
                </v-sheet>
                <BaseGradientBtn :ripple="false"> {{ $t('no_providers') }}  </BaseGradientBtn>
            </div>
        </v-container>
    </v-sheet>

</template>



<style scoped></style>