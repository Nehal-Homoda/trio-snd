import { useAuthStore } from "~/stores/auth";


export default defineNuxtRouteMiddleware(async (to, from) => {



    // skip middleware on server

    if (process.server) return;
    
    const i18nHead = useLocaleHead({
        addSeoAttributes: {
            canonicalQueries: ['seo']
        },
        addDirAttribute: true
    })
    useHead({
        htmlAttrs: {
            lang: i18nHead.value.htmlAttrs.lang,
            dir: i18nHead.value.htmlAttrs.dir
        },
        link: [...(i18nHead.value.link || [])],
        meta: [...(i18nHead.value.meta || [])]
    })

});