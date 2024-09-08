
export default defineNuxtRouteMiddleware(async (to, from) => {



    const authStore = useAuthStore();
    authStore.enter();
});