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
  "displayImages",
]);
const validErrorMessage = ref('')

const makeOrderStore = useMakeOrderStore();
const { invalidInputs, savedSelectImageComponentsData } = storeToRefs(makeOrderStore);

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

const {t} = useI18n();

const checkFileSizeValid = (fileSize) => {

  if (fileSize > 2) {
      // if file > 4mb show alert message max file size is 4mb

      validErrorMessage.value = t('max_image_size')

      

      return false;
    }


    return true
}
const uploadImage = async (value) => {

  
  if (!Array.isArray(value)) {

    const fileSize = byteToMb(value.size);
    
    if (!checkFileSizeValid(fileSize)) {
      data.value = null;
      images.value = []
      base64.value = []
      return
    
    };

    images.value = await filesToBase64Images([value]);
    base64.value = await filesToBase64([value]);
    saveToStore([value])



    sendImagesToFormData();
    return;
  }

  let isFileSizeValid = true;
  // const invalidItems = [];

  for (const [index, item] of data.value.entries()) {

        const fileSize = byteToMb(item.size)
        if (!checkFileSizeValid(fileSize)) {
        //  invalidItems.push(index);
          isFileSizeValid = false;
          // continue;
          break;
        }
  }

  if (!isFileSizeValid) {
    data.value = null;
    images.value = [];
    base64.value = [];
    return;
  }

  // invalidItems.forEach(item => {

  //   data.value.splice(item, 1);
  //   images.value.splice(item, 1);
  //   base64.value.splice(item, 1);

  // })

  // if (Array.isArray(data.value) && !data.value.length) {
  //   data.value = null;
  // }
  
  // if (!isFileSizeValid) return;

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
    savedSelectImageComponentsData.value[props.orderOptionValue.id].files = [...files];
  }

  savedSelectImageComponentsData.value[props.orderOptionValue.id].images = [...images.value];
  savedSelectImageComponentsData.value[props.orderOptionValue.id].base64 = [...base64.value];
};

watch(props, (newValue) => {
  if (props.displayImages && !isDataSet.value) {
    isDataSet.value = true;
    images.value = [...props.displayImages];
    base64.value = [...props.displayImages];
  }
});
onMounted(() => {
  if (props.displayImages) {
    images.value = [...props.displayImages];
    base64.value = [...props.displayImages];
  }

  if (props.orderOptionValue) {
    const stored = savedSelectImageComponentsData.value[props.orderOptionValue.id];
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
  <v-file-input :error-messages="validErrorMessage" accept="image/png, image/jpeg, image/jpg" class="mt-1" variant="solo-filled"
    prepend-icon="" :label="placeholder" v-model="data" @update:model-value="uploadImage" :clearable="false"
    :multiple="isMultiple" :readonly="disabled"
    :rules="required ? [(v) => (!!v && v.length) || base64.length || $t('required')] : undefined">
    <template v-slot:append-inner>
      <v-icon color="primary" icon="mdi mdi-upload"> </v-icon>
    </template>
  </v-file-input>
  <div class="displayed-images">
    <template v-for="(image, index) in images">
      <div class="image-box">
        <v-btn v-if="!disabled" @click="removeImage(index)" icon="mdi-close" size="xxx-small" color="error"
          variant="text" class="delete-image-btn">
          <v-icon size="20">mdi-close</v-icon>
        </v-btn>
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-img v-bind="activatorProps" width="100%" height="100%" :src="image" class=""></v-img>
          </template>

          <template v-slot:default="{ isActive }">
            <div class="text-end">
              <v-btn @click="isActive.value = false" size="x-small" color="black" variant="tonal" class="mb-2 preview-image-dialog-close-btn"  icon="mdi-close"></v-btn>
              <v-card height="500"rounded="0" color="white" class="primary-border" >
                <v-img width="100%" height="100%" :lazy-src="image" :src="image" class=""></v-img>
              </v-card>
            </div>
          </template>
        </v-dialog>
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
.primary-border {
   border: 2px solid rgb(var(--v-theme-primary)); 
}
.displayed-images {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 100px;
  gap: 1rem;

  .image-box {
    box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .delete-image-btn {
    position: absolute;
    top: 1%;
    left: 1%;
    z-index: 2;
  }
}
// .preview-image-dialog-close-btn {
//   // position: absolute;
//   // right: 2%;
//   // top: -5%;
// }

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
// }</style>
