<script setup lang="ts">


const notificationsStore = useNotificationsStore();
const { fetchNotifications } = useNotificationsStore();
const { markAsRead } = useNotificationsStore();
import { heros } from "~/core/manager/AssetsManager";
const { notifications, orderNotifications, loading } = storeToRefs(notificationsStore);
// const loading = ref(false);



definePageMeta({ middleware: 'auth' })
onMounted(() => {
    fetchNotifications();
})
</script>

<template>
    <v-sheet color="transparent" width="100%" min-height="100vh" class="py-16">
        <v-container>
            <p class="font-weight-black mt-16 mb-6 font-size-large ">{{ $t('orders_notification') }}</p>

            <UserOrdersCardsNotificationCard v-if="notifications" v-for="(item, index) in orderNotifications"
                :notification="item" @mark-read="markAsRead(item.id, index)" />

            <div v-if="notifications && !!!orderNotifications.length && !loading"
                class="d-flex align-center justify-center flex-column">
                <v-sheet color="transparent" width="100%" max-width="600"
                    :height="$vuetify.display.smAndDown ? '400' : '600'">
                    <v-img :src="heros.hero_11" width="100%" height="100%" contain> </v-img>
                </v-sheet>
                <BaseGradientBtn :ripple="false"> {{ $t('no_notification') }}  </BaseGradientBtn>
            </div>



            <div v-if="loading" class="d-flex justify-center align-center my-16">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>


        </v-container>
    </v-sheet>
</template>

<style lang="scss" scoped></style>
