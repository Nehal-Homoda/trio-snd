<script setup>
const props = defineProps(["selectItem", 'selected', 'quantity']);
const emits = defineEmits(["getQuantity",'select']);
const quantity = ref(1);

const increment = () => {
  quantity.value++;
  emits("getQuantity", { quantity: quantity.value, selectItemId: props.selectItem.id });
};
const decrement = () => {
  if (quantity.value <= 1) return;
  quantity.value--;
  emits("getQuantity", { quantity: quantity.value, selectItemId: props.selectItem.id });
};
const selectHandler = () => {
  quantity.value = 1;
  emits("getQuantity", { quantity: quantity.value, selectItemId: props.selectItem.id });
  emits('select');
}
onMounted(() => {
  
  quantity.value = props.quantity ? props.quantity : 1
})

</script>



<template>
  <div class="wrap rounded-lg" :class="{'selected': selected}">
    <div class="plus-border" @click="increment">
      <v-icon color="primary" size="20">mdi-plus</v-icon>
    </div>
    <span :class="{'text-primary' : selected}" class=" w-100 text-center pointer" @click="selectHandler">{{ selectItem.name }} x{{ quantity }}</span>
    <div class="minus-border" @click="decrement">
      <v-icon color="primary" size="20">mdi-minus</v-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(var(--v-theme-primary));
  overflow: hidden;

  &.selected {
    background-color: rgba(var(--v-theme-primary),0.05);
  }

  .plus-border {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(196, 195, 195, 0.4);
    cursor: pointer;
  }

  .minus-border {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid rgba(196, 195, 195, 0.4);
    cursor: pointer;
  }
}
</style>
