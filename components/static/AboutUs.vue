<script setup lang="ts">
import { heros, icons } from "~/core/manager/AssetsManager";
</script>
<template>
  <v-sheet color="transparent" class="py-16">
    <v-container>
      <v-row>
        <v-col sm="8" md="6" cols="12">
          <div class="d-flex flex-column ga-3">
            
            <BaseTitleSection v-if="!$vuetify.locale.isRtl"  :first="$t('about_us_section.about')" class="text-center text-sm-start" :second="$t('about_us_section.us')" />
            <BaseTitleSection v-if="$vuetify.locale.isRtl" :first="$t('about_us_section.us')" class="text-center text-sm-start" :second="$t('about_us_section.about')" />
            <p class="text-body-1  text-center text-sm-start" color="grey">
               {{ $t('about_us_section.desc_1') }}
             <br/>
             <br/>
              {{ $t('about_us_section.desc_2') }}
             <br/>
             <br/>
              {{ $t('about_us_section.desc_3') }}
            </p>
            <!-- <p class="w-100 w-md-75 mx-auto text-center font-size-large font-weight-medium px-3 px-sm-16">
        Lorem ipsum dolor sit amet, consectetur adipiscing Nunc odio in et, lectus sit lorem id integer.
        Lorem ipsum dolor sit amet, consectetur 
      </p> -->
            <v-img width="70" height="70" :src="icons.iconTrioLogo" class="arrow-element-img mt-16 ms-16 " />
          </div>
        </v-col>
        <v-col sm="4" md="6" cols="12">
          <div class="space d-block d-sm-none my-16"></div>
          <div class="d-flex justify-center align-center">
            <v-img height="400" :src="heros.hero_15" class="about-img" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style scoped lang="scss">
.arrow-element-img {
  transform: rotate(85deg);
}

.v-locale--is-rtl {
  .arrow-element-img {
    transform: rotate(-45deg);
  }
}
</style>
