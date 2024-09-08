<script setup lang="ts">
const email = ref(null);
const authStore = useAuthStore();
const { resetPassword } = useAuthStore();
const { resetPasswordSuccessMessage } = storeToRefs(authStore);
const showMessage = ref(false);
const resetForm = ref(null);
const loading = ref(false);

const {t} = useI18n();

const emailRules = ref([
  (value) => {
    if (value) return true;

    return t('email_required');
  },
  (value) => {
    if (/.+@.+\..+/.test(value)) return true;

    return t('email_valid');
  },
]);
const handleReset = async () => {
  if (!resetForm.value) return;
  //@ts-ignore
  const { valid } = await resetForm.value.validate();
  console.log(resetForm.value);
  console.log(valid);
  if (!valid) return;
  loading.value = true;

  const fd = new FormData();
  if (!email.value) return;
  fd.append("email", email.value);
  console.log(fd);

  resetPassword(fd).then(() => {
    loading.value = false;
    email.value = null;
  });
};

onBeforeUnmount(() => {
  resetPasswordSuccessMessage.value = "";
});
</script>

<template>
  <v-form ref="resetForm" @submit.prevent="handleReset">
    <p
      v-if="authStore.authError && !authStore.authError.success"
      class="text-body-2 font-weight-bold text-error mb-2"
    >
      {{ authStore.authError.error.message }}
    </p>

    <p
      v-if="resetPasswordSuccessMessage"
      class="text-body-2 font-weight-bold text-success mb-2"
    >
      {{ resetPasswordSuccessMessage }}
    </p>

    <p class="text-body font-weight-bold mb-5">
      {{ $t("reset_desc") }}
    </p>
    <label for="email" class="font-weight-medium">{{ $t("email") }}</label>
    <v-text-field
      type="email"
      id="email"
      class="mt-1"
      :placeholder="$t('email')"
      variant="solo-filled"
      v-model="email"
      :rules="emailRules"
    >
    </v-text-field>

    <v-btn
      :loading="loading"
      color="primary"
      class="text-white text-md-h5 mt-5"
      rounded="lg"
      width="100%"
      size="x-large"
      type="submit"
    >
      {{ $t("reset") }}
    </v-btn>
  </v-form>
</template>

<style lang="scss" scoped></style>
