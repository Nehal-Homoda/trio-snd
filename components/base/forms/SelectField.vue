<script setup lang="ts">
const props = defineProps([
  "modelValue",
  "items",
  "label",
  "placeholder",
  "required",
  "isMultiple",
  'disabled',
  'orderOptionValue'
]);
const emit = defineEmits(["update:modelValue"]);

const selectedValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
const {t}=useI18n();

const requiredRule = () => {
  if (!props.required) return [];

  return [(v: any) => !!v || t('required')];
};
</script>

<template>
 <label class="text-h6 font-weight-medium">{{ props.label }} <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label>
  <v-select
    variant="solo-filled"
    :items="items"
    :placeholder="placeholder"
    item-title="name"
    item-value="id"
    menu-icon="mdi-chevron-down"
    v-model="selectedValue"
    :rules="requiredRule()"
    class="mt-1"
    :readonly='disabled'
  >
  </v-select>
</template>

<style lang="scss"></style>
