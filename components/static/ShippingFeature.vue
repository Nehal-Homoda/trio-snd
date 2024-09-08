<script setup>
import { bg, icons } from "~/core/manager/AssetsManager";
import RoutesManager from "~/core/manager/RoutesManager";

const {t} = useI18n();

const shippngFeature=ref({
    1:{text: t('tracking'),icon:icons.icon_7 },
    2:{text:t('approve_of_deliver'),icon:icons.icon_7},
    3:{text:t('target_price_request'),icon:icons.icon_7}
});

const localPath = useLocalePath();


</script>


<template>
    <v-sheet color="transparent" class="shipping-feature py-16">
        <v-container>
            <v-card rounded="lg" color="transparent" :image="bg.bg_9" width="100%" :height="$vuetify.display.smAndUp ? '80vh' : '70vh'" class="d-flex flex-column align-center justify-center px-5 ">

                <div class="mb-16 bg-surface pa-6 rounded-lg"  >
                    <h1 class="text-h4 text-md-h2 text-center font-weight-bold ">{{ $t('our_delivery_features') }}</h1>
                </div>
                
                <v-card rounded="lg" elevation="0" class="px-7 py-10 mt-5" >
                    <div class="d-flex align-center ga-2 mb-5"  v-for="(item,index) in shippngFeature" :key="index">
                        <div size="icon-wrap">
                            <v-img width="25px" height="25px" :class="{'icon-rotate': $vuetify.locale.isRtl}" contain :src="icons.icon_7"></v-img>
                        </div>
                        <p class="text-body-1 font-weight-bold" >{{item.text}}</p>
                    </div>
                    <v-btn class="mt-7" block :color="$vuetify.theme.name === 'dark' ? 'white' : 'black'" :append-icon=" $vuetify.locale.isRtl ? 'mdi-arrow-left' : 'mdi-arrow-right'" :to="localPath(RoutesManager.categories)">{{ $t('show_services') }}</v-btn>

                </v-card>
          
            </v-card>

        </v-container>
    </v-sheet>


</template>


<style lang=scss scoped>

.icon-rotate {
    transform: rotate(180deg);
}
</style>
