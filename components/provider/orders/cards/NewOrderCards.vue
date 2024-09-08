<script setup>
import { heros } from "~/core/manager/AssetsManager";
const newOrderList=ref({
  1:{title:'رقم الطلب :'},
  2:{title:'تاريخ الطلب:'},
  3:{title:'من موقع:'},
  4:{title:'رقم الطلب :'},
  5:{title:'رقم الطلب :'},
})
</script>


<template>
  <v-sheet color="transparent" class="py-16">
    <v-container>
      <v-card
        class="pa-8 mb-5"
        variant="outlined"
        color="primary"
        rounded="lg"
        v-for="(item, index) in 5"
        :key="index"
      >
       
         
       
        <div class="d-flex ga-8 align-center">
          <div>
            <v-img width="100" height="100" :src="heros.hero_1"></v-img>
          </div>
          <div class="d-flex flex-column ga-5">
            <h3 class="">جامبو</h3>
            <!-- NUMBER -->
            <div class="d-flex">

              <div class="title-wrap">
                <h4 class="text-brand-color-text-default">رقم الطلب:</h4>
              </div>
              <p class="font-size-regular text-brand-color-text-muted">ryry</p>
            </div>
            <!-- DATE -->
            <div class="d-flex">
              <div class="title-wrap">
                <h4 class="text-brand-color-text-default">تاريخ الطلب:</h4>
              </div>
              <p class="font-size-regular text-blue-grey-darken-3">ryry</p>
            </div>
            <!-- FROM -->
            <div class="d-flex">
              <div class="title-wrap">
                <h4 class="text-brand-color-text-default">من موقع:</h4>
              </div>
              <p class="font-size-regular text-blue-grey-darken-3">الغربيه طنطا سبرباي</p>
            </div>
            <!-- TO -->
            <div class="d-flex">
              <div class="title-wrap">
                <h4 class="text-brand-color-text-default">الي موقع:</h4>
              </div>
              <p class="font-size-regular text-blue-grey-darken-3">الغربيه طنطا سبرباي</p>
            </div>
          </div>
        </div>
      </v-card>
    </v-container>
  </v-sheet>
</template>


<style scoped>
.title-wrap {
  width: 100px;
}
</style>