/*##########[ IMPORTS ]##########*/
import { defineStore } from "pinia";
import { useNotification } from "@kyvg/vue3-notification";
import type {
  Meta,
  ResponseData,
} from "~/interfaces/response/response.interface";
import type { Notification } from "~/interfaces/user/notifications/notification.interface";
import { onMessage } from "firebase/messaging";
import type { ComputedRefSymbol } from "@vue/reactivity";

export const useNotificationsStore = defineStore("notifications", () => {
  /*##########[ DEFINES ]##########*/
  const { notify } = useNotification();
  const sharedStore = useSharedStore();
  const makeOrderStore = useMakeOrderStore();
  const { isDirectOrderAccepted, isDirectOrderRejected } =
    storeToRefs(makeOrderStore);
  const showBubbleDialog = ref(false)
  const bubbleNotificationDialog = ref({
    title: '',
    body: ''
  })


  /*##########[ STATE ]##########*/
  const notifications = ref<Notification[]>([]);
  const meta = ref<Meta | null>(null);
  const page = ref(1);
  const notificationType = ref("");
  const loading = ref(true);
  const showLoadMoreBtn = ref(false);
  const isInitialized = ref(false);

  const init = async () => {
    // if (isInitialized.value) return;
    // isInitialized.value = true;

    await fetchNotifications();

    onMessage(initializeFirebaseMessaging().firebaseMessaging, (payload) => {
      console.log("Message received. ", payload);
      // ...

      const data = {
        subject_id: '',
        type: '',
      }

      if (payload.data) {

        if (payload.data.type === "SERVICE_ORDER_IN_PROGRESS") {
          isDirectOrderAccepted.value = true;
        }
        if (payload.data.type === "SERVICE_ORDER_REJECTED") {
          console.log("test");
          isDirectOrderRejected.value = true;
        }
        if (payload.data.type === "BUBBLE") {
          console.log('bubble')
          showBubbleDialog.value = true
          bubbleNotificationDialog.value.title = payload.notification?.title || ''
          bubbleNotificationDialog.value.body = payload.notification?.body || ''
          return;
        }



        console.log('notification data =>>>', payload.data?.subject_id)
        console.log('notification data =>>>', payload.data?.type)


        if (payload.data.type && payload.data.subject_id) {
          data.type = payload.data.type
          data.subject_id = payload.data.subject_id

        }
        else if (payload.data.type == "BUBBLE") {
          data.type = payload.data.type
          
        }
        else {

          data.type = "public"
          data.subject_id = ''
        }
      }

      


      notify({
        type: "success",
        title: payload.notification?.title,
        text: payload.notification?.body,
        data: JSON.stringify(data).toString(),
        duration: 10000
      });
    });
  };

  /*##########[ COMPUTED ]##########*/
  const orderNotifications = computed(() => {
    return notifications.value.filter((item) => item.type.includes("ORDER"));
  });
  const publicNotifications = computed(() => {
    return notifications.value.filter((item) => {
      if (!item.type.includes("ORDER") && !item.type.includes("BUBBLE")) return item

    })
  });
  const bubbleNotification = computed(() => {
    return notifications.value.filter((item) => item.type.includes('BUBBLE'))
  })
  const notReadNotification = computed(() => {
    return notifications.value.filter((item) => !item.is_read);
  });
  const notReadNotificationLength = computed(
    () => notReadNotification.value.length
  );
  const publicNotificationLength = computed(
    () => publicNotifications.value.filter((item) => !item.is_read).length
  );
  const orderNotificationLength = computed(
    () => orderNotifications.value.filter((item) => !item.is_read).length
  );

  /*##########[ ACTIONS ]##########*/
  const fetchNotifications = async () => {
    loading.value = true;
    await useAppFetch<ResponseData<Notification>>()
      .eventGetUserNotifications(page.value)
      .then((response) => {
        notifications.value = response.data;
        meta.value = response.meta;

        if (meta.value.current_page < meta.value.last_page) {
          showLoadMoreBtn.value = true;
        } else {
          showLoadMoreBtn.value = false;
        }
      })
      .catch((error) => {
        // sharedStore.SET_ERROR(error)
      })
      .finally(() => {
        loading.value = false;
      });
  };
  const loadMoreHandler = () => {
    if (!loading.value) return;
    if (!meta.value) return;

    // increament page value
    page.value++;

    // check if max page number is >= last_page set last_page value to current page
    if (meta.value.current_page >= meta.value.last_page) {
      page.value = meta.value.last_page;
      return;
    }

    // fetch data of new page
    fetchNotifications();
  };
  const markAsRead = (id: number, index: number) => {
    useAppFetch()
      .eventMarkOneNotificationAsRead(id.toString())
      .then(() => {
        notifications.value[index].is_read = true;
      })
      .catch((error) => {
        sharedStore.SET_ERROR(error);
      });
  };
  const markAllRead = () => {
    useAppFetch()
      .eventMarkAllNotificationAsRead()
      .then(() => {
        notifications.value.forEach((item) => {
          item.is_read = true;
        });
      });
  };

  return {
    notifications,
    meta,
    page,
    notificationType,
    orderNotifications,
    publicNotifications,
    bubbleNotification,
    bubbleNotificationDialog,
    showBubbleDialog,
    loading,
    notReadNotification,
    notReadNotificationLength,
    init,
    fetchNotifications,
    markAsRead,
    markAllRead,
    publicNotificationLength,
    orderNotificationLength
  };
});
