<script setup>
import RoutesManager from '~/core/manager/RoutesManager';



/*##########[ DEFINES ]##########*/
const navDrawer = ref(false);

// If you want to use it in setup, import from the nuxtApp.
// const { $pwa } = useNuxtApp()

// const toast = useToast()

// onMounted(() => {
//     if ($pwa.offlineReady)
//         toast.success('App ready to work offline')
// })

const notificationTypes = {
    success: 'success',
    warn: 'warning',
    error: 'error'
}
const notificationActionHandler = (props) => {

    const data = JSON.parse(props.item.data)
    if (data.type.includes('ORDER')) {
        if (data.subject_id) {
            goTo(RoutesManager.userOrderDetails.replace('__order_id__', data.subject_id))
        }
    } else {
        goTo(RoutesManager.notifications)
    }
    const timeOut = setTimeout(() => {
        props.close();
        clearTimeout(timeOut)
    }, 1000)


}
</script>



<template>

    <v-app>
        <!-- <NuxtLoadingIndicator :color="'#0000'" :height="10"/> -->

        <NuxtPwaAssets />

        <!--##########[ APP PAGE LOADING ]##########-->
        <!-- <SharedAppLoadingPage></SharedAppLoadingPage> -->


        <Notifications position="bottom right">
            <template #body="props">
                <v-alert @click="notificationActionHandler(props)" closable :title="props.item.title"
                    :text="props.item.text" :type="notificationTypes[props.item.type]" @click.self:close="close">
                </v-alert>
            </template>
        </Notifications>
        <!--##########[ APP NAV DRAWER ]##########-->
        <!-- <SharedAppNavDrawer v-model="navDrawer"></SharedAppNavDrawer> -->

        <!--##########[ APP NAV BAR ]##########-->
        <SharedAppNavbar v-model="navDrawer" />
        <v-layout>

            <!--##########[ APP ]##########-->
            <v-main>


                <slot />


                <!-- You can use $pwa directly in templates! -->
                <ClientOnly>

                    <!-- <div v-if="$pwa?.offlineReady || $pwa?.needRefresh" class="pwa-toast" role="alert">
                        <div class="message">
                            <span v-if="$pwa.offlineReady">
                                App ready to work offline
                            </span>
                            <span v-else>
                                New content available, click on reload button to update.
                            </span>
                        </div>
                        <button v-if="$pwa.needRefresh" @click="$pwa.updateServiceWorker()">
                            Reload
                        </button>
                        <button @click="$pwa.cancelPrompt()">
                            Close
                        </button>
                    </div> -->
                    <!-- <div v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh" class="pwa-toast"
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

                
                <BaseBubbleDialog/>
                <BaseDownloadBtn />

            </v-main>

            <!--##########[ APP FOOTER ]##########-->
            <SharedAppFooter></SharedAppFooter>
        </v-layout>
        <SharedAppBottomNavigation></SharedAppBottomNavigation>

    </v-app>
</template>



<style lang="scss" scoped>
.pwa-toast {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    border: 1px solid #8885;
    border-radius: 4px;
    z-index: 1;
    text-align: left;
    box-shadow: 3px 4px 5px 0 #8885;
}

.pwa-toast .message {
    margin-bottom: 8px;
}

.pwa-toast button {
    border: 1px solid #8885;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
}
</style>