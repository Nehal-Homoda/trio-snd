<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import moment from "moment";

const makeOrderStore = useMakeOrderStore();
const { invalidInputs, orderFormData } = storeToRefs(makeOrderStore);

const props = defineProps([
  "modelValue",
  "required",
  "label",
  "placeholder",
  "isMultiple",
  "items",
  "disabled",
  "orderOptionValue",
]);
const emit = defineEmits(["update:modelValue"]);

const date = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    const d = moment(value).format("L");
    if (d === "Invalid date") {
      emit("update:modelValue", '');
      date.value = "";
    } else {
      emit("update:modelValue", d);
    }
  },
});
const minDate = ref(new Date())

const format = (dateValue: Date) => {
  const d = moment(dateValue).format("L");

  return (date.value = d);
};
watch(orderFormData, (newValue) => {

  if (newValue.length) {
    let toDate;

    orderFormData.value.forEach(item => {
      if (item.type === 'date_from') {
        toDate = item.value
      }
    })

    if (props.orderOptionValue.type === 'date_to') {

      minDate.value = toDate ? new Date(toDate) : new Date()
    } else {

      minDate.value = new Date()
    }
  
  }


}, {deep: true})
</script>
<template>
  <label class="text-h6 font-weight-medium">{{ props.label }} <v-icon color="error" size="10"
      v-if="required">mdi-asterisk</v-icon></label>
  <vue-date-picker v-model="date" :dark="$vuetify.theme.name === 'dark' ? true : false" :format="format" :placeholder="props.placeholder" class="mt-1" :readonly="disabled"
    :enable-time-picker="false" :min-date="minDate">
    <template #input-icon>
      <v-icon size="25" color="primary">mdi-calendar-range</v-icon>
    </template>
  </vue-date-picker>
  <div class="error-msg">
    <p class="msg" v-if="invalidInputs.includes(orderOptionValue.id) && !date">
      {{ $t('required') }}
    </p>
  </div>
</template>

<style lang="scss">
.dp__main {
  width: 100%;
  background-color: #f6f6f6;
  // &.grayTime {
  //   filter: opacity(40%);
  // }
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
