<script setup lang="ts">
import { icons } from '~/core/manager/AssetsManager';
import RoutesManager from '~/core/manager/RoutesManager';
import type { Country } from '~/interfaces/shared/shared.interface';
import type { AuthResponse } from '~/interfaces/auth/auth.interface';
import * as jose from 'jose'
import type { UserInfo } from 'firebase/auth';


const router = useRouter();
const localePath = useLocalePath();
const { login, loginWithSocial } = useAuthStore();
const authStore = useAuthStore();
const {init} = useNotificationsStore()

//  const formData = ref('');
const showPassword = ref(false);
const formRef = ref(null);
const formData = ref({
    phone_number: '',
    password: '',
    country_code: '',
    device_token: '',
    device_version: 12,
});
const {t} = useI18n();
const loading = ref(false);
const validationRules = {
    required: (v: any) => !!v || 'Field is required',
    min: (v: any) => v.length >= 4 || t('at_least_four_char'),
}

const handleCountry = (country: Country) => {
    formData.value.country_code = country.country_code;
}

const onSubmit = async () => {

    if (!formRef.value) return;
    //@ts-ignore
    const { valid } = await formRef.value.validate();

    if (!valid) return;
    
    loading.value = true;

    const deviceToken = await getDeviceToken();
    
    const fd = new FormData();

    for (const name in formData.value) {

        if (name === 'device_token') {

            fd.append(name, deviceToken)
        } else {

            //@ts-ignore
            fd.append(name, formData.value[name].toString())
        } 
        

    }



    login(fd)
        .then(() => {

            if (authStore.isLoggedIn) {
                router.push(localePath(RoutesManager.home))
            }
        })
        .finally(() => {

            loading.value = false;
        })

}



const googleSocialSubmit = async (payload: UserInfo) => {
    
    loading.value = true;
    const deviceToken = await getDeviceToken()
    const fd = new FormData();

    fd.append('name', payload.displayName?.toString() || '')
    fd.append('email', payload.email?.toString()|| '')
    fd.append('avatar_path', payload.photoURL?.toString() || '')
    fd.append('social_id', payload.uid.toString() || '')
    fd.append('device_token', deviceToken.toString())
    fd.append('social_type', 'google')


    loginWithSocial(fd)
        .then(() => {
            
            if (authStore.isLoggedIn) {
                replaceTo(RoutesManager.home)
            }
        })
        .finally(() => {

            loading.value = false;
        })

}
const appleSocialSubmit = async (payload: UserInfo) => {

    const fd = new FormData();

    fd.append('name', payload.displayName?.toString() || '')
    fd.append('email', payload.email?.toString()|| '')
    fd.append('avatar_path', payload.photoURL?.toString() || '')
    fd.append('social_id', payload.uid.toString() || '')
    fd.append('device_token', formData.value.device_token.toString())
    fd.append('social_type', 'google')


    loading.value = true;
    loginWithSocial(fd)
        .then(() => {

            if (authStore.isLoggedIn) {
                router.push(localePath(RoutesManager.home))
            }
        })
        .finally(() => {

            loading.value = false;
        })

}

const loginWithGooglePopup = async () => {

    await googleLoginPopup()
        .then(async response => {
            const credential = googleCredentialResult(response)
            const token = credential?.accessToken;
            const [user] = response.user.providerData;
            

            googleSocialSubmit(user)

        })
        .catch(error => {
            console.log('google login popup error ', error.code);
        })
}
const loginWithApplePopup = async () => {

    await appleLoginPopup()
        .then(async response => {
            console.log(response)
            const credential = appleCredentialResult(response)
            const token = credential?.accessToken;
            const [user] = response.user.providerData;
            

            // googleSocialSubmit(user)

            console.log(token)
            console.log(user)
        })
        .catch(error => {
            console.log('google login popup error ', error.code);
        })
}


onMounted(() => {

})

</script>




<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">

        <p v-if="authStore.authError && !authStore.authError.success"
            class="text-body-2 font-weight-bold text-error mb-2"> {{ authStore.authError.error.message }} </p>

        <label for="phone-number" class="font-weight-medium">{{ $t('phone_number') }}</label>
        <BaseFormsPhoneField @country-changed="handleCountry" id="phone-number" :placeholder="$t('phone_number')"
            v-model="formData.phone_number"/>


        <label for="password" class="font-weight-medium">{{ $t('password') }}</label>
        <v-text-field :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" v-model="formData.password"
            @click:append-inner="showPassword = !showPassword" id="password" variant="solo-filled"
            :type="showPassword ? 'text' : 'password'" :rules="[(v: any) => !!v || $t('password_required'), validationRules.min]"
            :placeholder="$t('password')" class="mt-1"></v-text-field>


        <NuxtLink :to="localePath(RoutesManager.resetPassword)" class="text-primary">
           {{ $t('forget_password') }}
        </NuxtLink>

        <v-btn :disabled="loading" :loading="loading" color="primary" type="submit"
            class="text-white mb-5 mt-5  font-weight-bold" width="100%" height="50" rounded="lg">{{ $t('login_in') }}</v-btn>


        <p class="text-center text-primary mb-5">{{ $t('or_login_with') }}</p>

        <div class="d-flex align-start justify-center ga-5 mb-8">
            <v-avatar class="pointer" @click="loginWithGooglePopup" id="google-login-btn" size="30" :image="icons.icon_8"></v-avatar>
            <!-- <v-avatar size="25" @click="loginWithApplePopup" :image="icons.icon_9"></v-avatar> -->
        </div>
        <NuxtLink :to="localePath(RoutesManager.register)"
            class="text-brand-color-text-default font-weight-medium d-flex justify-center text-decoration-underline">
            {{ $t('create_your_account') }}</NuxtLink>
    </v-form>
</template>

<style lang="scss" scoped></style>