<script setup>
import { heros } from "~/core/manager/AssetsManager"

const userRate = ref(2)


</script>

<template>
   

<v-container>
        <div class="d-flex  justify-space-between align-center"
            :class="$vuetify.display.smAndDown ? 'flex-column ga-4': ''">
            <div class="d-flex ga-6 "  :class="$vuetify.display.smAndDown ? 'flex-column align-center': ''">
                <v-avatar :image="heros.hero_10" rounded="lg" size="70" class="half-shadow">
                </v-avatar>
                <div width="30">
                    <p class="text-md-h5 h6 font-weight-bold">Mohamed ahmed driver</p>
                    <p class="text-primary text-center">trio global</p>
                </div>
            </div>
            <div class="d-flex flex-column align-center ga-2">
                <p class="text-primary font-weight-bold text-md-h5 h6 text-center">$500,00</p>
                <!-- <span  class="mdi mdi-star text-primary "></span> -->
                <v-rating   size="25" active-color="primary" empty-icon="mdi-star" color="blue-grey-lighten-5" v-model="userRate"></v-rating>
                <!-- <template v-for="index in 5">
                    <v-icon v-if="index <= userRate" color="primary"> mdi-star </v-icon>
                    <v-icon color="blue-grey-lighten-5" v-else> mdi-star </v-icon>
                </template> -->
            </div>
            <div class="d-flex ga-4">
                <v-btn width="100" height="40" rounded="lg" color="green-darken-1">Approve</v-btn>
                <v-btn width="100" height="40"  rounded="lg" color="red-accent-4">Decline</v-btn>
            </div>
        </div>
</v-container>
  

</template>


<style lang="scss">

.half-shadow {
    box-shadow: 0 0 0 2px #fff, 3px 3px 10px #0000002a !important;
}
</style>