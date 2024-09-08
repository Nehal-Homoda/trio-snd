import RoutesManager from "~/core/manager/RoutesManager";
import type { ResponseError } from "~/interfaces/response/response.interface";


export const SET_ERROR = (error: any) => {
    const responseError = ref<ResponseError>()
    try {

        if (error.data) {

            responseError.value = error.data

            if(responseError.value?.error.status_code == 401) {
                // unauthorized redirect

                goTo(RoutesManager.login)
            }


            notifyAlert('error', responseError.value?.error.message)
        }

    } catch (error) {

    }
};