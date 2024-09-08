<script setup>
import RoutesManager from "~/core/manager/RoutesManager";

const router = useRouter();
const route = useRoute();
const localPath = useLocalePath();
const type = ref("");

const { t } = useI18n();

const changeOrderType = (ordertype) => {
  router.push({
    path: localPath(RoutesManager.orders),
    query: { type: ordertype },
  });
  type.value = ordertype;
  const tab = document.querySelector(`#order-tab-${ordertype}`);
  const tabsWrap = document.querySelector(`.tabs-wrap`);
  tabsWrap.scrollTo({
    left: tabsWrap.scrollLeft + (tab.offsetLeft - tabsWrap.offsetLeft),
    behavior: "smooth",
  });
};

const tabs = {
  1: {
    name: t("in_progress_live"),
    slug: "in_progress_live",
  },
  2: {
    name: t("completed"),
    slug: "completed",
  },
  3: {
    name: t("canceled"),
    slug: "canceled",
  },
  4: {
    name: t("in_progress"),
    slug: "in_progress",
  },
  5: {
    name: t("saved"),
    slug: "saved",
  },
  6: {
    name: t("pending"),
    slug: "pending",
  },
};

definePageMeta({
  middleware: "auth",
});

onMounted(() => {
  type.value = route.query.type ? route.query.type : "pending";
  const tab = document.querySelector(`#order-tab-${type.value}`);
  const tabsWrap = document.querySelector(`.tabs-wrap`);
  tabsWrap.scrollTo({
    left: tabsWrap.scrollLeft + (tab.offsetLeft - tabsWrap.offsetLeft - 50),
    behavior: "smooth",
  });
});
</script>

<template>
  <v-sheet color="transparent" width="100%" min-height="100vh" class="pt-15">
    <v-container class="mt-5">
      <v-row>
        <v-col cols="12" lg="10" class="mx-auto">
          <v-card
            elevation="0"
            rounded="pill"
            class="tabs-wrap custom-elevation overflow-auto d-flex align-center justify-space-around ga-2 pa-2"
          >
            <template v-for="tab in tabs">
              <v-btn
                class="tabs-btn-width"
                rounded="pill"
                :id="`order-tab-${tab.slug}`"
                :class="
                  type === `${tab.slug}`
                    ? 'text-md-h6 text-white pb-1'
                    : 'text-sm-h6'
                "
                :color="type === `${tab.slug}` ? 'primary' : 'transparent'"
                @click="changeOrderType(`${tab.slug}`)"
              >
                {{ tab.name }}
              </v-btn>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <UserOrdersListingOrderListing
        class="mt-16"
        v-if="type === 'in_progress_live'"
        :status="type"
      />
      <UserOrdersListingOrderListing
        class="mt-16"
        v-if="type === 'completed'"
        :status="type"
      />
      <UserOrdersListingOrderListing
        class="mt-16"
        v-if="type === 'canceled'"
        :status="type"
      />

      <UserOrdersListingOrderListing
        class="mt-16"
        v-if="type === 'saved'"
        :status="type"
      />
      <UserOrdersListingOrderListing
        class="mt-16"
        v-if="type === 'in_progress'"
        :status="type"
      />

      <UserOrdersListingOrderListing
        class="mt-16"
        v-if="type === 'pending'"
        :status="type"
      />
    </v-container>
  </v-sheet>
</template>

<style lang="scss" scoped>
.custom-elevation {
  box-shadow: 0 2px 5px #00000021 !important;

  .tabs-btn-width {
    // width: 150px;
    height: 52px;

    @include media-breakpoint-up(xs) {
      // width: 80px;
      height: 30px;
    }

    @include media-breakpoint-up(sm) {
      // width: 90px;
      height: 30px;
    }

    @include media-breakpoint-up(md) {
      // width: 100px;
      height: 52px;
    }

    @include media-breakpoint-up(lg) {
      // width: 150px;
      height: 52px;
    }
  }
}
</style>
