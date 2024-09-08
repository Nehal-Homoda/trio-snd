<script setup lang="ts">
import type { ResponseData } from "~/interfaces/response/response.interface";
import type { Country } from "~/interfaces/shared/shared.interface";

const props = defineProps([
  "country",
  "countryNoChange",
  "required",
  "disabled",
  "orderOptionValue",
]);
const emit = defineEmits(["country-changed"]);

const countries = ref<Country[]>([]);
const selectedCountry = ref<Country | null>(null);

const fetchContries = () => {
  useAppFetch<ResponseData<Country>>()
    .eventGetCountries()
    .then((response) => {
      countries.value = response.data;
      if (countries.value.length && !props.country) {
        selectedCountry.value = response.data[0];
        emit("country-changed", selectedCountry.value);
      }
    });
};
const setCountry = (country: Country) => {
  selectedCountry.value = country;
  emit("country-changed", selectedCountry.value);
};

const { t } = useI18n();
const validationRules = ref({
  required: (v: any) => !!v || t("phone_required"),
  min: (v: any) => (!!v && v.length >= 5) || t("at_least_five_number"),
  num: (v: any) => v >= 0 || t("negetive_number"),
});
watch(
  props,
  (newValue) => {
    if (newValue) {
      selectedCountry.value = props.country;
    }
  },
  { deep: true }
);

onMounted(() => {
  fetchContries();
  if (props.country) {
    selectedCountry.value = props.country;
    emit("country-changed", selectedCountry.value);
  }
});
</script>

<template>
  <v-text-field
    autocomplete="off"
    variant="solo-filled"
    type="number"
    placeholder="text"
    class="input-no-elevation mt-1"
    :rules="[
      validationRules.required,
      validationRules.num,
      validationRules.min,
    ]"
    :readonly="disabled"
    :disabled="disabled"
    hide-spin-buttons
  >
    <template v-slot:prepend-inner>
      <v-menu>
        <template v-slot:activator="{ props, isActive }">
          <v-btn
            :disabled="countryNoChange"
            size="small"
            color="transpernt"
            variant="plain"
            :ripple="false"
            v-bind="props"
          >
            {{ selectedCountry?.country_code }}
            <template v-slot:append>
              <v-icon v-if="isActive">mdi-chevron-up</v-icon>
              <v-icon v-else>mdi-chevron-down</v-icon>
            </template>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in countries"
            :key="i"
            @click="setCountry(item)"
          >
            <v-list-item-title>
              {{ item.country_code }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-text-field>
</template>

<style lang="scss"></style>
