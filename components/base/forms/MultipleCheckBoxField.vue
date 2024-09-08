<script setup lang="ts">
const props = defineProps([
  "label",
  "items",
  "modelValue",
  "required",
  "placeholder",
  'required',
  'isMultiple',
  'disabled',
  'orderOptionValue'
]);
const emit = defineEmits(["update:modelValue"]);

const checkValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const {t} = useI18n();
const requiredRule = () => {

if (!props.required) return [];


return [(v: any) => !!v || t('required')]

}
</script>
<template>
<label class="text-h6 font-weight-medium">{{ props.label }} <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label>
  <v-select
    v-model="checkValue"
    variant="solo-filled"
    multiple
    :items="items"
    item-title="name"
    item-value="id"
    :placeholder="props.placeholder"
     menu-icon="mdi-chevron-down"
     color=primary
     :rules="requiredRule()"
      class="mt-1"
      :readonly="disabled"
  ></v-select>
  
</template>

<style scoped></style>
