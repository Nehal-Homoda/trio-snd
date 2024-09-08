<script setup>
import RoutesManager from "~/core/manager/RoutesManager";
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();

defineProps(['title'])


const backHandler = () => {

    router.back()
    // if (route.path === localePath(RoutesManager.register)) {
    //     replaceTo(RoutesManager.login)
    // } else {

    // }
}


</script>



<template>
    <v-card class="py-12 px-md-16 px-10" rounded="xl" >
        <div class="d-flex flex-column  ga-5">
            <div @click="backHandler" class="text-primary pointer px-0 font-weight-bold"
                :ripple="false">
                <v-icon color="primary" :icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'" class="mr-2"></v-icon>
                    {{ $t('back') }}
            </div>
            <h2 class="text-primary text-h4 mb-5 font-weight-black"> {{ title }} </h2>
        </div>

        <slot />
    </v-card>
</template>



<style lang="scss" scoped></style>