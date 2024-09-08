<script setup lang="ts">
import type {
  ResponseData,
  ResponseWithValue,
} from "~/interfaces/response/response.interface";
import type { City, Country } from "~/interfaces/shared/shared.interface";

// ############### Define ##########
const countries = ref<Country[]>([]);
const selectedCountry = ref<Country | null>();
const formRef = ref(null);

const selectedCity = ref<number | null>(null);
const dialog = ref(false);
const props = defineProps(["city", "type", "readonly", "countryId"]);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const emit = defineEmits(["update-cities"]);
const isActivated = ref(false);

//#################### METHODS ############
const fetchCountries = async () => {
  console.log("hi");
  await useAppFetch<ResponseData<Country>>()
    .eventGetCountries()
    .then((response) => {
      countries.value = response.data;

      selectedCountry.value = countries.value.find((item) => {
        if (!user.value) return;

        return item.country_code == user.value.country_code;
      });
    });
};
const handleSelectedCountry = (countryId: any) => {
  selectedCity.value = null;
  selectedCountry.value = countries.value.find((item) => {
    selectedCity.value = null;
    return item.id == countryId;
  });
};
const validationRules = {
  required: (v: any) => !!v || "required",
};

const onsubmit = async () => {
  if (!formRef.value) return;
  //@ts-ignore
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  const fd = new FormData();
  if (!selectedCity.value) return;
  console.log("in");
  fd.append("city_id", selectedCity.value.toString());

  if (props.type == "add") {
    useAppFetch<ResponseWithValue<City>>()
      .eventAddCity(fd)
      .then((response) => {
        notifyAlert("success", response.meta.message);
        emit("update-cities", response.data);
        dialog.value = false;
      })
      .catch((error) => {
        SET_ERROR(error);
      });
  }
  if (props.type == "update") {
    // console.log(selectedCity.value)
    useAppFetch<ResponseWithValue<City>>()
      .eventActivateCity(fd)
      .then((response) => {
        props.city.is_active_user = !props.city.is_active_user;
        notifyAlert("success", response.meta.message);
        emit("update-cities");
        dialog.value = false;
      })
      .catch((error) => {
        SET_ERROR(error);
      })
      .finally(() => {});
  }
};

onMounted(() => {
  console.log("User", user.value);
  fetchCountries().then(() => {
    if (props.countryId) {
      handleSelectedCountry(props.countryId);
    }
    if (props.city) {
      selectedCity.value = props.city.id;
    }
  });
});
</script>

<template>
  <v-dialog max-width="900" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <slot v-bind="activatorProps"></slot>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="pa-10" rounded="lg">
        <v-form ref="formRef" @submit.prevent="onsubmit()">
          <v-row>
            <v-col cols="12" sm="6">
              <label for=""
                >{{ $t("country") }}
                <v-icon color="error" size="10">mdi-asterisk</v-icon></label
              >
              <v-select
                :readonly="readonly"
                v-model="selectedCountry"
                :rules="[validationRules.required]"
                :placeholder="$t('select_country')"
                @update:model-value="handleSelectedCountry"
                class="mt-2"
                variant="solo-filled"
                menu-icon="mdi-chevron-down"
                color="primary"
                :items="countries"
                item-value="id"
                item-title="name"
              >
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <label for=""
                >{{ $t("city") }}
                <v-icon color="error" size="10">mdi-asterisk</v-icon></label
              >
              <v-select
                v-model="selectedCity"
                :readonly="readonly"
                :rules="[validationRules.required]"
                :placeholder="$t('select_city')"
                class="mt-2"
                variant="solo-filled"
                menu-icon="mdi-chevron-down"
                :items="selectedCountry ? selectedCountry.cities : []"
                item-title="name"
                item-value="id"
              >
              </v-select>
            </v-col>
            <v-col v-if="props.type == 'add'" cols="12" sm="6" class="mx-auto">
              <v-btn
                type="submit"
                height="45"
                rounded="lg"
                width="100%"
                color="primary"
                class="text-white"
              >
                {{ $t("add") }}
              </v-btn>
            </v-col>
            <v-col
              v-if="props.type == 'update'"
              cols="12"
              sm="6"
              class="mx-auto"
            >
              <v-btn
                v-if="city.is_active_user"
                type="submit"
                height="45"
                rounded="lg"
                width="100%"
                color="primary"
                class="text-white"
              >
                {{ $t("deactivate") }}
              </v-btn>
              <v-btn
                v-else
                type="submit"
                height="45"
                rounded="lg"
                width="100%"
                color="primary"
                class="text-white"
              >
                {{ $t("activate") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped></style>
