<template>
    <Transition name="fadeOut">
        <v-sheet v-if="loading" color="transparent" width="100vw" height="100vh"
            class="loading-page d-flex align-center justify-center">

            <!--##########[ START HEADER ]##########-->

            <!--##########[ END HEADER ]##########-->

            <!-- <v-sheet color="background" width="275px" height="275px" class="loading-logo">
loading ...
            </v-sheet> -->

            <!--====== start container tage and title ======-->

            <!--====== END container tage and title ======-->

        </v-sheet>
    </Transition>
</template>
    
<script setup>
import { useLocale } from 'vuetify/lib/framework.mjs';

/*##########[ IMPORTS ]##########*/




/*##########[ DEFINES ]##########*/
const nuxtApp = useNuxtApp();
const loading = ref(true);
const { locale, localeProperties } = useI18n();
const { current, fallback } = useLocale();


nuxtApp.hook('page:start', () => {
    /* your code goes here */
    // console.log('Page start')
})

nuxtApp.hook('page:loading:start', () => {
    loading.value = true;
    // console.log('Page loading start')
    // current.value = locale.value;
})
nuxtApp.hook('page:finish', () => {
    // console.log('Page loading finish')
    
    // const ltrEl = document.querySelectorAll('.v-locale--is-ltr');

    // if (localeProperties.value.dir === 'rtl' && ltrEl.length) {
    //     // const drawer = document.querySelector('.v-navigation-drawer--right')
    //     // drawer.classList.remove('v-navigation-drawer--right');
    //     // drawer.classList.add('v-navigation-drawer--left');

        
    //     ltrEl.forEach(el => {
    //         el.classList.remove('v-locale--is-ltr');
    //         el.classList.add('v-locale--is-rtl');
    //     })
    // }
    
    const timeout = setTimeout(() => {
        clearTimeout(timeout);
        loading.value = false;
    }, 1000)
})


/*##########[ DATA ]##########*/



/*##########[ METHODS ]##########*/



/*##########[ LIFE CYCLE ]##########*/



</script>
    
<style lang="scss" scoped>
.loading-page {
    position: fixed;
    z-index: 99999999;

    .loading-logo {
        animation: page-loading-fade 1s ease-in-out infinite both alternate;
    }
}
</style>