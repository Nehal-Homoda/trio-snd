<script setup lang="ts">
import { icons } from "~/core/manager/AssetsManager";
import { bg } from "~/core/manager/AssetsManager";
import type { ResponseData } from "~/interfaces/response/response.interface";
import type { StatisticsResponse } from "~/interfaces/shared/shared.interface";

const display = useDisplay();


const statistics = ref<StatisticsResponse | null>(null)

const { t } = useI18n();



const info = computed(() => {
  return {
    1: {
      icon: icons.icon_10,
      recycleNum: 14,
      text: t('user'),
      slug: 'orders_count'
    },
    2: {
      icon: icons.icon_11,
      recycleNum: "14k",
      text: t('provider'),
      slug: 'providers_count'
    },
    3: {
      icon: icons.icon_12,
      recycleNum: "768k",
      text: t('orders'),
      slug: 'users_count'
    },
  }
})

const fetchStatistics = () => {
  useAppFetch<StatisticsResponse>().eventGetStatistics()
    .then((response) => {
      statistics.value = response;
    })

}
onMounted(() => {
  fetchStatistics();
})


</script>

<template>
  <v-sheet class="client-statistics-section pb-16">
    <v-card theme="dark" width="100%" rounded="0" class="title-card pt-16">
      <template v-slot:image>
        <v-img cover :src="bg.bg_7"></v-img>
      </template>
      <v-container>
        <h2 class="text-h3 text-sm-h2 text-lg-h1 mt-16  px-lg-16 font-weight-black text-center "
          :class="$vuetify.display.name">
          {{ $t('statics') }}
        </h2>
      </v-container>
    </v-card>

    <v-container class="wrap-container position-relative text-center">


      <!-- <v-card color="secondary" class="pa-16"></v-card> -->
      <v-card width="100%" color="primary" elevation="10" rounded="lg" class="stats-card py-7 px-7">
        <v-row>
          <template v-for="item in info">
            <v-col cols="12" sm="4">
              <v-sheet color="surface" elevation="5" class="pb-3 pt-5 px-3 " rounded="lg">
                <p class="font-weight-bold text-h3 text-brand-text-color-default">
                  {{ statistics ? statistics.data[item.slug] || 0 : 0 }}
                </p>
                <v-divider class="mt-3 mb-3" thickness="2" color="primary"></v-divider>
                <p class="position-relative font-weight-medium pb-2 ">
                  {{ item.text }}
                </p>
              </v-sheet>
            </v-col>
          </template>
        </v-row>
      </v-card>
    </v-container>
  </v-sheet>
</template>

<style lang="scss" scoped>
.client-statistics-section {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .title-card {
    height: 475px;

    @include media-breakpoint-up(lg) {
      height: 550px;
    }
  }

  .wrap-container {
    margin-top: -100px;
  }

  /* .client-statistics-wrap {
    width: 100%;
    max-height: 80vh;
    background: url('~/assets/img/bg/bg-7.png') no-repeat center center;
    background-size: cover;
  } */


  .section-title {
    margin-bottom: 200px;

    // margin-top: 125px;

    &.xs {
      padding-top: 0;
    }

    &.sm {
      padding-top: 50px;
    }

    &.md {
      padding-top: 50px;
    }

    &.lg {
      padding-top: 50px;
    }

    &.xl {
      padding-top: 125px;
    }

    &.xxl {
      padding-top: 125px;
    }


  }

  /* .spacer-between {
    margin-bottom: 60px;

    @include media-breakpoint-up(sm) {
      margin-bottom: 80px;
    }

    @include media-breakpoint-up(xl) {
      margin-bottom: 100px;
    }
  } */
}
</style>