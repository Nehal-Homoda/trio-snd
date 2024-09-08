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
  "displayFiles",
]);

const makeOrderStore = useMakeOrderStore();
const { invalidInputs, savedSelectFileComponentsData } = storeToRefs(makeOrderStore);

const emit = defineEmits(["update:modelValue"]);
const data = ref(null);
const images = ref([]);
const base64 = ref([]);
const isDataSet = ref(false);

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
const uploadImage = async (value) => {
  if (!Array.isArray(value)) {
    images.value = await filesToBase64Images([value]);
    base64.value = await filesToBase64([value]);
    saveToStore([value])

    sendImagesToFormData();
    return;
  }
  images.value = [...(await filesToBase64Images(value)), ...images.value];
  base64.value = [...(await filesToBase64(value)), ...base64.value];
  saveToStore([...value])
  sendImagesToFormData();
};
const removeImage = (index) => {
  images.value.splice(index, 1);
  base64.value.splice(index, 1);
  if (Array.isArray(data.value)) {
    data.value.splice(index, 1);

    if (!data.value.length) {
      data.value = null;
    }

  } else {
    data.value = null;
  }
  saveToStore(data.value)
  sendImagesToFormData();
};
const sendImagesToFormData = () => {
  emit("update:modelValue", [...base64.value]);
};
const saveToStore = (files) => {
  if (files) {
    savedSelectFileComponentsData.value[props.orderOptionValue.id].files = [...files];
  }

  savedSelectFileComponentsData.value[props.orderOptionValue.id].images = [...images.value];
  savedSelectFileComponentsData.value[props.orderOptionValue.id].base64 = [...base64.value];
};
watch(props, (newValue) => {
  if (props.displayFiles && !isDataSet.value) {
    isDataSet.value = true;
    images.value = [...props.displayFiles];
    base64.value = [...props.displayFiles];
  }
});
onMounted(() => {
  if (props.displayFiles) {
    images.value = [...props.displayFiles];
    base64.value = [...props.displayFiles];
  }

  if (props.orderOptionValue) {
    const stored = savedSelectFileComponentsData.value[props.orderOptionValue.id];
    console.log(stored)
    if (stored && stored.base64.length && stored.files.length && stored.images.length) {

      images.value = [...stored.images];
      base64.value = [...stored.base64];
      data.value = [...stored.files];
    }
  }
});
</script>

<template>
  <label class="text-h6 font-weight-medium">{{ label }}
    <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label>
  <v-file-input class="mt-1" variant="solo-filled" accept="application/pdf" prepend-icon=""
    :label="placeholder" v-model="data" @update:model-value="uploadImage" :clearable="false" :multiple="isMultiple"
    :readonly="disabled" :rules="required ? [(v) => (!!v && v.length) || base64.length || $t('required')] : undefined">
    <template v-slot:append-inner>
      <v-icon color="primary" icon="mdi mdi-upload"> </v-icon>
    </template>
  </v-file-input>

  <div class="displayed-images">
    <template v-for="(image, index) in images">
      <div class="file-box">
        <v-btn v-if="!disabled" min-width="25" max-width="25" min-height="25" max-height="25"
          @click="removeImage(index)" icon="mdi-close" size="xxx-small" color="error" variant="text"
          class="delete-image-btn">
          <v-icon size="15">mdi-close</v-icon>
        </v-btn>
        <v-btn :href="image" target="_blank" prepend-icon="mdi-download" color="primary" width="100" variant="tonal"
          rounded="pill">{{ $t('file') }}</v-btn>
      </div>
    </template>
  </div>

  <!-- <div class="error-msg">
    <p class="msg" v-if="invalidInputs.includes(orderOptionValue.id)">
      requird
    </p>
  </div> -->
</template>

<style scoped lang="scss">
.displayed-images {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;

  .file-box {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .delete-image-btn {
      flex-shrink: 0;
      flex-grow: 0;
    }
  }

}
</style>
