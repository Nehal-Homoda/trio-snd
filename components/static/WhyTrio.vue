<script setup lang="ts">
import { icons } from "~/core/manager/AssetsManager";
const {t} = useI18n();

const data = ref({
  0: {
    title: t('why_snd_section.reason_1_title'),
    subtitle:t('why_snd_section.reason_1_desc'),
    icon: icons.icon_1,
  },
  1: {
    title: t('why_snd_section.reason_2_title'),
    subtitle:t('why_snd_section.reason_2_desc'),
    icon: icons.icon_2,
  },
  2: {
    title: t('why_snd_section.reason_3_title'),
    subtitle:t('why_snd_section.reason_3_desc'),
    icon: icons.icon_3,
  },
  3: {
    title:t('why_snd_section.reason_4_title'),
    subtitle:t('why_snd_section.reason_4_desc'),
    icon: icons.icon_4,
  },
  4: {
    title:t('why_snd_section.reason_5_title'),
    subtitle:t('why_snd_section.reason_5_desc'),
    icon: icons.icon_5,
  }
});
</script>
<template>
  <v-sheet class="why-trio py-16" color="transparent">
    <v-container>
      <!-- <ProviderOrdersCardsOrderStatistics/> -->
      <BaseTitleSection :first="$t('why_snd_section.why')" :second="$t('why_snd_section.trio')" class="text-center" />
      <!-- <p class="w-100 w-md-75 mx-auto text-center font-size-large font-weight-medium px-3 px-sm-16">
        Lorem ipsum dolor sit amet, consectetur adipiscing Nunc odio in et, lectus sit lorem id integer.
        Lorem ipsum dolor sit amet, consectetur 
      </p> -->
      <v-row class="mt-16">
        <v-col md="12" lg="10" cols="12" class="mx-auto">
          <v-row>
            <v-col sm="6" cols="12" v-for="item in data">
              <div class="card-box d-flex flex-column-reverse flex-md-row align-center ga-5 pa-5 mb-1 pb-5 rounded-lg">
                <div class="w-100 info text-center text-md-start">
                  <h3 class="font-weight-reguler mb-4 truncate">
                    {{ item.title }}
                  </h3>
                  <p class="info-card-subtitle text-body-2 line-3 px-5 px-md-0">
                    {{ item.subtitle }}
                  </p>
                </div>
                <div class="info-card-img-wrap flex-grow-0 flex-shrink-0">
                  <v-img :src="item.icon" width="65px" height="65px"></v-img>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style scoped lang="scss">
.h2-line {
  line-height: 1.1;
}

.card-box {
  background-color: rgb(var(--v-theme-secondary));

  .info {
    .info-card-subtitle {
      height: 75px;
      line-height: 1.5;
    }
  }
}
</style>
