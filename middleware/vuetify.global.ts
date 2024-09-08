
export default defineNuxtRouteMiddleware((to, from) => {

    const nuxtApp = useNuxtApp();

    const { localeProperties } = nuxtApp.$i18n;

    if (import.meta.client) {

        const ltrEl = document.querySelectorAll('.v-locale--is-ltr');

        if (localeProperties.value.dir === 'rtl' && ltrEl.length) {

            ltrEl.forEach(el => {
                el.classList.remove('v-locale--is-ltr');
                el.classList.add('v-locale--is-rtl');
            })
        }
    }

})