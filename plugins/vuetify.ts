import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {

    const layoutStore = useLayoutStore();
    const { isVuetifyReady } = storeToRefs(layoutStore);
    const colorModeCookie = useCookie('colorModeCookie');

    nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
        // update vuetifyOptions

        if (vuetifyOptions.theme) {
            vuetifyOptions.theme.defaultTheme= colorModeCookie.value  || 'light'
        }
    })

    nuxtApp.hook('vuetify:ready', (vuetify) => {
        // your logic here

        isVuetifyReady.value = true;
        
    })
})


