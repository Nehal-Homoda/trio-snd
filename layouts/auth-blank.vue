<script setup>


/*##########[ DEFINES ]##########*/

// If you want to use it in setup, import from the nuxtApp.
// const { $pwa } = useNuxtApp()

// const toast = useToast()

// onMounted(() => {
//     if ($pwa.offlineReady)
//         toast.success('App ready to work offline')
// })
</script>


<template>

    <v-app>

        <NuxtPwaAssets />


        <v-layout>

            <!--##########[ APP ]##########-->
            <v-main>

                <slot />

                <!-- You can use $pwa directly in templates! -->
                <!-- <div v-show="$pwa.needRefresh">
                    <span>
                        New content available, click on reload button to update.
                    </span>

                    <button @click="$pwa.updateServiceWorker()">
                        Reload
                    </button>
                </div> -->

            </v-main>

        </v-layout>
    </v-app>
</template>



<style lang="scss" scoped>
.v-main {
    width: 100%;
    min-height: 100vh;
    background: url('@/assets/img/bg/bg-1.png') no-repeat center fixed;
    background-size: cover;
    display: flex;
    align-items: center;
}
</style>