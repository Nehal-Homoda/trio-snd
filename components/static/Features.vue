<script setup>
import { heros } from "~/core/manager/AssetsManager";
import { icons } from "~/core/manager/AssetsManager";

const { t } = useI18n();
const serviceCard = ref({
  1: {
    photo: heros.hero_2,
    title: t("feature_section.feature_1_title"),
    listItem: [
      t("feature_section.feature_1_desc_1"),
      t("feature_section.feature_1_desc_2"),
      t("feature_section.feature_1_desc_3"),
    ],
  },
  2: {
    photo: heros.hero_3,
    title: t("feature_section.feature_2_title"),
    listItem: [
      t("feature_section.feature_2_desc_1"),
      t("feature_section.feature_2_desc_2"),
      t("feature_section.feature_2_desc_3"),
    ],
  },
  3: {
    photo: heros.hero_4,
    title: t("feature_section.feature_3_title"),
    listItem: [
      t("feature_section.feature_3_desc_1"),
      t("feature_section.feature_3_desc_2"),
    ],
  },
});
</script>

<template>
  <v-sheet color="transparent" class="services py-16">
    <v-container>
      <div class="position-relative mb-16 text-center">
        <BaseTitleSection
          :first="$t('feature_section.feature_feature')"
          :second="$t('feature_section.feature_snd')"
        />
        <p
          class="w-100 w-md-75 mx-auto text-center font-size-large font-weight-medium px-3 px-sm-16"
        >
          {{ $t("feature_section.feature_desc") }}
        </p>
        <img class="head-logo-left" :src="icons.iconTrioLogo" alt="" />
        <img class="head-logo-right" :src="icons.iconTrioLogo" alt="" />
      </div>
      <v-row>
        <v-col
          cols="12"
          md="4"
          v-for="(item, index) in serviceCard"
          :key="index"
        >
          <v-card
            elevation="0"
            color="secondary"
            class="custom-shadow feature-card"
            rounded="lg"
          >
            <v-sheet class="card-img-wrap flex-shrink-0 flex-grow-0">
              <v-img
                width="100%"
                height="100%"
                :src="item.photo"
                cover
                position="top"
              ></v-img>
            </v-sheet>

            <div class="pe-5 pb-5">
              <h5
                class="text-center my-sm-5 my-md-5 text-primary text-h5 my-3 font-weight-bold"
              >
                {{ item.title }}
              </h5>
              <div
                v-for="(item, index) in item.listItem"
                :key="index"
                class="d-flex mb-4"
              >
                <v-icon color="primary" size="30" class="ms-3 me-2"
                  >mdi-circle-small</v-icon
                >
                <p class="text-body-2">
                  {{ item }}
                </p>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style scoped lang="scss">
.feature-card {
  display: flex;
  flex-direction: column;

  .card-img-wrap {
    width: 100%;
    height: 275px;

    @include media-breakpoint-up(sm) {
      width: 300px;
      height: auto;
    }

    @include media-breakpoint-up(md) {
      width: 300px;
      height: auto;
    }

    @include media-breakpoint-up(lg) {
      width: 100%;
      height: 275px;
    }
  }

  @include media-breakpoint-up(sm) {
    flex-direction: row;
  }
  @include media-breakpoint-up(md) {
    flex-direction: row;
  }
  @include media-breakpoint-up(lg) {
    flex-direction: column;
  }
}

.head-logo-left {
  width: 45px;
  height: 45px;
  position: absolute;
  top: -55px;
  left: 45px;
  transform: rotate(60deg);
  object-fit: contain;
}

.head-logo-right {
  width: 45px;
  height: 45px;
  position: absolute;
  top: 45px;
  right: -35px;
  transform: rotate(123deg);
  -o-object-fit: contain;
  object-fit: contain;
}

@include media-breakpoint-up(xs) {
  .head-logo-left {
    width: 25px;
    height: 25px;
    left: -20px;
  }

  .head-logo-right {
    width: 25px;
    height: 25px;
    right: -30px;
  }
}

@include media-breakpoint-up(md) {
  .head-logo-left {
    width: 45px;
    height: 45px;
    left: 45px;
  }

  .head-logo-right {
    width: 45px;
    height: 45px;
  }
}
</style>
