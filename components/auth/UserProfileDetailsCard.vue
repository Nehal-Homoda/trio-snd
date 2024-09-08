<template>
    <client-only>
        <v-card color="surface" class="pa-7 mt-5" rounded="xl" elevation="0">
            <!-- <h4 class="text-primary text-h5 font-weight-bold mb-8 ">About</h4> -->
    
    
            <div class="d-flex flex-column ga-7">
                <!-- EMAIL -->
                <div class="d-flex align-start ga-2">
                    <div class="title-wrap d-flex ga-2 align-center">
                        <v-icon color="primary" icon="mdi-email"></v-icon>
                        <span class="font-weight-bold text-body-2">{{ $t("email") }}:</span>
                    </div>
                    <span class="value-wrap text-dark-grey">{{ user?.email }}</span>
                </div>
                <!-- PHONE -->
                <div class="d-flex align-start ga-3">
                    <div class="title-wrap d-flex ga-2 align-center">
                        <v-icon color="primary" icon="mdi-phone"></v-icon>
                        <span class="font-weight-bold text-body-2">{{ $t("phone_number") }}:</span>
                    </div>
                    <span class="value-wrap text-dark-grey">{{ user?.phone_number }}</span>
                </div>
                <!-- COUNTRY -->
                <div class="d-flex align-start ga-3">
                    <div class="title-wrap d-flex ga-2 align-center">
                        <v-icon color="primary" icon="mdi-web"></v-icon>
                        <span class="font-weight-bold text-body-2">{{ $t("country") }}:</span>
                    </div>
                    <span class="value-wrap text-dark-grey">{{ user?.country_code }}</span>
                </div>
                <!-- CITY -->
                <div class="d-flex align-start ga-3">
                    <div class="title-wrap d-flex ga-2 align-center">
                        <v-icon color="primary"  icon="mdi-city-variant-outline"></v-icon>
                        <span class="font-weight-bold text-body-2">{{ $t("city") }}:</span>
                    </div>
                    <span class="value-wrap text-dark-grey">{{ user?.city?.name }}</span>
                </div>
    
            </div>
            
        </v-card>
    </client-only>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<style scoped>
.title-wrap {
  width: 150px;
  flex-grow: 0;
  flex-shrink: 0;
}
.value-wrap {
  word-break: break-all;
}
</style>
