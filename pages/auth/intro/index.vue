<script setup lang="ts">
definePageMeta({
  layout: "auth-blank",
});
</script>

<template>
  <v-sheet color="transparent" width="100%" min-height="100vh" class=" d-flex align-center">
    <v-container>
      <v-row >
        <v-col cols="12" md="6">
          <AuthIntroCard />
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
