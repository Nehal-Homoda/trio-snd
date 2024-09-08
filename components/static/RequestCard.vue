<script setup lang="ts">
import {heros} from "~/core/manager/AssetsManager"
</script>


<template>

   <v-container>
  
    <v-card class=" pa-5 d-flex justify-space-between align-center card-border " :class="$vuetify.display.smAndDown ? 'flex-column ga-3'  : ''"     rounded="lg">
       
        <v-avatar :image="heros.hero_10" rounded="0" size="100"></v-avatar>

        <div class="d-flex flex-column text-md-h5 text-h6">
            <span class="font-weight-bold text-center">رقم الطلب</span>
            <v-card-subtitle class="text-primary text-h6 font-weight-bold mt-2">
             SND12345
            </v-card-subtitle>
        </div>

        <div class="text-h6 d-flex align-center ga-2">
            <v-icon  size="25" icon="mdi-clock-outline" color="primary" class=""></v-icon>
            06-06-2024
        </div>
        <v-btn  min-width="175" height="45px"  color="primary" class="text-white" rounded="lg">تفاصيل الطلب</v-btn>
    </v-card>
</v-container>
</template>



<style lang="scss">

.card-border{
    box-shadow:0 0 0 0.5px #e0ddddbe !important  ;
}
</style>