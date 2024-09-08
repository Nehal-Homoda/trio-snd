<template>
    <v-dialog width="350" v-model="showBubbleDialog" @click="handleOpenDialog">
        <v-card width="350" color="white" rounded="lg"
            class="pointer py-7 px-10 mx-auto d-flex flex-column ga-4 align-center justify-center">
            <v-img width="100" height="100" src="~/assets/img/bubble-gift.png"></v-img>
            <span class="font-weight-bold ">{{ bubbleNotificationDialog.title }}</span>
            <span>{{ bubbleNotificationDialog.body }}
            </span>
        </v-card>
    </v-dialog>


</template>

<script setup lang="ts">
import RoutesManager from '~/core/manager/RoutesManager';
const notificationStore = useNotificationsStore()
const { showBubbleDialog, bubbleNotificationDialog } = storeToRefs(notificationStore)
const handleOpenDialog = () => {
    goTo(RoutesManager.notificationBubble)
    showBubbleDialog.value = false
}
</script>

<style scoped></style>