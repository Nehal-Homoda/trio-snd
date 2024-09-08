
export default defineNuxtRouteMiddleware(async (to, from) => {



    // skip middleware on server

    if (process.server) return;
    // skip middleware on client side entirely
    // if (process.client) return

    const notificationStore = useNotificationsStore();
    notificationStore.init();
});