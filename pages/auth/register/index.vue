<script setup lang="ts">



definePageMeta({
    layout: "auth-blank"
})


</script>


<template>
    <v-sheet color="transparent" width="100%" min-height="100vh" class="pt-15">

        <v-container>
            <v-row>
                <v-col cols="12" md="10" class="mx-auto">
                    <AuthFormCard :title="$t('welcom_snd')">
                        <AuthUserRegisterForm />
                    </AuthFormCard>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>



<style lang="scss" scoped></style>