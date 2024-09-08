import RoutesManager from "~/core/manager/RoutesManager";
import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware( async (to, from) => {
    
    const authStore = useAuthStore();

    await authStore.profile();

    if (authStore.authError && !authStore.authError.success) {
        // return navigateTo(localePath(RoutesManager.login));
        replaceTo(RoutesManager.login)

    }
    
})