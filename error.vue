<template>
    <v-app>

        <SharedAppNavbar v-model="navDrawer" />

        <SharedAppNavDrawer v-model="navDrawer"></SharedAppNavDrawer>
        
        <v-layout>

            <v-main>

                <v-container>

                    <v-row>
                        <v-col v-if="error && error.statusCode >= 500" cols="12" >
                            <v-sheet  class="d-flex flex-column justify-center align-center " height="100vh">
                                <v-sheet width="100%" max-width="400" height="400">
                                    <v-img width="100%" height="100%" contain :src="heros.hero_13">
                                    </v-img>
                                </v-sheet>
                                <p class="text-h5 font-weight-bold text-center"> {{ error?.statusMessage }} </p>
                                <v-btn @click="goTo(RoutesManager.home)" :prepend-icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'" color="primary" class="text-white mb-16" width="150" height="50">Back To Home</v-btn>
                            </v-sheet>
                        </v-col>
                        <v-col v-else cols="12" >
                            <v-sheet  class="d-flex flex-column justify-center align-center " height="100vh" >
                                <v-sheet width="100%" max-width="400" height="400">
                                    <v-img width="100%" height="100%" contain :src="heros.hero_12">
                                    </v-img>
                                </v-sheet>
                                <p class="text-h5 font-weight-bold text-center"> {{ error?.statusMessage }} </p>
                          <v-btn @click="goTo(RoutesManager.home)" :prepend-icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'" color="primary" class="text-white mt-10" width="150" height="50">Back To Home</v-btn>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-container>>

            </v-main>
        </v-layout>
    </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { heros } from './core/manager/AssetsManager';
import RoutesManager from './core/manager/RoutesManager';

const props = defineProps({
    error: Object as () => NuxtError
})
/*##########[ DEFINES ]##########*/
const navDrawer = ref(false);
// const router=useRouter();

// const handleError = () => clearError({ redirect: '/' })
</script>

<style lang="scss" scoped></style>