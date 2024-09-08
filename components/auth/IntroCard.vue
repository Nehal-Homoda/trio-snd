<script setup lang="ts">
import RoutesManager from "~/core/manager/RoutesManager";



const authStore = useAuthStore();
const { userType } = storeToRefs(authStore);
const localePath = useLocalePath();
const changeUserTypeHandling = (type: string) => {
  userType.value = type;
  goTo(RoutesManager.login)
};
</script>

<template>
  <v-card theme="light" class="py-12 px-10" rounded="xl" >
    <div class="d-flex flex-column ga-5">
      <NuxtLink
        @click="$router.back()"
        class="text-primary pointer px-0 text-decoration-none"
        :ripple="false"
      >
      <v-icon color="primary" :icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'" class="mr-2"></v-icon>
        Back
      </NuxtLink>
      <h2 class="text-primary text-h4 font-weight-black" ></h2>
    </div>
    <div class="d-flex justify-space-between mt-16 mb-5">
      <v-btn
        width="45%"
        height="50"
        color="primary"
        rounded="lg"
        class="text-white"
        @click="changeUserTypeHandling('provider') "
      
        >Provider</v-btn
      >
      <v-btn
        width="45%"
        height="50"
        color="primary"
        rounded="lg"
        class="text-white"
        @click="changeUserTypeHandling('user')"
        >User</v-btn
      >
    </div>
  </v-card>
</template>

<style lang="scss" scoped></style>
