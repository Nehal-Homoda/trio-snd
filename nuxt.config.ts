// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      title: "Trio SND",
      htmlAttrs: { lang: "en", dir: 'ltr', translate: 'no' },
      meta: [{ name: "description", content: "Trio SND" }],
      link: [
        { rel: "icon", type: "image/png", href: "./logo.png" },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon-180x180.png",
        },
      ],
      script: [
        {
          src: "https://apis.google.com/js/platform.js",
          defer: true,
          async: true,
        },
        { src: "https://accounts.google.com/gsi/client", async: true },
        {
          src: "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
          async: true,
        },
      ],
    },
  },
  css: ["~/assets/sass/main.scss"],
  modules: [
    "@pinia/nuxt",
    "vuetify-nuxt-module",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "nuxt-swiper",
    "@vite-pwa/nuxt",
    "nuxt-delay-hydration"
  ],
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode'
  },
  appConfig: {
    // you don't need to include this: only for testing purposes
    buildDate: new Date().toISOString(),
  },
  delayHydration: {
    // enables nuxt-delay-hydration in dev mode for testing
    // NOTE: you should disable this once you've finished testing, it will break HMR
    // debug: process.env.NODE_ENV === 'development'
    mode: "manual"
  },
  pwa: {
    mode: 'development',
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    // includeAssets: ['favicon.ico', 'logo.png', 'logo.png'],
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    manifest: {
      name: 'Trio-SND',
      short_name: 'Trio-SND',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    pwaAssets: {
      config: true,
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: "./vuetify.config.ts",
  },
  i18n: {
    locales: [
      {
        code: "en",
        iso: "en",
        file: "en.json",
        name: "English",
        dir: "ltr",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_the_U.S..svg/64px-Flag_of_the_U.S..svg.png",
      },
      {
        code: "ar",
        iso: "ar",
        file: "ar.json",
        name: "العربية",
        dir: "rtl",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/64px-Flag_of_Saudi_Arabia.svg.png",
      },
    ],
    langDir: "locale",
    strategy: "prefix_except_default",
    defaultLocale: "en",
    lazy: true,
    vueI18n: "./core/config/i18n.config.ts",
    baseUrl: process.env.BASE_URL,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
    }
  },
  /* For Nuxt 3.9.0+ */
  features: {
    inlineStyles: false,
  },
  runtimeConfig: {
    public: {
      apiBaseURL: "https://triodj.com/",
      googleMapsApiKey: "",
    },
  },
  vite: {
    vue: {
      // template: {
      //   transformAssetUrls,
      // },
    },
    define: {
      "process.env.DEBUG": false,
    },
    build: {
      transpile: ["@vuepic/vue-datepicker", '@googlemaps/js-api-loader'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                @use "@/assets/sass/abstracts" as *;
          `,
        },
      },
    },
  },
  devServer: {
    // host: "host",
    port: 3000,
  },
});