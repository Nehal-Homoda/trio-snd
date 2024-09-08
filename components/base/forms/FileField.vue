<script setup>
const props = defineProps([
  "label",
  "placeholder",
  "modelValue",
  "required",
  "isMultiple",
  "items",
  "disabled",
  "orderOptionValue",
]);
const emit = defineEmits(["update:modelValue"]);

const uploadFile = computed({
  get() {
    return props.modelValue;
  },
  set(value) {

    console.log(value)


    emit("update:modelValue", value);
  },
});

const {t} = useI18n();
const requiredRule = () => {
  if (!props.required) return [];

  return [(v) => !!v || t('required')];
};
</script>

<template>
<label class="text-h6 font-weight-medium">{{ props.label }} <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label>
  <v-file-input
    class="mt-1"
    variant="solo-filled"
    prepend-icon=""
    label="Please Add Photo"
    v-model="uploadFile"
    :rules="requiredRule()"
    multiple
    :items="items"
    :readonly="disabled"
  >
    <template v-slot:append-inner>
      <v-icon color="primary" icon="mdi mdi-upload"> </v-icon>
    </template>
  </v-file-input>
</template>

<style lang="scss"></style>
