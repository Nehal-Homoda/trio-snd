<template>
    <div>
        <v-row>
            <v-col cols="12" sm="6">
                <AuthUploadPhotoCard :image="user?.verification_cards?.status == 'pending' || user?.verification_cards?.status == 'verified' ? user?.verification_cards?.card_id_front : undefined"
                    :disabled="user?.verification_cards?.status == 'pending' ||user?.verification_cards?.status == 'verified'" @sendFile="receiveFront"
                    :label="$t('enter_front_card')" />
            </v-col>
            <v-col cols="12" sm="6">
                <AuthUploadPhotoCard :image="user?.verification_cards?.status == 'pending' ||user?.verification_cards?.status == 'verified' ? user?.verification_cards?.card_id_back : undefined"
                    :disabled="user?.verification_cards?.status == 'pending' ||user?.verification_cards?.status == 'verified'" @sendFile="receiveBack"
                    :label="$t('enter_back_card')" />
            </v-col>
            <v-col cols="12" sm="6" class="mx-auto mt-5">
                <v-btn :loading="loading" :disabled="user?.verification_cards?.status == 'pending' ||user?.verification_cards?.status == 'verified'" rounded="lg"
                    @click="sendUserVerification" block color="primary" class=" text-white" height="50">
                    <span v-if="user?.verification_cards?.status == 'pending'">{{ $t('review') }}</span>
                    <span v-else-if="user?.verification_cards?.status == 'verified'">{{ $t('accept') }}</span>
                    <span v-else-if="user?.verification_cards?.status != null"> {{ $t('rejected_verfication') }} </span>
                    <span v-else>{{ $t('send') }}</span>
                </v-btn>

            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import type { User } from '~/interfaces/auth/auth.interface';
import type { ResponseWithValue } from '~/interfaces/response/response.interface';

const frontImg = ref<string | null>(null)
const backImg = ref<File | null>(null)
const { notify } = useNotification()
const loading = ref(false);


const authStore = useAuthStore();
const { profile } = useAuthStore();
const { user } = storeToRefs(authStore);

const receiveFront = (file: string) => {
    frontImg.value = file
}
const receiveBack = (file: File | null) => {
    backImg.value = file
}
const sendUserVerification = () => {
    if(!frontImg.value || !backImg.value) return 
    loading.value = true
    const fd = new FormData();
    if (frontImg.value) {
        fd.append('card_id_front', frontImg.value)
    }
    if (backImg.value) {
        fd.append('card_id_back', backImg.value)
    }

    useAppFetch<ResponseWithValue<User>>().eventUserVerificationAccount(fd).then((response) => {
        notify({
            type: 'success',
            title: response.meta.message
        })

        profile().then(() => {
            loading.value = false
        })

    })
    .catch((error)=>{
        SET_ERROR(error);
    })
    .finally(()=>{
        loading.value=false;
    })

}
</script>

<style scoped></style>