<script setup lang="ts">
import { ref } from "vue";
// import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";
import { bg } from "~/core/manager/AssetsManager";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import type { UserBannerResponse } from "~/interfaces/user/banners/banners.interface";

const modules = ref([Navigation, Pagination]);
const userBanners = ref<UserBannerResponse | null>(null);

const fetchUserBanner = () => {
  useAppFetch<UserBannerResponse>()
    .eventGetUserBanners()
    .then((response) => {
      userBanners.value = response;
    });
};
onMounted(() => {
  fetchUserBanner();
});
</script>

<template>
  <v-sheet class="main-header d-none d-md-block" theme="dark" color="transparent">
    <div class="swiper-wrap-container">
      <Swiper
        :slides-per-view="1"
        :modules="modules"
        navigation
        :pagination="true"
        :loop="true"
      >
        <SwiperSlide
          v-if="!userBanners || (userBanners && !userBanners.data.length)"
        >
          <v-card
            width="100%"
            min-height="25vh"
            class="pt-16 d-flex flex-column justify-center"
          >
          </v-card>
        </SwiperSlide>
        <SwiperSlide
          v-for="(userBanner, index) in userBanners?.data"
          :key="index"
        >
          <v-card
            width="100%"
            :min-height="$vuetify.display.smAndDown ? '25vh' : '75vh'"
            class="pt-16 d-flex flex-column justify-center"
          >
            <template v-slot:image>
              <v-img :src="userBanner.image_path" position="top" cover></v-img>
            </template>
            <v-container>
              <h1 v-if="userBanner.name" class="text-md-h1 text-sm-h2 text-h3 font-weight-black pb-10">
                {{ userBanner.name }}
              </h1>
              <p v-if="userBanner.description" class="text-md-h4 text-sm-h5 text-h6 pb-16">
                {{ userBanner.description }}
              </p>
              <BaseGradientBtn :href="userBanner.action_path" v-if="userBanner.action_path && userBanner.action === 'url'"> {{ $t('explore_now') }} </BaseGradientBtn>
            </v-container>
          </v-card>
        </SwiperSlide>
      </Swiper>
    </div>
  </v-sheet>
</template>

<style scoped lang="scss">
.swiper-wrap-container {
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
  }
  ::v-deep .swiper-button-next:after,
  ::v-deep .swiper-button-prev:after {
    content: "";
  }
  ::v-deep .swiper-pagination-bullet-active {
    background: #fff;
    width: 15px;
    height: 15px;
  }
  ::v-deep .swiper-pagination-bullet {
    width: 15px;
    height: 15px;
  }
  ::v-deep .swiper-pagination-horizontal {
    bottom: 46px;
  }
}

.v-locale--is-ltr {
  ::v-deep .swiper-button-next {
    width: 40px;
    height: 40px;
    background: url("@/assets/img/icons/icon-arrow-rounded-borderd-white.png")
      no-repeat center;
    background-size: contain;
    position: absolute;
    top: 90%;
    right: 12%;
  }
  ::v-deep .swiper-button-prev {
    width: 40px;
    height: 40px;
    background: url("@/assets/img/icons/icon-arrow-rounded-borderd-white.png")
      no-repeat center;
    background-size: contain;
    position: absolute;
    top: 90%;
    left: 12%;
    transform: rotate(180deg);
  }
}
.v-locale--is-rtl {
  ::v-deep .swiper-button-next {
    width: 40px;
    height: 40px;
    background: url("@/assets/img/icons/icon-arrow-rounded-borderd-white.png")
      no-repeat center;
    background-size: contain;
    position: absolute;
    top: 90%;
    left: 12%;
    transform: rotate(180deg);
  }
  ::v-deep .swiper-button-prev {
    width: 40px;
    height: 40px;
    background: url("@/assets/img/icons/icon-arrow-rounded-borderd-white.png")
      no-repeat center;
    background-size: contain;
    position: absolute;
    top: 90%;
    right: 12%;
  }
}
</style>
