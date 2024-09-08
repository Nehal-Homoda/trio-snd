<script setup lang="ts">
import RoutesManager from "~/core/manager/RoutesManager";
import { bg } from "~/core/manager/AssetsManager";
import type {
  Parent,
  UserServicesListResponse,
} from "~/interfaces/user/services-list/servicesList.interface.ts";

const serviceList = ref<Parent[]>([]);
const localePath = useLocalePath();


const fetchUserServices = () => {
  useAppFetch<UserServicesListResponse>()
    .eventGetUserServices()
    .then((response) => {
      response.data.forEach((item) => {
        const ar = serviceList.value.filter(
          (storedItem) => storedItem.id == item.parent.id
        );

        if (!ar.length) {
          serviceList.value.push(item.parent);
        }
      });
    });
};
onMounted(() => {
  fetchUserServices();
});
</script>

<template>
  <v-sheet color="transparent" class="our-services-gallary py-16">
    <v-container>
      <h2 class="text-h3 text-lg-h2 text-center mb-16 font-weight-bold">
        {{ $t('our_services') }}
      </h2>

      <v-row v-if="serviceList.length >= 5">
        <v-col cols="12" sm="6">
          <div class="gallary-part-wrap">
            <div class="d-flex justify-space-between mb-7">
              <v-card
                class="pa-5 d-flex flex-column justify-end"
                theme="dark"
                rounded="lg"
                width="47.5%"
                :height="$vuetify.display.smAndUp ? '150px' : '125px'"
                :image="bg.bg_1"
              >
                <h6 class="text-h6 font-weight-medium truncate">
                  {{ serviceList[0].name }}
                </h6>
                <p class="text-subtitle truncate">{{ serviceList[0].description }}</p>
              </v-card>
              <v-card
                class="pa-5 d-flex flex-column justify-end"
                theme="dark"
                rounded="lg"
                width="47.5%"
                :height="$vuetify.display.smAndUp ? '150px' : '125px'"
                :image="bg.bg_2"
              >
                <h6 class="text-h6 font-weight-medium truncate">
                  {{ serviceList[1].name }}
                </h6>
                <p class="text-subtitle truncate">{{ serviceList[1].description }}</p>
              </v-card>
            </div>
            <v-card
              theme="dark"
              class="pa-5 d-flex flex-column justify-end ms-auto"
              rounded="lg"
              :width="$vuetify.display.smAndUp ? '65%' : '100%'"
              :height="$vuetify.display.smAndUp ? '400px' : '200px'"
              :image="bg.bg_3"
            >
              <h6 class="text-h6 font-weight-medium truncate">
                {{ serviceList[2].name }}
              </h6>
              <p class="text-subtitle truncate">{{ serviceList[2].description }}</p>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="h-100 gallary-part-wrap">
            <div class="h-100 d-flex flex-column justify-space-between">
              <v-card
                class="pa-5 d-flex flex-column justify-end mb-7"
                theme="dark"
                rounded="lg"
                width="100%"
                :height="$vuetify.display.smAndUp ? '55%' : '200px'"
                :image="bg.bg_5"
              >
                <h6 class="text-h6 font-weight-medium truncate">
                  {{ serviceList[3].name }}
                </h6>
                <p class="text-subtitle truncate">{{ serviceList[3].description }}</p>
              </v-card>
              <v-sheet
                color="transparent"
                height="40%"
                class="d-flex justify-space-between align-end"
              >
                <v-card
                  theme="dark"
                  class="pa-5 d-flex flex-column justify-end"
                  rounded="lg"
                  width="65%"
                  :height="$vuetify.display.smAndUp ? '100%' : '200px'"
                  :image="bg.bg_7"
                >
                  <h6 class="text-h6 font-weight-medium truncate">
                    {{ serviceList[4].name }}
                  </h6>
                  <p class="text-subtitle truncate">{{ serviceList[4].description }}</p>
                </v-card>
                <div
                  class="d-flex flex-column align-center pb-3 pb-sm-5 pe-3 pe-sm-5"
                >
                  <v-btn
                    class="gradient-bg"
                    rounded="lg"
                    size="small"
                    :to="localePath(RoutesManager.categories)"
                    :icon="
                      $vuetify.locale.isRtl
                        ? 'mdi-arrow-left'
                        : 'mdi-arrow-right'
                    "
                  ></v-btn>
                  <NuxtLink
                    class="mt-3 text-center font-weight-bold text-decoration-none text-brand-color-text-default"
                    :to="localePath(RoutesManager.categories)"
                    >{{ $t('explore_now') }}</NuxtLink
                  >
                </div>
              </v-sheet>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
