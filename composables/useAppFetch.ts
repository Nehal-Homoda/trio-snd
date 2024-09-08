import type { OrderType } from "~/interfaces/shared/shared.interface";

export const useAppFetch = <T>() => {
    let token: string = "";

    const tokenCookie = useCookie('tokenCookie');
    const localeCookie = useCookieLocale()

    token = tokenCookie.value || "";

    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiBaseURL;


    const headers: HeadersInit = {
        Accept: "application/json",
        'Client-Type': 'web',
        'lang': localeCookie.value,
        // 'Content-Type': "multipart/form-data",
        Authorization: `Bearer ${token || ""}`,
    };

    const apiCall = {
        get: (path: string, body: undefined | FormData = undefined) =>
            $fetch<T>(BASE_URL + path, {
                method: "GET",
                body: body,
                headers,
            }),
        post: (path: string, body: undefined | FormData = undefined) =>
            $fetch<T>(BASE_URL + path, {
                method: "POST",
                body: body,
                headers,
            }),
        delete: (path: string, body: undefined | FormData = undefined) =>
            $fetch<T>(BASE_URL + path, {
                method: "DELETE",
                body: body,
                headers,
            }),
    };

    return {
        // auth
        meEvent: () => apiCall.get(`/auth/me`),
        logoutEvent: () => apiCall.post(`/auth/logout`),
        loginWithSocialEvent: (formData: FormData) => apiCall.post(`/auth/login_with_social`, formData),
        registerEvent: (formData: FormData) => apiCall.post(`/auth/register`, formData),
        resetPasswordEvent: (formData: FormData) => apiCall.post(`/auth/forget-password`, formData),
        updateEvent: (formData: FormData) => apiCall.post(`/auth/update`, formData),
        changePassword: (FormData: FormData) => apiCall.post(`/auth/change-password`, FormData),
        loginEvent: (formData: FormData) => apiCall.post(`/auth/login`, formData),
        eventRelistOrder: (id: string,formData:FormData) => apiCall.post(`/service-orders/${id}/edit`,formData),
        eventCompleteData:(fd:FormData)=>apiCall.post(`/auth/complete_data`,fd),
        deleteProfile:(fd:FormData)=>apiCall.post(`/auth/delete_account`,fd),
        //shared
        eventGetCountries: () => apiCall.get(`/countries`),
        eventGetCurrencies: () => apiCall.get(`/currencies`),
        eventGetStatistics: () => apiCall.get(`/statistics`),
        eventAddCity:(fd: FormData)=>apiCall.post(`/cities/add`, fd),
        eventGetCity:()=>apiCall.get(`/cities`),
        eventActivateCity:(formData:FormData)=>apiCall.post(`/cities/update`,formData),
        eventdDeleteCity:(formdata:FormData)=>apiCall.post(`/cities/remove`,formdata),
        eventAddRating:(id:string,formdata:FormData) => apiCall.post(`/service-orders/${id}/rate`,formdata),

        // user 
        eventCancelOrder: (id: string) => apiCall.post(`/service-orders/${id}/cancel`),
        eventSaveOrder: (formData: FormData) => apiCall.post(`/service-orders/save`, formData),
        eventMakeOrder: (formData: FormData) => apiCall.post(`/service-orders`, formData),
        eventGetUserOrder: (id: string) => apiCall.get(`/service-orders/${id}`),
        eventGetUserOrderBids: (id: string) => apiCall.get(`/service-order-bids?service_order_id=${id}`),
        eventOrderBidsAccept: (id: string) => apiCall.post(`/service-order-bids/${id}/accept`),
        eventOrderBidsReject: (id: string) => apiCall.post(`/service-order-bids/${id}/reject`),
        eventAddComplaints: (formData: FormData) => apiCall.post(`/tickets/store`, formData),
        eventGetUserTickets: () => apiCall.get(`/tickets`),
        eventGetUserTicketItem:(id:string)=>apiCall.get(`/tickets/${id}/show`),
        eventDeleteUserTicket:(id:string)=>apiCall.delete(`/tickets/${id}/delete`),
        eventAddMessage:(formData:FormData)=>apiCall.post(`/tickets/add_message`,formData),


        eventGetUserOrders: (status: string, type: OrderType, page: number) => apiCall.get(`/service-orders?status=${status}&type=${type}&page=${page}`),


        eventGetOrderOptions: (service_id: string) => apiCall.get(`/service-options?service_id=${service_id}`),
        eventGetUserBanners: () => apiCall.get(`/banners`),
        eventGetUserServices: () => apiCall.get(`/services`),
        eventGetUserService: (id: string) => apiCall.get(`/services?parent_id=${id}`),
        eventGetUserServiceShow: (id: string) => apiCall.get(`/services/${id}`),
        eventGetUserServiceFormOptions: (id: string) => apiCall.get(`/service-options?service_id=${id}`),
        eventGetUserServiceProviders: (id: string) => apiCall.get(`/providers?service_id=${id}`),
        eventGetUserNotifications: (page: number) => apiCall.get(`/notifications?page=${page}`),
        eventMarkOneNotificationAsRead: (id: string) => apiCall.post(`/notifications/mark-as-read/${id}`),
        eventMarkAllNotificationAsRead: () => apiCall.post(`/notifications/mark-as-read`),
        eventUserVerificationAccount: (formData: FormData) => apiCall.post(`/auth/add-card`, formData),




        //provider
        eventGetOrderStatistics:()=>apiCall.get(`/auth/providers/stats`)
    };
};