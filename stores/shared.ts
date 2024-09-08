/*##########[ IMPORTS ]##########*/
import { useNotification } from "@kyvg/vue3-notification";
import { defineStore } from "pinia";
import RoutesManager from "~/core/manager/RoutesManager";
import type { ResponseError } from "~/interfaces/response/response.interface";





export const useSharedStore = defineStore("shared", () => {

    const {  notify } = useNotification()
    /*##########[ DEFINES ]##########*/
    /*##########[ STATE ]##########*/
    const responseError = ref<ResponseError>()
    /*##########[ COMPUTED ]##########*/
    /*##########[ MUTATIONS ]##########*/
    const SET_ERROR = (error: any) => {
        try {

            if (error.data) {

                responseError.value = error.data

                if(responseError.value?.error.status_code == 401) {
                    // unauthorized redirect

                    goTo(RoutesManager.login)
                }

                notify({
                    title: responseError.value?.error.message,
                    type: "error"
                })

            }

        } catch (error) {

        }
    };
    const RESET_ERROR = () => {
        responseError.value = undefined;
    }
    /*##########[ ACTIONS ]##########*/

    return {
        responseError,
        SET_ERROR,
        RESET_ERROR
    };
});