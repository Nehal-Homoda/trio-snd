<script setup>
import { icons, bg, heros } from '~/core/manager/AssetsManager';


const dialog = ref(true);

onMounted(() => {

})
</script>

<template>
    <ClientOnly>
        <div v-if="$pwa && $pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
            class="d-block d-md-none">
            <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" color="primary" elevation="10" icon variant="elevated"
                        class="download-as-app-btn">
                        <img width="50%" height="50%" :src="icons.icon_download_white" alt="">
                    </v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                    <v-card rounded="xl" :image="bg.bg_13" color="primary" class="pa-5 text-white">

                        <div class="d-flex ga-5 h-100">
                            <div class="img-wrap">
                                <v-img width="100" height="225" :src="heros.hero_16"></v-img>
                            </div>
                            <h4 class="text-h4 font-weight-bold pt-4">
                                {{ $t('download_as_mobile') }}
                            </h4>
                        </div>
                        <v-btn @click="$pwa.install()" elevation="5" height="45" rounded="lg"
                            prepend-icon="mdi-cloud-download" color="white" class="px-7">
                            <template v-slot:prepend>
                                <v-icon size="35" color="primary">mdi-cloud-download</v-icon>
                            </template>
                            <span class="text-primary font-weight-bold">
                                 {{ $t('download_now') }}
                            </span>
                        </v-btn>

                        <!-- <v-card-actions>
                                <v-spacer></v-spacer>
        
                                <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                            </v-card-actions> -->
                    </v-card>
                </template>
            </v-dialog>
        </div>
        <!-- <div v-if="$pwa && $pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh" class="pwa-toast"
            role="alert">
            <div class="message">
                <span>
                    Install PWA
                </span>
            </div>
            <button @click="$pwa.install()">
                Install
            </button>
            <button @click="$pwa.cancelInstall()">
                Cancel
            </button>
        </div> -->
    </ClientOnly>
</template>




<style lang="scss" scoped>
.download-as-app-btn {
    position: fixed;
    bottom: 100px;
    right: 2.5%;
    z-index: 999;
}
</style>