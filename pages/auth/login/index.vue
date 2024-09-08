<script setup lang="ts">


const {t}= useI18n();
definePageMeta({
    layout: "auth-blank"
})
const cardName=ref(t('login_snd'))

</script>


<template>
    <v-sheet color="transparent" width="100%" min-height="100vh" class="pt-15">

        <v-container>
            <v-row>
                <v-col cols="12" md="6" class="mx-auto">
                    <AuthFormCard :title="cardName">
                        <AuthLoginForm />
                    </AuthFormCard>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>



<style lang="scss" scoped></style>