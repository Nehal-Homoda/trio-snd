<script setup lang="ts">


const props = defineProps(["label", "placeholder", "modelValue", 'required','isMultiple','items','disabled','orderOptionValue']);
const emit = defineEmits(["update:modelValue"]);
const textInput = computed({
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


  return [(v: any) => !!v || t('required'), (v: any) => v >= 1 || 'must be at least 1']

}
</script>

<template>
<label class="text-h6 font-weight-medium">{{ props.label }} <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label>
  <v-text-field
    v-model="textInput"
    class="mt-1"
    variant="solo-filled"
    type="number"
    :placeholder="props.placeholder"
    :rules="requiredRule()"
    :items="items"
    :readonly="disabled"
  >
  </v-text-field>
</template>

<style lang="scss"></style>
