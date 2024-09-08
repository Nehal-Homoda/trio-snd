<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import moment from "moment";
const makeOrderStore = useMakeOrderStore();
const { invalidInputs, orderFormData } = storeToRefs(makeOrderStore)
import { arEG, enUS } from 'date-fns/locale';
const { locale } = useI18n();
const props = defineProps([
  "modelValue",
  "required",
  "label",
  "placeholder",
  "isMultiple",
  "items",
  'disabled',
  'orderOptionValue'
]);
const emit = defineEmits(["update:modelValue"]);


const date = computed({
  get() {

    if (props.modelValue) {
      const hours = props.modelValue.split(':')[0]
      const minutes = props.modelValue.split(':')[1]

      return {
        hours: hours,
        minutes: minutes,
      }
    }

    return null;
  },
  set(value: any) {
    const formated = `${value.hours}:${value.minutes}`

    emit("update:modelValue", formated);
  },
});

const timePickerLocales = computed(() => {

  if (locale.value == 'en') return enUS;
  if (locale.value == 'ar') return arEG;

  return enUS;
})
const minTime = computed(() => {

  let shouldHasMin = false;
  let selectedDate = '';
  const currentDate = moment().format("L");
  const currentTime = moment().format("HH:mm");

  for (const [index, item] of orderFormData.value.entries()) {

    if (item.type === 'date' || item.type === 'date_from') {
  
      shouldHasMin = true;
      selectedDate = item.value;
      break;
    }
  }


  if (shouldHasMin && (selectedDate == currentDate)) {
    return currentTime
  }


  return '';
})

</script>
<template>
  <label class="text-h6 font-weight-medium">{{ props.label }} <v-icon color="error" size="10"
      v-if="required">mdi-asterisk</v-icon></label>
  <vue-date-picker :dark="$vuetify.theme.name === 'dark' ? true : false" v-model="date" time-picker :min-time="minTime" :is-24="false" :format-locale="timePickerLocales"
    format="h:mm a" :placeholder="props.placeholder" class="mt-1" :disabled='disabled'>
    <template #input-icon>
      <v-icon size="25" color="primary">mdi-clock-outline</v-icon>
    </template>
  </vue-date-picker>
  <div class="error-msg">
    <p class="msg" v-if="invalidInputs.includes(orderOptionValue.id)">
      {{ $t('required') }}
    </p>
  </div>
</template>

<style lang="scss">
.dp__main {
  width: 100%;
  background-color: #f6f6f6;

  &.grayTime {
    filter: opacity(40%);
  }
}

.dp__input_icon {
  left: 12px;
}

.dp__clear_icon {
  display: none;
}

.dp__input {
  height: 56px;
  border: none;
  outline: none;
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
  background: transparent;
  border-radius: 8px;
  color: #6a6a6a;
}

.dp__input_icon_pad {
  padding-inline-start: 50px;
}

.v-locale--is-rtl {
  .dp__input_icon {
    left: unset;
    right: 12px;
  }
}

.error-msg {
  padding-inline: 16px;
  align-items: flex-end;
  display: flex;
  font-size: 0.75rem;
  font-weight: 400;
  grid-area: messages;
  letter-spacing: 0.0333333333em;
  line-height: normal;
  min-height: 22px;
  padding-top: 6px;
  overflow: hidden;
  justify-content: space-between;

  .msg {
    line-height: 12px;
    word-break: break-word;
    word-wrap: break-word;
    hyphens: auto;
    transition-duration: 150ms;
    color: rgb(var(--v-theme-error));
  }
}
</style>
