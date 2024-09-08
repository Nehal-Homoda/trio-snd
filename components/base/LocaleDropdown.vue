<template>
    <div>
        <client-only>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-translate" color="primary" variant="outlined" size="small" v-bind="props"></v-btn>
                </template>

                <v-list dir="ltr">
                    <v-list-item class="locale-dropdown px-5" v-for="(locale, i) in locales" :key="i"
                        :class="currentLocale.code === locale.code ? 'text-primary' : undefined"
                        @click="setLocale(locale.code)">
                        <template v-slot:prepend>
                            <v-avatar size="25" :image="locale.icon"></v-avatar>
                        </template>
                        <v-list-item-title class="text-capitalize text-caption">
                            <NuxtLink class="lang-link text-caption" :to="switchLocalePath(locale.code)">
                                {{ locale.name }}
                            </NuxtLink>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </client-only>

    </div>
</template>

<script setup>
const { locale, locales, setLocale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath();
const { current } = useLocale();
const localePath = useLocalePath();

const availableLocales = computed(() => {
    return locales.value.filter((i) => i.code !== locale.value);
});
const currentLocale = computed(() => {
    return locales.value.filter((i) => i.code === locale.value).length
        ? locales.value.filter((i) => i.code === locale.value)[0]
        : null;
});

watch(locale, (newValue, oldValue) => {
    current.value = newValue;
    const i18nHead = useLocaleHead({
        addSeoAttributes: {
            canonicalQueries: ['seo']
        },
        addDirAttribute: true
    })
    console.log(i18nHead.value)
    useHead({
        htmlAttrs: {
            lang: i18nHead.value.htmlAttrs.lang,
            dir: i18nHead.value.htmlAttrs.dir
        },
        link: [...(i18nHead.value.link || [])],
        meta: [...(i18nHead.value.meta || [])]
    })
});

</script>

<style lang="scss">
.locale-dropdown {
    .lang-link {
        color: inherit;
        text-decoration: none;
        text-align: center;
    }

    .v-list-item__prepend .v-list-item__spacer {
        width: 0.75rem !important;
    }
}
</style>