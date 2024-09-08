<template>
  <v-form ref="changePasswordFormRef" @submit.prevent="changePasswordSubmit()">
    <!-- <label for="password"  class=" font-weight-medium">Old Password*</label>
        <v-text-field v-model="formData.password" class="mt-1" type="password" id="password" variant="solo-filled"
            placeholder="type your old password" :rules="[validationRules.required,validationRules.min]"></v-text-field> -->

    <v-row>
      <v-col cols="12" sm="6">
        <label for="password" class="font-weight-medium ">{{ $t('new_password') }}<v-icon color="error" size="10">mdi-asterisk</v-icon></label>
        <v-text-field v-model="formData.newPassword" class="mt-3" id="password" variant="solo-filled"
          :placeholder="$t('new_password')" :rules="[validationRules.required, validationRules.min]"
          :append-inner-icon="visible1 ? 'mdi-eye-off' : 'mdi-eye'" :type="visible1 ? 'text' : 'password'"
          @click:append-inner="visible1 = !visible1"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <label for="password" class="font-weight-medium ">{{ $t('confirm_new_password') }}<v-icon color="error" size="10">mdi-asterisk</v-icon></label>
        <v-text-field v-model="formData.confirmedPassword" class="mt-3" id="password" variant="solo-filled"
          :placeholder="$t('confirm_new_password')" :rules="[validationRules.required, validationRules.match]"
          :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'" :type="visible2 ? 'text' : 'password'"
          @click:append-inner="visible2 = !visible2"></v-text-field>
      </v-col>

      <!-- BUTTON -->

      <v-col cols="12" sm="6" class="mx-auto">
        <v-btn rounded="lg" :disabled="changeBtnloading" color="primary" type="submit" block class="text-white mt-5"
          height="55" :loading="changeBtnloading">{{ $t('save') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
const formData = ref({
  password: null,
  newPassword: null,
  confirmedPassword: null,
});
const { changePassword } = useAuthStore();
const changeBtnloading = ref(false);
const authStore = useAuthStore();
const { isPasswordChange } = storeToRefs(authStore);
const visible1 = ref(false);
const visible2 = ref(false);

const validationRules = {
  required: (v: any) => !!v || "required",
  min: (v: any) => v.length >= 8 || "at least 8 character",
  match: (v: any) => v == formData.value.newPassword || "password not match",
};
const changePasswordFormRef = ref(null);

const changePasswordSubmit = async () => {
  if (!changePasswordFormRef.value) return;
  // @ts-ignore
  const { valid } = await changePasswordFormRef.value.validate();
  if (!valid) return;
  changeBtnloading.value = true;

  const fd = new FormData();
  // @ts-ignore
  fd.append("new_password", formData.value.newPassword.toString());
  changePassword(fd).then(() => {
    if (!!isPasswordChange) {
      formData.value.confirmedPassword = null;
      formData.value.newPassword = null;
      formData.value.password = null;
    }
    changeBtnloading.value = false;
  });
};
</script>

<style scoped></style>
