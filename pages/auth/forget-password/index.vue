<script setup lang="ts">
definePageMeta({
  layout: "auth-blank",
});

const {t} = useI18n();
const resetPassword=ref(t('reset_password'))
</script>

<template>
  <v-sheet
    color="transparent"
    width="100%"
    min-height="100vh"
    class="d-flex align-center"
  >
    <v-container >
      <v-row>
        <v-col cols="12" md="6" class="mx-auto">
          <AuthFormCard :title="resetPassword" max-width="480px" class="mx-auto">
            <AuthResetPasswordForm />
          </AuthFormCard>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
