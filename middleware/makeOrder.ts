import RoutesManager from "~/core/manager/RoutesManager";
import { useMakeOrderStore } from "./../stores/makeOrder";
import type {
  UserServicesList,
  Parent,
} from "~/interfaces/user/services-list/servicesList.interface";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const localePath = useLocalePath();
  const makeOrderStore = useMakeOrderStore();
  const router = useRouter();

  const { fetchOrderOptions } = useMakeOrderStore();
  const { selectedParentService, selectedChildService, orderType } = storeToRefs(makeOrderStore);


  if (!selectedParentService.value && !selectedChildService.value) {

    try {
      const child = window.localStorage.getItem('selectedChildService')
      const parent = window.localStorage.getItem('selectedParentService')

      if (child && parent) {
        selectedChildService.value = JSON.parse(child);
        selectedParentService.value = JSON.parse(parent);
      } else {

        return goTo(RoutesManager.categories);
        // return navigateTo(localePath(RoutesManager.categories));
      }

    } catch (error) {
      console.log('save selectedChildService To Localestorage error ', error)
    }
  }


  orderType.value = '';

  if (localePath(from.path) === localePath(RoutesManager.DirectRequest)) {
  } else {
    fetchOrderOptions()
  }

});
