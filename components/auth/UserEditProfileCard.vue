<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import type { ResponseData } from "~/interfaces/response/response.interface";
import type { Country } from "~/interfaces/shared/shared.interface";
import { brand } from "~/core/manager/AssetsManager";
import type { AuthResponse } from "~/interfaces/auth/auth.interface";

const countries = ref<Country[]>([]);
const selectedCountry = ref<Country | null>(null);
const authStore = useAuthStore();
const { user, authError } = storeToRefs(authStore);
const { update, completeData, logout } = useAuthStore();
const updateBtnLoading = ref(false);
interface EditUserFormData {
  email: null | string;
  name: null | string;
  phone_number: null | string;
  country_code: null | string;
  city_id: null | number;
  password: null | string;
}

const formData = ref<EditUserFormData>({
  email: null,
  name: null,
  phone_number: null,
  country_code: null,
  city_id: null,
  password: null,
});
const confirmedPassword = ref(null);
const deleteMessage = ref(null);
const messageInput = ref(null);
const { notify } = useNotification();
const {t}= useI18n();

const imageUrl = ref("");
const file = ref<File | null>(null);
const userEditFormRef = ref(null);
const loading = ref(false);
const dialogActivation = ref(false);

const validationRules = ref({
  required: (v: any) => !!v || t('required'),
});
const userEditFormValidation = {
  required: (v: any) => !!v || t('required'),
  min: (v: any) => v.length >= 4 || t('at_least_four_char'),
  match: (v: any) => v == formData.value.password || t('password_match'),
};

const fetchCountries = async () => {
  await useAppFetch<ResponseData<Country>>()
    .eventGetCountries()
    .then((response) => {
      countries.value = response.data;
    });
};
const setData = () => {
  if (user.value) {
    formData.value.email = user.value.email;
    formData.value.name = user.value.name;
    formData.value.phone_number = user.value.phone_number;
    formData.value.country_code = user.value.country_code;

    if (user.value.city) {
      formData.value.city_id = user.value.city.id;
    }
  }
  countryChanged(formData.value.country_code);
};

const countryChanged = (value: string | null) => {
  const country = countries.value.find(
    (country) => country.country_code == value
  );
  if (country) {
    selectedCountry.value = country;
  }
  if (!user.value?.complete_data) {
    formData.value.city_id = null;
  }
};

const editFormSubmit = async () => {
  if (!userEditFormRef.value) return;
  // @ts-ignore
  const { valid } = await userEditFormRef.value?.validate();
  if (!valid) return;

  console.log("ee");
  const fd = new FormData();
  for (const name in formData.value) {
    if (name != "password") {
      // @ts-ignore
      fd.append(name, formData.value[name].toString());
    }
  }
  if (file.value) {
    fd.append("avatar_path", file.value);
  }
  updateBtnLoading.value = true;

  update(fd).then(() => {
    updateBtnLoading.value = false;
    if (authError.value && !authError.value.success) {
      notifyAlert("error", authError.value.error.message);
      return;
    }
    notify({
      type: t('success'),
      title: t('success_updated_notification'),
    });
  });
};
const completeFormData = async () => {
  if (!userEditFormRef.value) return;
  // @ts-ignore
  const { valid } = await userEditFormRef.value?.validate();
  if (!valid) return;

  console.log("ee");
  const fd = new FormData();
  for (const name in formData.value) {
    // @ts-ignore
    fd.append(name, formData.value[name].toString());
  }
  if (file.value) {
    fd.append("avatar_path", file.value);
  }
  updateBtnLoading.value = true;
  completeData(fd).then(() => {
    updateBtnLoading.value = false;
    if (authError.value && !authError.value.success) {
      notifyAlert("error", authError.value.error.message);
      return;
    }
    notify({
      type: t('success'),
      title: t('success_updated_notification'),
    });
  });
};
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!!!target.files?.length) return;

  file.value = target.files[0];

  imageUrl.value = await fileToBase64Image(file.value);
};
const deleteProfile = async () => {
  //@ts-ignore
  await messageInput.value.validate();
  if (!deleteMessage.value) return;

  const fd = new FormData();
  if (deleteMessage.value) {
    fd.append("message", deleteMessage.value);
  }

  loading.value = true;
  useAppFetch<AuthResponse>()
    .deleteProfile(fd)
    .then((response) => {
      notifyAlert("success", response.meta.message);
      loading.value = false;
      dialogActivation.value = false;

      setTimeout(() => {
        logout()
      }, 300);

    })
    .catch((error) => {
      loading.value = false;
      dialogActivation.value = false;
      SET_ERROR(error)

    });
};
onMounted(() => {
  fetchCountries().then(() => {
    setData();
  });
});
</script>

<template>
  <v-form ref="userEditFormRef" @submit.prevent="editFormSubmit">
    <div
      class="d-flex flex-column flex-md-row align-md-center py-10 ga-6 justify-space-between align-start"
    >
      <div class="d-flex ga-6 align-center font-weight-medium text-h6">
        <div class="user-profile">
          <v-avatar class="d-flex align-end" size="80">
            <v-img :lazy-src="brand.avatar" :src="imageUrl"> </v-img>
            <div
              class="position-absolute d-flex justify-center align-center camera-icon"
            >
              <v-icon size="17" color="white" class="">mdi-camera</v-icon>
            </div>
            <input
              class="file"
              accept="image/png, image/jpeg, image/jpg"
              type="file"
              @change="handleFileUpload"
            />
          </v-avatar>
        </div>
        <div class="d-flex align-center ga-3">
          {{ user?.name }}
          <v-icon
            v-if="user?.verification_cards?.status == 'approved'"
            size="20"
            color="blue"
            >mdi-check-decagram</v-icon
          >
        </div>
      </div>

      <BaseConfirmActionDialog
        @confirm="deleteProfile"
        :loading="loading"
        v-model="dialogActivation"
      >
        <template v-slot:delete-message>
          <v-text-field
            ref="messageInput"
            :rules="[validationRules.required]"
            v-model="deleteMessage"
            variant="solo-filled"
            density="compact"
            class="mb-4"
            :placeholder="$t('tell_us_why')"
          ></v-text-field>
        </template>
        <template v-slot="activatorProps">
          <v-btn
            v-bind="activatorProps"
            size="large"
            rounded="lg"
            color="red"
            append-icon="mdi-trash-can-outline"
            >{{$t('delete_account')}}</v-btn
          >
        </template>
      </BaseConfirmActionDialog>
    </div>

    <v-row>
      <!-- Name -->

      <v-col cols="12" sm="12">
        <label for="name" class="font-weight-medium">{{ $t('name') }}</label>
        <v-text-field
          :rules="[userEditFormValidation.required]"
          v-model="formData.name"
          type="text"
          id="name"
          variant="solo-filled"
          class="mt-1"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <label for="email" class="font-weight-medium">{{ $t('email') }}</label>
        <v-text-field
          v-model="formData.email"
          :disabled="!!user?.email"
          class="mt-1"
          type="email"
          width="100%"
          placeholder="triosnd@gmail.com"
          variant="solo-filled"
          id="email"
        ></v-text-field>
      </v-col>
      <!-- Phone Number -->
      <v-col cols="12" sm="6">
        <label for="phone_number" class="font-weight-medium"
          >{{ $t('phone_number') }}</label
        >
        <BaseFormsPhoneField
          :required="false"
          :disabled="user?.complete_data"
          :country-no-change="true"
          :country="selectedCountry"
          v-model="formData.phone_number"
          id="phone_number"
          variant="solo-filled"
          :placeholder="$t('phone_number')"
          class="mt-1"
        >
        </BaseFormsPhoneField>
      </v-col>
      <!-- COUNTRY -->

      <v-col cols="12" sm="6">
        <label for="country" class="font-weight-medium"
          >{{ $t('country') }}</label
        >
        <v-select
          :disabled="user?.complete_data"
          @update:model-value="countryChanged"
          v-model="formData.country_code"
          :items="countries"
          item-value="country_code"
          class="mt-1"
          variant="solo-filled"
          item-title="name"
          :placeholder=" $t('country')"
          menu-icon="mdi-chevron-down"
          id="country"
        >
        </v-select>
      </v-col>
      <!-- CITIES -->

      <v-col cols="12" sm="6">
        <label for="city">{{ $t('city') }}</label>
        <v-select
          :disabled="user?.complete_data"
          v-model="formData.city_id"
          :items="selectedCountry?.cities"
          :placeholder="$t('city') "
          class="mt-1"
          variant="solo-filled"
          item-title="name"
          :rules="[userEditFormValidation.required]"
          item-value="id"
        ></v-select>
      </v-col>
      <template v-if="!user?.complete_data">
        <v-col cols="12" sm="6">
          <label for="password" class="font-weight-medium">{{ $t('password') }}</label>
          <v-text-field
            v-model="formData.password"
            class="mt-1"
            type="password"
            id="password"
            variant="solo-filled"
            :placeholder="$t('password')"
            :rules="[
              userEditFormValidation.required,
              userEditFormValidation.min,
            ]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <label for="password" class="font-weight-medium"
            >{{ $t('confirm_password') }}</label
          >
          <v-text-field
            v-model="confirmedPassword"
            class="mt-1"
            type="password"
            id="password"
            variant="solo-filled"
            :placeholder="$t('confirm_password')"
            :rules="[
              userEditFormValidation.required,
              userEditFormValidation.match,
            ]"
          ></v-text-field>
        </v-col>
      </template>
      <!-- BUTTON -->
      <v-col v-if="user?.complete_data" cols="12" sm="7" class="mx-auto">
        <v-btn
          rounded="lg"
          :disabled="updateBtnLoading"
          color="primary"
          type="submit"
          block
          class="text-white mt-5"
          height="55"
          :loading="updateBtnLoading"
          >{{ $t('save') }}
        </v-btn>
      </v-col>
      <v-col v-else cols="12" sm="7" class="mx-auto">
        <v-btn
          @click="completeFormData"
          rounded="lg"
          :disabled="updateBtnLoading"
          color="primary"
          type="button"
          block
          class="text-white mt-5"
          height="55"
          :loading="updateBtnLoading"
          >{{ $t('complete_data') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped lang="scss">
.user-profile {
  position: relative;

  .file {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
  }
}

.camera-icon {
  width: 100%;
  height: 35%;
  background-color: #00000050;
  padding-bottom: 5%;
}
</style>
