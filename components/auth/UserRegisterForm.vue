<script setup lang="ts">
import RoutesManager from '~/core/manager/RoutesManager';
import type { ResponseData } from '~/interfaces/response/response.interface';
import type { Country } from '~/interfaces/shared/shared.interface';


const { register } = useAuthStore();
const authStore = useAuthStore();
const localePath = useLocalePath();


const showPassword = ref(false);
const showConfirmPassword = ref(false);
const termsCheck = ref(false);
const tipsCheck = ref(false);


const countries = ref<Country[]>([]);
const formRef = ref(null);
const formData = ref({
    name: null,
    phone_number: null,
    email: null,
    password: null,
    country_code: null,
    city_id: null,
    device_token: '',
    device_version: 12,
    current_user_lat: '0',
    current_user_lng: '0',
})
const confirmPassword = ref(null);
const selectedCountry = ref<Country | null>(null);
const loading = ref(false);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const {t} = useI18n();

const fetchContries = () => {

    useAppFetch<ResponseData<Country>>().eventGetCountries()
        .then(response => {
            countries.value = response.data;
        })
}
const validationRules = {
    required: (v: any) => !!v || 'Field is required',
    min: (v: any) => v.length >= 4 || t('at_least_four_char'),
    email: (v: any) => v.match(emailRegex) || "invalid email" ,
    name:(v:any) => v.length >=2 || t('name_condition')
}

const countryChanged = (value: string | null) => {

    formData.value.city_id = null;
    const ar = countries.value.filter(item => item.country_code == formData.value.country_code);

    if (!!ar.length) {

        selectedCountry.value = ar[0];
    }
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


    register(fd)
        .then(() => {

            if (authStore.isLoggedIn) {
                replaceTo(RoutesManager.home)
            }
            loading.value = false;
        })

}

const getLocation = () => {


    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {
            // console.log('lat', position.coords.latitude)
            // console.log('lng', position.coords.longitude)

            formData.value.current_user_lat = position.coords.latitude.toString();
            formData.value.current_user_lng = position.coords.longitude.toString();
        });

    } else {
        // Geolocation is not supported by this browser.
    }
}

onMounted(() => {
    fetchContries();
    getLocation()
})

</script>

<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">
        <h6 class="text-h6 font-weight-bold mt-2 mb-3">{{ $t('finish_sign_up') }}</h6>

        <p v-if="authStore.authError && !authStore.authError.success"
            class="text-body-2 font-weight-bold text-error mb-2"> {{ authStore.authError.error.message }} </p>

        <v-row>

            <!-- NAME -->
            <v-col cols="12" md="6">
                <label for="first-name" class="font-weight-medium">{{ $t('name') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                <v-text-field id="first-name" v-model="formData.name" autocomplete="off" variant="solo-filled" type="text"
                    :rules="[(v: any) => !!v || $t('required_name') , validationRules.name]" :placeholder="$t('name')" class="mt-1"></v-text-field>
            </v-col>

            <!-- EMAIL -->
            <v-col cols="12" md="6">
                <label for="email" class="font-weight-medium">{{ $t('email') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                <v-text-field style="display:none;" autocomplete="new-email" name="dummy-email"></v-text-field>
                <v-text-field id="email" v-model="formData.email" autocomplete="off" variant="solo-filled" type="email"
                    :rules="[(v: any) => !!v || $t('email_required'), validationRules.email]" :placeholder="$t('email')" class="mt-1"></v-text-field>

            </v-col>

            <!-- COUNTRY -->
            <v-col cols="12" md="4">
                <label for="country" class="font-weight-medium">{{ $t('country') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                <v-select autocomplete="off" v-model="formData.country_code" @update:model-value="countryChanged" :items="countries"
                    item-value="country_code" item-title="name" id="country" variant="solo-filled"
                    :rules="[(v: any) => !!v || $t('required_country')]" :placeholder="$t('select_country')"
                    class="mt-1"></v-select>
            </v-col>

            <!-- CITY -->
            <v-col cols="12" md="4">
                <label for="city" class="font-weight-medium">{{ $t('city') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                <v-select autocomplete="off" v-model="formData.city_id" :no-data-text="$t('select_country')"   :items="selectedCountry?.cities" item-value="id" item-title="name"
                    id="city" variant="solo-filled" :rules="[(v: any) => !!v || $t('select_city')]" :placeholder="$t('city')"
                    class="mt-1"></v-select>
            </v-col>

            <!-- PHONE NUMBER -->
            <v-col cols="12" md="4">
                <label for="phone_number" class="font-weight-medium">{{$t('phone_number') }}<v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                <BaseFormsPhoneField :country-no-change="true" :country="selectedCountry"
                    v-model="formData.phone_number" id="phone_number" variant="solo-filled"
                    :placeholder="$t('phone_number')" class="mt-1">
                </BaseFormsPhoneField>
            </v-col>

            <!-- PASSWORD -->
            <v-col cols="12" md="6">
                <label for="password" class="font-weight-medium">{{ $t('password') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                <v-text-field v-model="formData.password" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword" id="password" variant="solo-filled"
                    :type="showPassword ? 'text' : 'password'" :rules="[(v: any) => !!v || $t('password_required'), validationRules.min]"
                    :placeholder="$t('password') " class="mt-1"></v-text-field>
            </v-col>
            <!-- CONFIRM PASSWORD -->
            <v-col cols="12" md="6">
                <label for="confirm-password" class="font-weight-medium">{{ $t('confirm_password') }} <v-icon color="error" size="10">mdi-asterisk</v-icon></label>
                <v-text-field v-model="confirmPassword"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword" id="confirm-password"
                    variant="solo-filled" :type="showConfirmPassword ? 'text' : 'password'"
                    :rules="[(v: any) => !!v || $t('required_confirm_password'), v => v == formData.password || $t('password_match')]"
                    :placeholder="$t('confirm_password') " class="mt-1"></v-text-field>
            </v-col>
            <v-col cols="12">
                <div class="d-flex flex-column no-details text-primary">
                    <!-- CHECK TERMS -->
                    <v-checkbox density="compact" :hide-details="true" v-model="termsCheck" color="primary"
                        :rules="[v => !!v || '']" :label="$t('agree_conditions_1')" required></v-checkbox>
                    <!-- CHECK TIPS -->
                    <v-checkbox density="compact" :hide-details="true" v-model="tipsCheck" color="primary"
                        :rules="[v => !!v || '']" :label="$t('agree_condition_2')"
                        required></v-checkbox>
                </div>
            </v-col>
            <!-- SUBMIT BTN -->
            <v-col cols="12" md="7" class="mx-auto mt-5">
                <v-btn :disabled="loading" :loading="loading" color="primary" type="submit" height="50" rounded="lg"
                    class="text-white" block>
                    {{ $t('agree_continue') }}
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>



<style scoped></style>