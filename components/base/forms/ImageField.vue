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

const makeOrderStore = useMakeOrderStore();
const { invalidInputs } = storeToRefs(makeOrderStore);

const emit = defineEmits(["update:modelValue"]);

const uploadPhoto = computed({
  get() {
    return props.modelValue;
  },
  async set(value) {
    if (!Array.isArray(value)) {
      emit("update:modelValue", [value]);
      return;
    }
    emit("update:modelValue", [...value]);
    return;

    const ar = [];

    if (!Array.isArray(value)) {
      ar.push(await fileToBase64(value));
      emit("update:modelValue", ar);
      return;
    }

    value.forEach(async (item) => {
      ar.push(await fileToBase64(item));
    });

    emit("update:modelValue", ar);
  },
});
const { t } = useI18n();
const requiredRule = () => {
  if (!props.required) return [];

  return [(v) => !v || !v.length || t("required")];
};
</script>

<template>
  <label class="text-h6 font-weight-medium"
    >{{ props.label }}
    <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label
  >
  <v-file-input
    accept="image/png, image/jpeg, image/jpg"
    class="mt-1"
    variant="solo-filled"
    prepend-icon=""
    :label="placeholder"
    v-model="uploadPhoto"
    :multiple="isMultiple"
    :readonly="disabled"
    :error-messages="
      invalidInputs.includes(orderOptionValue.id) && !uploadPhoto
        ? $t('required')
        : ''
    "
  >
    <template v-slot:append-inner>
      <v-icon color="primary" icon="mdi mdi-upload"> </v-icon>
    </template>
  </v-file-input>
  <!-- <div class="error-msg">
    <p class="msg" v-if="invalidInputs.includes(orderOptionValue.id)">
      requird
    </p>
  </div> -->
</template>

<style lang="scss">
// .error-msg {
//   padding-inline: 16px;
//   align-items: flex-end;
//   display: flex;
//   font-size: 0.75rem;
//   font-weight: 400;
//   grid-area: messages;
//   letter-spacing: 0.0333333333em;
//   line-height: normal;
//   min-height: 22px;
//   padding-top: 6px;
//   overflow: hidden;
//   justify-content: space-between;
//   .msg {
//     line-height: 12px;
//     word-break: break-word;
//     word-wrap: break-word;
//     hyphens: auto;
//     transition-duration: 150ms;
//     color: rgb(var(--v-theme-error));
//   }
// }
</style>
