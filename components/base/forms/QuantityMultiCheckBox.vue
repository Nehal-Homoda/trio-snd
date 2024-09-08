<script setup lang="ts">
import type { OrderOptionValue } from '~/interfaces/user/orders/orderOptions.interface';

const props = defineProps([
    "label",
    "items",
    "modelValue",
    "required",
    "placeholder",
    "required",
    "isMultiple",
    "disabled",
    "orderOptionValue",
]);
interface SelectedItem {
    id: number,
    quantity: number
    name: string
}
const isDataSet = ref(false);
const selectedItems = ref<SelectedItem[]>([])

const emit = defineEmits(["update:modelValue"]);
const selectedIds = computed(() => {

    const ar = selectedItems.value.map(item => item.id)

    return [...ar]
})
const fireEmit = () => {
    emit('update:modelValue', selectedItems.value)
}

const selectItemHandler = (item: OrderOptionValue) => {
    console.log(item)
    let selectedItemIndex;

    const newSelectedItems = selectedItems.value.filter((itemValue, index) => {
        if (itemValue.id == item.id) {

            selectedItemIndex = index;
            return item
        }
    })

    if (!!newSelectedItems.length) {
        if (selectedItemIndex != undefined) {

            selectedItems.value.splice(selectedItemIndex, 1)
        }
        fireEmit()
        return;
    }

    selectedItems.value.push({
        id: item.id,
        quantity: 1,
        name: item.name
    })
    fireEmit()

}
watch(props, (newValue) => {
  if (props.modelValue && !isDataSet.value) {
    isDataSet.value = true;
    selectedItems.value = [...props.modelValue];
  }
});
//@ts-ignore
const receiveQuantity = ({ quantity, selectItemId }) => {
    console.log(quantity)
    console.log(selectItemId)
    selectedItems.value.forEach((item, index) => {
        if (item.id == selectItemId) {
            selectedItems.value[index].quantity = quantity
        }
    })
    fireEmit()
}
const selectedQuantity = (id: number) => {
    let quantity = 0;
    selectedItems.value.forEach((item) => {
        if (item.id == id) {
            quantity = item.quantity;
        }
    })

    return quantity ? quantity : undefined;
}
</script>
<template>
    <label class="text-h6 font-weight-medium">{{ props.label }}
        <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label>

    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props, isActive }">
            <button :disabled="disabled" type="button" v-bind="props"
                class="input-field mt-1 bg-surface rounded-lg d-flex align-center justify-space-between pa-4 ">
                <!-- DISPLAY NAME -->
                <p v-if="selectedItems.length" class="display-name  font-weight-semibold font-size-regular">
                    <template v-for="(item, index) in selectedItems">

                        <span>{{ item.name }}{{ item.quantity }}</span>
                        <span v-if="index < (selectedItems.length - 1)">, </span>
                    </template>
                </p>
                <!-- DISPLAY PLACEHOLDER -->
                <p v-else class="placeholder text-grey-lighten-1 font-weight-semibold font-size-regular">{{ placeholder
                    }}</p>
                <v-icon :class="isActive ? 'rotate' : ''" class="input-icon"
                    color="grey-darken-1">mdi-chevron-down</v-icon>
            </button>
        </template>

        <div
            class="items-bg d-flex flex-column justify-center align-center elevation-5 bg-surface rounded-b pa-4 ga-3   ">
            <template v-for="item in props.items">
                <BaseQuantityNumber :quantity="selectedQuantity(item.id)" :selected="selectedIds.includes(item.id)"
                    @select="selectItemHandler(item)" @get-quantity="receiveQuantity" class="w-100 "
                    :selectItem="item" />
            </template>
        </div>
    </v-menu>
    <!-- <v-select
    v-model="checkValue"
    variant="solo-filled"
    multiple
    :items="items"
    item-title="name"
    item-value="id"
    :placeholder="props.placeholder"
    menu-icon="mdi-chevron-down"
    color="primary"
    :rules="requiredRule()"
    class="mt-1"
    :readonly="disabled"
  >
    <template #item="{ item }">
      <div class="d-flex justify-center align-center mb-5 ">
        <BaseQuantityNumber class="" @handleChange="receiveQuantity" :selectItem="item.title" />
      </div>
    </template>
  </v-select> -->
    <!-- <div v-for="item in props.items">

    <BaseQuantityNumber :selectItem="item.name" />
  </div> -->
</template>

<style scoped lang="scss">
.input-field {
    width: 100%;
    border: 1px solid rgba(var(--v-theme-primary));
    height: 56px;
    cursor: pointer;

    .input-icon {
        transition: all 150ms linear;

        &.rotate {
            transform: rotate(180deg);
        }
    }
}
</style>
