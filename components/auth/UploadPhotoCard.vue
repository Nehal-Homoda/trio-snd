<template>
    <div>
        <p class="font-weight-bold  mb-1 ">{{ label }}</p>
        <v-card class="mb-5 d-flex align-center justify-center position-relative" variant="outlined" height="200"
            color="primary" rounded="lg">
            <v-icon v-if="showIcon" class="" size="40"  color="grey">mdi-card-account-details</v-icon>
            <img v-if="imageUrl" class="identity-image" width="100" height="100" :src=imageUrl alt="">
            <input :disabled="props.disabled" class="file" type="file" accept="image/png, image/jpeg, image/jpg" name="" id="" @change="handleFileUpload" >
        </v-card>
    </div>
</template>

<script setup lang="ts">

const props  = defineProps(['label','image','disabled'])
const emit = defineEmits(['sendFile'])
const imageUrl=ref('') 
const showIcon=ref(true);
const file=ref<File | null> (null)




const handleFileUpload=(event:Event)=>{
    const target = event.target as HTMLInputElement;
  file.value= (target.files && target.files[0]) || null;

  if (file.value) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        imageUrl.value = e.target.result as string;
        showIcon.value=false 
      }
    };
    reader.readAsDataURL(file.value);
    emit('sendFile',file.value)
  }

}


onMounted(()=>{
  imageUrl.value=props.image
})

</script>

<style scoped lang="scss">
.file {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;

}
.identity-image{
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>