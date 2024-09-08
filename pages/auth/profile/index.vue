<script setup lang="ts">
import { brand } from '~/core/manager/AssetsManager';
import RoutesManager from '~/core/manager/RoutesManager';

const {t}=useI18n();
const profileLinks = {
    1: { name: t('my_data'), type: 'data' },
    2: { name: t('edit'), type: 'edit' },
    3: { name: t('change_password'), type: 'change-password' },
    4: { name: t('account_verification'), type: 'account-verification' },
}

const LocalePath = useLocalePath();
const selectedType = ref('data');
const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
const route = useRoute();
const router = useRouter()
const localePath = useLocalePath();


const handleChangeType = (type: string) => {
    selectedType.value = type;
    router.push({
        path: localePath(RoutesManager.profile),
        query: { type },
    });
    scrollToTab()
}
const scrollToTab = () => {
    const tab = document.querySelector(`#profile-tab-${selectedType.value}`);
    const tabsWrap = document.querySelector(`.tabs-wrap`);
    //@ts-ignore
    tabsWrap.scrollTo({
        //@ts-ignore
        left: tabsWrap.scrollLeft + (tab.offsetLeft - tabsWrap?.offsetLeft),
        behavior: 'smooth'
    })
}





definePageMeta({ middleware: 'auth' })
onMounted(() => {

    selectedType.value = route.query.type ? route.query.type.toString() : 'data'
    scrollToTab()
})

</script>

<template>
    <v-sheet color="transparent" class="py-16">

        <v-container>
            <div class="d-flex ga-5 ga-sm-7 ga-md-10 pt-16 text-brand-color-text-default overflow-auto pb-3 tabs-wrap">
                <span @click="handleChangeType(item.type)" :id="`profile-tab-${item.type}`"
                    :class="{ 'text-primary': item.type == selectedType }"  v-for="(item, index) in profileLinks"
                    :key="index" class="cursor-pointer font-size-medium font-weight-bold profile-tab-item   ">
                    {{ item.name }}
                </span>

                <NuxtLink class="cursor-pointer  profile-tab-item  font-size-medium font-weight-bold text-brand-color-text-default "
                    :to="LocalePath(RoutesManager.addcity)">
                    {{ $t('add_address') }} 
                </NuxtLink>

                <NuxtLink class="cursor-pointer  profile-tab-item  font-size-medium  font-weight-bold text-brand-color-text-default "
                    :to="LocalePath(RoutesManager.orders)">
                    {{ $t('my_orders') }} 
                </NuxtLink>




            </div>

            <div v-if="selectedType != 'edit'" class="py-10 d-flex ga-6 align-center font-weight-medium text-h6">
                <div class="user-profile">
                    <v-avatar class=" d-flex align-end" size="80">

                        <v-img :lazy-src="brand.avatar" :src="user?.avatar_path || ''">
                        </v-img>
                    </v-avatar>
                </div>
                <span>{{ user?.name }}</span>
            </div>

            <AuthUserProfileDetailsCard v-if="selectedType == 'data'" />
            <AuthUserEditProfileCard v-if="selectedType == 'edit'" />
            <AuthUserProfileChangePassword v-if="selectedType == 'change-password'" />
            <AuthUserVerificationAccount v-if="selectedType == 'account-verification'" />

        </v-container>

    </v-sheet>
</template>

<style lang="scss" scoped>
.profile-tab-item {
    font-size: 14px;
    text-wrap: nowrap;


    @include media-breakpoint-up(sm) {
        font-size: 16px;
    }

    @include media-breakpoint-up(md) {
        font-size: 18px;
    }

    @include media-breakpoint-up(lg) {
        font-size: 18px;
    }

    @include media-breakpoint-up(xl) {
        font-size: 18px;
    }
}
</style>