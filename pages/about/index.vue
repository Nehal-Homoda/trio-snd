<template>
  <v-sheet
    class="about-us py-16"
    color="transparent"
  >
      <v-card theme="dark" width="100%" height="300px" rounded="0" elevation="0" class="d-flex align-center justify-center text-center">

        <template v-slot:image>
          <v-img width="100%" height="100%" cover :src="bg.bg_1"></v-img>
        </template>
        <h1 class="text-h3 font-weight-bold ">
          {{$t('how_we_are')}}
        </h1>
      </v-card>
      <StaticAboutUs />
      <StaticWhyTrio />
  </v-sheet>
</template>

<script setup lang="ts">
import { bg } from '~/core/manager/AssetsManager';
</script>

<style lang="scss" scoped></style>
