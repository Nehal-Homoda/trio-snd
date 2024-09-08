<script setup lang="ts">
import type { Notification } from "~/interfaces/user/notifications/notification.interface";
// defineProps<{
//     notification: Notification
// }>();
const props = defineProps(["notification"]);
const emit = defineEmits(["mark-read"]);

const handleMarkRead = (id: number, index: number) => {
  emit("mark-read", id, index);
};
const notifications = ref<Notification[]>([]);
const sharedStore = useSharedStore();

// const markRead = (id: number, index: number) => {

// useAppFetch()
//     .eventMarkOneNotificationAsRead(id.toString()).then(() => {
//         notifications.value[index].is_read = true;
//     })
//     .catch((error) => {
//         sharedStore.SET_ERROR(error)
//     })
// }

// const markAllRead = () => {
//     useAppFetch().eventMarkAllNotificationAsRead().then(() => {
//         notifications.value.forEach((item) => {
//             item.is_read = true;
//         })
//     })
// }
</script>

<template>
  <!-- <template v-for="(item, index) in notification"> -->
  <v-card
    class="pa-5 mb-5"
    :class="[
      $vuetify.display.smAndDown ? 'flex-column ga-3' : '',
      notification.is_read ? 'card-border-not-read' : 'card-border-read',
    ]"
    rounded="lg"
  >
    <div class="d-flex justify-space-between">
      <span>
        <v-icon
          @click="handleMarkRead(notification.id, index)"
          v-if="!notification.is_read"
          size="25"
          color="blue-grey-lighten-1"
          >mdi-close-box</v-icon
        >
      </span>

      <div
        class="d-flex align-center ga-2"
        :class="notification.is_read ? '' : 'text-primary'"
      >
        <v-icon
          size="20"
          icon="mdi-clock-outline"
          :color="notification.is_read ? 'blue-grey-lighten-1' : 'primary'"
        ></v-icon>
        <p class="font-size-meduim">{{ notification.created_at }}</p>
      </div>
    </div>
    <div class="d-flex ps-0 ps-md-16 mt-5 ga-4">
      <v-avatar class="bg-blue-lighten-5">
        <v-icon color="blue-darken-4" class="icon-border"
          >mdi-check-circle</v-icon
        >
      </v-avatar>
      <div class="d-flex flex-column">
        <h5 class="text-h5 font-weight-bold font-size-large">
          {{ notification.title }}
        </h5>
        <span class="font-size-large">{{ notification.body }}</span>
      </div>
    </div>
  </v-card>
  <!-- </template> -->
</template>

<style lang="scss">
.card-border-read {
  box-shadow: 0 0 0 0.5px #ffb200 !important;
}

.card-border-not-read {
  box-shadow: 0 0 0 0.5px grey !important;
}
</style>
