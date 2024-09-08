<script setup lang="ts">
import { icons } from "~/core/manager/AssetsManager";
import type {
  ProviderOrderStatistics,
  ProviderOrderStatisticsResponse,
} from "~/interfaces/provider/orderStatistics/orderStatistics";
import type { ResponseWithValue } from "~/interfaces/response/response.interface";
import { appInfo } from "~/core/config/app.config";
const orderStatistics = ref({
  1: { icon: icons.icon_13, title: "العروض المرسله", slug: "sent" },
  2: { icon: icons.icon_14, title: "الطلبات الجديده", slug: "fresh" },
  3: { icon: icons.icon_15, title: "طلباتي المباشره", slug: "direct" },
  4: { icon: icons.icon_16, title: "الطلبات النشطه", slug: "active" },
  5: { icon: icons.icon_17, title: "الطلبات المنفذه", slug: "completed" },
  6: { icon: icons.icon_18, title: "الطلبات المجدوله", slug: "scheduled" },
  7: { icon: icons.icon_19, title: "الطلبات الملغاه", slug: "cancelled" },
});

const statistcs = ref<ProviderOrderStatisticsResponse | null>(null);

const fetchOrderStatistics = () => {
  useAppFetch<ResponseWithValue<ProviderOrderStatistics>>()
    .eventGetOrderStatistics()
    .then((response) => {
      statistcs.value = response;
    });
};

onMounted(() => {
  fetchOrderStatistics();
});
</script>
<template>
  <v-sheet color="transparent" class="py-16">
    <v-container>
      <ProviderOrdersCardsNewOrderCards/>
      
<ProviderOrdersCardsProviderMap/>
      <v-row>
        <v-col
          cols="12"
          md="4"
          v-for="(item, index) in orderStatistics"
          :key="index"
        >
          <v-card
            class="d-flex flex-column align-center justify-center py-5 ga-1 mx-auto"
            max-width="300"
            variant="outlined"
            color="primary"
            rounded="lg"
          >
            <v-sheet width="45" height="45">
              <v-img
                width="100%"
                height="100%"
                contain
                :src="item.icon"
              ></v-img>
            </v-sheet>
            <p class="text-primary font-weight-bold">
              {{ statistcs ? statistcs.data[item.slug] : 0 }}
            </p>
            <p class="text-black font-weight-bold text-md-h5 h6">
              {{ item.title }}
            </p>
          </v-card>
        </v-col>
      </v-row>
      <div class="d-flex justify-center align-center">
        <v-btn
          :href="`https://wa.me/${appInfo.contact.phone}`"
          class="px-8"
          rounded="lg"
          height="45"
          color="green"
          >Connect us via Whatsapp
          <v-img
            class="mx-8"
            width="30"
            height="30"
            :src="icons.whatsappIcon"
          ></v-img>
        </v-btn>
      </div>
    </v-container>
  </v-sheet>
</template>


<style scoped></style>


