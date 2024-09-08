<script setup lang="ts">
import RoutesManager from '~/core/manager/RoutesManager';
import type { ResponseData, ResponseWithValue } from '~/interfaces/response/response.interface';
import type { Ticket } from '~/interfaces/tickets/tickets.interface';
import type { Parent, UserServicesList } from '~/interfaces/user/services-list/servicesList.interface';

const {user} = useAuthStore();
const {t} = useI18n();

const listItem = [
    { name: t('support'), type: 'technical_support' },
    { name: t('customer_service'), type: 'customer_service' },
    { name: t('complaints') ,type: 'complaints' }
]
const formRef = ref(null);
const formData = ref({
    type: null,
    service_id: null,
    phone_number: user?.phone_number,
    title: null,
    body: null,
})


// const formData={

// }
const localPath = useLocalePath();
const mainService = ref<Parent[]>([])
const loading=ref(false);
const fetchServices = () => {
    useAppFetch<ResponseData<UserServicesList>>().eventGetUserServices().then((response) => {
        response.data.forEach((childItem) => {
            
            const arr = mainService.value.filter((item) => item.id == childItem.parent.id)
            if (!arr.length) {
                mainService.value.push(childItem.parent)
            }
        })
    })
}

 

const validationRules = {
    required: (v: any) => !!v || 'required'

}
const sendComplaints = async () => {
    if (!formRef.value) return
    // @ts-ignore
    const { valid } = await formRef.value.validate()
    if (!valid) return
    const fd = new FormData();
    
    for (const i in formData.value ) {
        //@ts-ignore
        fd.append(i,formData.value[i])
    }
    
    loading.value=true
    
    useAppFetch<ResponseWithValue<Ticket>>().eventAddComplaints(fd)
    .then((response)=>{
        // console.log(response)
        notifyAlert('success', response.meta.message)
        replaceTo(RoutesManager.tickets)
        formData.value.body=null
        formData.value.phone_number=null
        formData.value.service_id=null
        formData.value.title=null
        formData.value.type=null
    })
    .catch((error) => {
        SET_ERROR(error)
    })
    .finally(()=>{
        loading.value=false

    })



}

onMounted(() => {
    fetchServices()
})


definePageMeta({middleware:'auth'})

</script>

<template>
    <v-sheet color="transparent" width="100%" min-height="100vh" class="py-16">
        <v-container>
         
            <div class="routes font-weight-bold mt-5 mb-15 d-flex align-center ga-1">
                <NuxtLink class="text-brand-color-text-default" :to="localPath(RoutesManager.tickets)">
                     {{ $t('support') }}
                </NuxtLink>
                <v-icon :icon="$vuetify.locale.isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"></v-icon>
                <p class="text-primary">{{ $t('add_support') }}</p>
            </div>
            <v-form ref="formRef" @submit.prevent="sendComplaints">
                <v-row>
                    <v-col cols="12" sm="6">
                        <label for=""> {{ $t('choose_section') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>

                        <v-select v-model="formData.type
                            " :rules=[validationRules.required] menu-icon="mdi-chevron-down" class="mt-1"
                            variant="solo-filled" :placeholder="$t('support')" :items="listItem" item-title="name"
                            item-value="type">

                        </v-select>

                    </v-col>
                    <v-col cols="12" sm="6">
                        <label for="">{{ $t('choose_service') }}<v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                        <v-select :rules=[validationRules.required] v-model="formData.service_id" :items="mainService" item-title="name"
                            item-value="id" menu-icon="mdi-chevron-down" class="mt-2" variant="solo-filled"
                            :placeholder="$t('support')">

                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <label for="">{{ $t('phone_number') }}</label>
                        <v-text-field v-model="formData.phone_number" :rules=[validationRules.required] class="mt-2"
                            type="number" variant="solo-filled" :placeholder="$t('phone_number')" disabled>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <label for="">{{ $t('subject') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>

                        <v-text-field v-model="formData.title" :rules=[validationRules.required] class="mt-2"
                            type="text" variant="solo-filled" :placeholder="$t('subject')">
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <label for="">{{ $t('desc') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                        <v-textarea v-model="formData.body" :rules=[validationRules.required] class="mt-2"
                            type="text" variant="solo-filled" :placeholder="$t('desc_subject')">
                        </v-textarea>
                    </v-col>


                    <v-col cols="12" md="6" class="mx-auto">
                        <v-btn :loading="loading" :disabled="loading" type="submit" height="50" rounded="lg" color="primary" block class="text-white">{{ $t('send') }}</v-btn>
                    </v-col>

                </v-row>
            </v-form>
        </v-container>
    </v-sheet>

</template>



<style scoped></style>