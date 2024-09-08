<script setup lang="ts">
import RoutesManager from '~/core/manager/RoutesManager';
const localepath = useLocalePath();


</script>



<template>
    <v-bottom-navigation color="primary" bg-color="secondary" class="d-grid d-md-none app-bottom-navigation" :elevation="0">
        <v-btn :to="localepath(RoutesManager.orders)">
            <v-icon>mdi-border-all</v-icon>
            <span class="font-size-xx-small text-center font-weight-bold">{{$t('track_your_order')}}</span>
        </v-btn>
        <v-btn :to="localepath(RoutesManager.categories)">
            <v-icon>mdi-car-multiple</v-icon>
            <span class="font-size-xx-small text-center font-weight-bold">{{$t('our_services')}}</span>
        </v-btn>

        <v-btn :to="localepath(RoutesManager.home)">
            <v-icon>mdi-home-outline</v-icon>
            <span class="font-size-xx-small text-center font-weight-bold">{{$t('home') }}</span>
        </v-btn>
        <v-btn class="font-size-x-small" :to="localepath(RoutesManager.profile)">
            <v-icon>mdi-account-outline</v-icon>
            <span class="font-size-xx-small text-center font-weight-bold">{{ $t('profile') }}</span>
        </v-btn>

        <v-btn :to="localepath(RoutesManager.tickets)">
            <v-icon>mdi-message-text-outline</v-icon>

            <span class="font-size-xx-small text-center font-weight-bold ">{{$t('support') }}</span>
        </v-btn>
    </v-bottom-navigation>
</template>



<style lang="scss">

.app-bottom-navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    border-top: 1px solid rgb(var(--v-theme-primary));

}

</style>