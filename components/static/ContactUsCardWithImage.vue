<script setup>
import { bg, icons } from "~/core/manager/AssetsManager";
import { appInfo } from "~/core/config/app.config";
</script>
<template>
  <v-card
    rounded="0"
    theme="dark"
    width="100%"
    :height="$vuetify.display.lgAndUp ? '80vh' : 'auto'"
    class="contact-us-card-with-image py-16 text-center"
  >
    <template v-slot:image>
      <v-img
        width="100%"
        height="100%"
        cover
        position="top"
        :src="bg.bg_8"
      ></v-img>
    </template>

    <h2
      class="text-h3 text-md-h2 text-lg-h1 mt-0 mt-md-16 pt-16 mb-5 font-weight-bold"
    >
      {{ $t('for_contact') }}
    </h2>

    <!-- <p class="text-h5 text-lg-h4 mb-5 mb-md-10">من اجل تواصلك معنا</p> -->

    <BaseGradientBtn
      :href="`https://wa.me/${appInfo.contact.phone}`"
      target="_blank"
      height="55"
      class="my-16 px-7"
    >
      <img :src="icons.whatsappIcon" width="30" class="me-3" />
      {{ $t('Contact us via Whatsapp') }}
    </BaseGradientBtn>
  </v-card>
</template>

<style lang="scss" scoped></style>
