<template>
    <v-footer theme="dark" app name="footer" class="app-footer pt-16 px-0">
        <div class="wrap w-100">
            <v-container class="position-relative py-16">
                <v-row>
                    <v-col cols="12" md="9">
                        <div class="">
                            <img :src="brand.logoLight" alt="" class="brand-logo-img">
                            <p class="font-size-large font-weight-medium mt-10 pe-5">
                                {{ $t('shared.app_footer.description') }}
                            </p>
                        </div>
                    </v-col>
                    <v-col cols="12" md="3">
                        <div class="space my-16 my-md-0"></div>
                        <div class="d-flex flex-column ">
                            <h6 class="contact-info-title text-h5 mb-10 text-primary font-weight-medium">{{$t('contact_us')}}
                            </h6>
                            <div class="d-flex align-center ga-3 mb-3">
                                <v-icon color="success">mdi-whatsapp</v-icon>
                                <a :href="`https://wa.me/+201012274325`"
                                    class="text-brand-color-text-default font-size-large font-weight-medium"
                                    target="_blank"  v-if="$vuetify.locale.isRtl"> 4325 227 101 20+ </a>
                                <a :href="`https://wa.me/+201012274325`"
                                    class="text-brand-color-text-default font-size-large font-weight-medium"
                                    target="_blank"  v-if="!$vuetify.locale.isRtl"> +20 101 227 4325 </a>
                            </div>
                            <div class="d-flex align-center ga-3 mb-3">
                                <v-icon color="primary">mdi-email</v-icon>
                                <a :href="`mailto:support@TrioSND.com`"
                                    class="text-brand-color-text-default font-size-large font-weight-medium"
                                    target="_blank"> support@TrioSND.com</a>
                            </div>
                            <!-- <div class="d-flex align-center ga-3 mb-3">
                                <v-icon color="primary">mdi-map-marker-outline</v-icon>
                                <a :href="`http://maps.google.com/?q=1200 ${appInfo.contact.address}`" target="_blank"
                                    class="text-brand-color-text-default font-size-large font-weight-medium"> {{
                                    appInfo.contact.address }} </a>
                            </div> -->
                            <div class="d-flex align-center ga-3 mb-3">

                                <v-icon color="primary">mdi-message-text-outline</v-icon>
                                <NuxtLink :to="localePath(RoutesManager.tickets)"
                                    class="text-brand-color-text-default font-size-large font-weight-medium ">{{ $t('support') }}
                                </NuxtLink>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
            <div class="copyright pt-3 pb-1 font-weight-medium mt-16">
                {{ $t('shared.app_footer.copy_right') }}, {{ new Date().getFullYear() }}
            </div>
        </div>
    </v-footer>
</template>

<script setup>
import { brand } from '~/core/manager/AssetsManager';
import { useLayoutStore } from '~/stores/layout';
import { appInfo } from '~/core/config/app.config';
import RoutesManager from '~/core/manager/RoutesManager';


const layoutStore = useLayoutStore()
const localePath = useLocalePath()



</script>

<style lang="scss" scoped>
.app-footer {
    width: 100%;
    background-color: #2d2f32;
    border-top: 1px solid rgb(var(--v-theme-primary));

    &::before {
        content: '';
        width: 100%;
        height: 100%;
        background: url('@/assets/img/accessories/acc-1.png') no-repeat bottom left;
        background-size: cover;
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .contact-info-title {
        height: 50px;
    }

    .copyright {
        // height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-top: 1px solid rgb(var(--v-theme-primary));
        position: relative;
    }

    .brand-logo-img {
        width: 135px;
        height: 50px;
        object-fit: contain;
    }
}
</style>