import RoutesManager from "~/core/manager/RoutesManager";
import type { ResponseWithValue } from "~/interfaces/response/response.interface";
import type { UserOrder } from "~/interfaces/user/orders/order.interface";
import { useAuthStore } from "~/stores/auth";


export default defineNuxtRouteMiddleware(async (to, from) => {



    // skip middleware on server

    if (process.server) return;
    // skip middleware on client side entirely
    // if (process.client) return

    const localePath = useLocalePath();
    const makeOrderStore = useMakeOrderStore();
    const { latestSubmitOrder, selectedChildService, orderFormData } = storeToRefs(makeOrderStore)
    const { fetchOrderOptions } = useMakeOrderStore()

    const route = useRoute()


    const fetchOrderDetails = async () => {
        await useAppFetch<ResponseWithValue<UserOrder>>()
            .eventGetUserOrder(to.params.id.toString())
            .then((response) => {
                console.log(response.data.options);
                latestSubmitOrder.value = response.data
                //@ts-ignore
                selectedChildService.value = response.data.service
                fetchOrderOptions()
                    .then(() => {

                        const ar: string[] = []
                        let storedIndex = 0;
                        let isIndexSet = false;

                        const ids = orderFormData.value.map(item => item.id);


                        for (const [index, item] of response.data.options.entries()) {

                            if (item.type === 'image' || item.type === 'multi_image') {


                                ar.push(item.native_value);

                                orderFormData.value[ids.indexOf(item.id)].value = [...ar]
                                continue;


                            }
                            if (item.type === 'file' || item.type === 'multi_file') {


                              

                                orderFormData.value[ids.indexOf(item.id)].value = [item.native_value]
                                continue;


                            }
                            if (item.type === 'select') {

                                orderFormData.value[ids.indexOf(item.id)].value = item.values.length ? item.values[0].id : null;
                                continue;
                            }
                            if (item.type === 'multicheckbox') {

                                orderFormData.value[ids.indexOf(item.id)].value = [...item.values.map(data => data.id)]
                                continue;
                            }
                            if (item.type === 'multiselect') {

                                orderFormData.value[ids.indexOf(item.id)].value = item.values
                                continue;
                            }


                            orderFormData.value[ids.indexOf(item.id)].value = item.native_value
                        }
                    })

            });
    };

    await fetchOrderDetails()



    if (!latestSubmitOrder.value) return

    if (latestSubmitOrder.value.status == 'saved' || latestSubmitOrder.value.status == 'canceled') {

    } else {
        return navigateTo(localePath(RoutesManager.orders));
    }





});