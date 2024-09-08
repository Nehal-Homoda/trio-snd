// vuetify.config.ts
import type { ExternalVuetifyOptions } from 'vuetify-nuxt-module'
import { ar, en } from 'vuetify/locale'
const light = {
    dark: false,
    colors: {
        "background": "#FFFFFF",
        "surface": "#F4F6FA",
        "on-surface": "#000000",
        "primary": "#FFB200",
        "primary-darken": "#CC5500",
        "secondary-lighten": "#ffffff",
        "secondary": "#eeeeee",
        "secondary-darken": "#E0E0E0",
        "error": "#B00020",
        "info": "#2196F3",
        "success": "#4CAF50",
        "warning": "#FB8C00",
        "brand-color-text-default": "#10151B",
        "brand-color-text-muted": "#546E7A",
        "brand-color-link-accent": "#0550ae",
        "brand-color-link-accent-muted": "#304d66",
    }
}
const dark = {
    dark: true,
    colors: {
        "background": "#121212",
        "surface": "#232222",
        "on-surface": "#ffffff",
        "primary": "#FFB200",
        "primary-darken": "#CC5500",
        "secondary-lighten": "#161b22",
        "secondary": "#2D2F32",
        "secondary-darken": "#444",
        "error": "#B00020",
        "info": "#2196F3",
        "success": "#4CAF50",
        "warning": "#FB8C00",
        "brand-color-text-default": "#ffffff",
        "brand-color-text-muted": "#eee",
        "brand-color-link-accent": "#79c0ff",
        "brand-color-link-accent-muted": "#304d66",
    },
};


export default {
    /* vuetify options */
    // locale: {
    //     messages: { en, ar },
    // },
    // localeMessages: ["ar", 'en'],
    theme: {
        defaultTheme: "light",
        themes: {
            dark,
            light,
        }
    },
    display: {
        thresholds: {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400,
        },
    },
    defaults: {
        VBtn: {
            elevation: '0',
            class: "text-body-1 font-weight-medium",
        },
        VContainer: {
            class: 'px-5 px-md-10 px-xl-16'
        },
        VSheet: {
            color: 'transparent'
        }
    }
} satisfies ExternalVuetifyOptions