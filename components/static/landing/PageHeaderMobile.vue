<script setup lang="ts">
import { ref } from "vue";
// import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";
import { bg, brand } from "~/core/manager/AssetsManager";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import type { UserBannerResponse } from "~/interfaces/user/banners/banners.interface";

const modules = ref([Navigation, Pagination]);
const userBanners = ref<UserBannerResponse | null>(null);
const loading = ref(true);

const fetchUserBanner = () => {
  loading.value = true;
  useAppFetch<UserBannerResponse>()
    .eventGetUserBanners()
    .then((response) => {
      userBanners.value = response;
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  fetchUserBanner();
});
</script>

<template>
  <v-sheet
    class="main-header d-block d-md-none"
    theme="dark"
    color="transparent"
  >
    <div class="swiper-wrap-container-mobile">
      <Swiper
        :slides-per-view="1.25"
        :modules="modules"
        :pagination="true"
        :loop="false"
        :centered-slides="true"
        :initial-slide="1"
        :space-between="18"
        class="pb-10 pt-5"
      >
        <!-- <template v-if="!userBanners || (userBanners && !userBanners.data.length)">
          <SwiperSlide v-for="index in 3">
            <v-card elevation="0" width="100%" height="125px" variant="outlined" color="primary" class="rounded-regular pt-16 d-flex flex-column justify-center">
            </v-card>
          </SwiperSlide>
        </template> -->
        <template v-if="userBanners">
          <SwiperSlide
            v-for="(userBanner, index) in userBanners.data"
            :key="index"
          >
            <v-card
              :href="userBanner.action_path"
              v-if="userBanner.action_path && userBanner.action === 'url'"
              color="transparent"
              elevation="0"
              width="100%"
              height="125px"
              class="rounded-regular elevation-light pt-16 d-flex flex-column justify-center"
            >
              <template v-slot:image>
                <v-img
                  :src="userBanner.image_path"
                  position="center"
                  cover
                ></v-img>
              </template>
            </v-card>
          </SwiperSlide>
        </template>

        <template v-if="loading">
          <SwiperSlide v-for="index in 3">
            <v-skeleton-loader
              type="image"
              elevation="0"
              width="100%"
              height="125px"
              class="rounded-regular elevation-light pt-16 d-flex flex-column justify-center mx-auto"
              color="#eee"
            ></v-skeleton-loader>
          </SwiperSlide>
        </template>
      </Swiper>
    </div>
  </v-sheet>
</template>

<style scoped lang="scss">
.swiper-wrap-container-mobile {
  width: 100%;

  img {
    width: 100%;
  }

  ::v-deep .swiper-button-next:after,
  ::v-deep .swiper-button-prev:after {
    content: "";
  }

  ::v-deep .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    transition: all 150ms ease-in-out;
    background: rgb(var(--v-theme-primary));
  }

  ::v-deep .swiper-pagination-bullet-active {
    background: rgb(var(--v-theme-primary));
    width: 20px;
    height: 10px;
    border-radius: 2em;
  }

  ::v-deep .swiper-slide {
    transition: all 300ms ease-in-out;
  }

  ::v-deep .swiper-slide-prev,
  ::v-deep .swiper-slide-next {
    transform: scaleY(0.9) !important;
    /* Scale down to 90% */
  }
}
</style>
