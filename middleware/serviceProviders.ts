import RoutesManager from "~/core/manager/RoutesManager";
import { useMakeOrderStore } from "./../stores/makeOrder";

export default defineNuxtRouteMiddleware(async (to, from) => {

    
    
    const localePath = useLocalePath();
    const makeOrderStore = useMakeOrderStore();


    const { orderType } = storeToRefs(makeOrderStore);

    if (orderType.value != 'direct') return navigateTo(localePath(RoutesManager.categories));

    if (process.server) return;

    
});
