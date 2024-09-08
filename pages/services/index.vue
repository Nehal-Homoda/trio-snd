<script setup lang="ts">
import { bg, heros } from "~/core/manager/AssetsManager";
import RoutesManager from "~/core/manager/RoutesManager";
import type {
  Parent,
  UserServicesList,
  UserServicesListResponse,
} from "~/interfaces/user/services-list/servicesList.interface.ts";

const sharedStore = useSharedStore();
const makeOrderStore = useMakeOrderStore();
const { selectedChildService, selectedParentService } =
  storeToRefs(makeOrderStore);
const localePath = useLocalePath();
const heroHeight = ref("450px");
const loading = ref(true);
const subServiceLoading = ref(false);

const childServicesSection = ref<HTMLElement | null>(null);

const serviceList = ref<Parent[]>([]);
const subServiceList = ref<UserServicesList[]>([]);

const isOdd = (num: number) => num % 2;
const changeService = (service: Parent) => {
  if (
    selectedParentService.value &&
    selectedParentService.value.id == service.id
  )
    return;
  selectedParentService.value = service;
  fetchUserSubService();

  if (childServicesSection.value) {
    childServicesSection.value.scrollIntoView({ behavior: "smooth" });
  }
};

const fetchUserServices = () => {
  loading.value = true;

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

      if (selectedParentService.value) {
        console.log('here')
        fetchUserSubService();
        return;
      }

      if (!!response.data.length) {
        selectedParentService.value = response.data[0].parent;
        try {
          window.localStorage.setItem(
            "selectedParentService",
            JSON.stringify(selectedParentService.value)
          );
        } catch (error) {
          console.log(
            "save selectedParentService To Localestorage error ",
            error
          );
        }
        fetchUserSubService();
      }
    })
    .catch((error) => {
      sharedStore.SET_ERROR(error);
    })
    .finally(() => {
      loading.value = false;
    });
};
const fetchUserSubService = () => {
  if (!selectedParentService.value) return;

  subServiceLoading.value = true;
  subServiceList.value = [];
  useAppFetch<UserServicesListResponse>()
    .eventGetUserService(selectedParentService.value.id.toString())
    .then((response) => {
      subServiceList.value = response.data;
    })
    .catch((error) => {
      sharedStore.SET_ERROR(error);
    })
    .finally(() => {
      subServiceLoading.value = false;
    });
};
const selectChild = (childService: UserServicesList) => {
  selectedChildService.value = childService;
  try {
    window.localStorage.setItem(
      "selectedChildService",
      JSON.stringify(childService)
    );
  } catch (error) {
    console.log("save selectedChildService To Localestorage error ", error);
  }
  goTo(RoutesManager.createOrder);
};
onMounted(() => {
  fetchUserServices();
});
</script>

<template>
  <v-sheet color="transparent" class="py-16">
    <v-container>
      <v-card theme="dark" width="100%" class="header-card d-flex align-end">
        <template v-slot:image>
          <v-img cover :src="bg.bg_4"></v-img>
        </template>
        <div class="content-wrap">
          <h1 class="text-h5 text-md-h4 text-md-h3 mb-4 shadow">
             {{ $t('main_service') }}
          </h1>
          <!-- <p class="truncate line-3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit
            reiciendis consequatur blanditiis voluptatibus nulla quaerat! Modi
            iure fuga explicabo nobis tenetur
          </p> -->
        </div>
      </v-card>

      <v-card color="primary text-white my-10 py-5 px-7" elevation="0" rounded="lg">
        <h1 class="text-h5 text-md-h4 text-md-h3 font-weight-medium">
          {{ $t('learn_main_service') }}
        </h1>
      </v-card>
    </v-container>

    <v-container class="mt-0 mb-16">
      <div class="services-tabs-wrap">
        <v-btn v-for="(item, index) in serviceList" :key="item.id" @click="changeService(item)" class="font-weight-bold"
          height="50" rounded="lg" :color="selectedParentService && selectedParentService.id == item.id
            ? 'primary'
            : 'secondary-darken'
            " :class="selectedParentService && selectedParentService.id == item.id
              ? 'text-white'
              : ''
              ">
          {{ item.name }}
        </v-btn>
      </div>
    </v-container>

    <div v-if="loading" class="d-flex justify-center align-center my-16">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </div>

    <v-sheet v-if="selectedParentService" color="surface" class="service-info-card py-16">
      <div class="service-info mb-10 mb-sm-0">
        <h1 class="text-h5 text-md-h4 text-md-h3 mb-3 text-primary font-weight-bold">
          {{ selectedParentService?.name }}
        </h1>
        <div class="divider mb-7"></div>
        <p class="truncate line-4 font-weight-medium text-brand-color-text-default">
          {{ selectedParentService?.description }}
        </p>
      </div>
      <div class="px-5 hero-wrapper">
        <v-card color="transparent" elevation="0" rounded="lg" width="100%" height="300px">
          <template v-slot:image>
            <v-img width="100%" height="100%" :src="selectedParentService?.icon_path"></v-img>
          </template>
        </v-card>
      </div>
    </v-sheet>

    <div ref="childServicesSection" class="child-services-section py-16">
      <v-container>
        <v-row v-if="subServiceLoading">
          <template v-for="i in 8">
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-skeleton-loader class="border" type="image, article"></v-skeleton-loader>
            </v-col>
          </template>
        </v-row>

        <v-row>
          <template v-for="item in subServiceList">
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-card class="sub-service-card pa-4" rounded="lg" color="primary" variant="outlined">
                <v-card color="transparent" elevation="0" rounded="lg" width="100%" height="200px">
                  <template v-slot:image>
                    <v-img width="100%" height="100%" :src="item.icon_path"></v-img>
                  </template>
                </v-card>
                <h5 class="text-h6 mb-1 mt-5 text-brand-color-text-default text-center font-weight-bold">
                  {{ item.name }}
                </h5>
                <div class="divider mb-4 mx-auto"></div>
                <p class="description truncate line-2 text-center font-weight-medium text-brand-color-text-default">
                  {{ item.description }}
                </p>
                <div class="divider-dots mt-7 mb-5"></div>

                <v-btn @click="selectChild(item)" block rounded="lg" height="45" color="primary"
                  class="mt-5 text-white">{{ $t('request_service') }}</v-btn>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </div>
  </v-sheet>
</template>

<style lang="scss" scoped>
.shadow {
  text-shadow: 5px 5px 5px rgba(var(--v-theme-primary), 0.3);
  font-weight: bold;
}

.header-card {
  min-height: 350px;
  padding-bottom: 100px;
  padding-bottom: 50px;

  @include media-breakpoint-up(sm) {
    min-height: 350px;
    padding-bottom: 50px;
  }

  @include media-breakpoint-up(md) {
    min-height: 500px;
    padding-bottom: 100px;
  }

  @include media-breakpoint-up(lg) {
    min-height: 500px;
    padding-bottom: 100px;
  }

  @include media-breakpoint-up(xl) {
    min-height: 500px;
    padding-bottom: 100px;
  }

  .content-wrap {
    width: 85%;
    background-color: rgb(var(--v-theme-primary), 0.8);
    border-radius: 0 0.75em 0.75em 0;
    padding: 25px 15px 25px 25px;
    // margin-bottom: 150px;

    @include media-breakpoint-up(sm) {
      width: 65%;
    }

    @include media-breakpoint-up(md) {
      width: 55%;
    }

    @include media-breakpoint-up(lg) {
      width: 45%;
    }

    @include media-breakpoint-up(xl) {
      width: 45%;
    }
  }
}


.services-tabs-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @include media-breakpoint-up(sm) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @include media-breakpoint-up(md) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @include media-breakpoint-up(lg) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @include media-breakpoint-up(xl) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.service-info-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 1.5px solid rgb(var(--v-theme-primary));
  border-bottom: 1.5px solid rgb(var(--v-theme-primary));

  .service-info {
    width: 90%;
    background-color: rgb(var(--v-theme-background));
    border-radius: 0 0.75em 0.75em 0;
    padding: 30px 15px 30px 25px;
    // margin-bottom: 150px;

    .divider {
      width: 45%;
      max-width: 200px;
      height: 3.5px;
      background-color: rgb(var(--v-theme-primary));
    }
  }

  .hero-wrapper {
    width: 100%;
  }

  @include media-breakpoint-up(sm) {
    // width: 65%;
  }

  @include media-breakpoint-up(md) {
    flex-direction: row;
    align-items: center;

    .service-info {
      width: 50%;
    }

    .hero-wrapper {
      width: 40%;
      // padding-inline-end: 500px;
    }
  }

  @include media-breakpoint-up(lg) {
    .service-info {
      width: 50%;
    }

    .hero-wrapper {
      width: 40%;
    }
  }

  @include media-breakpoint-up(xl) {
    .service-info {
      width: 50%;
    }

    .hero-wrapper {
      width: 40%;
    }
  }
}

.sub-service-card {
  background-color: rgb(var(--v-theme-surface));
  .divider {
    width: 45%;
    height: 2.5px;
    background-color: rgb(var(--v-theme-primary));
  }

  .divider-dots {
    width: 100%;
    height: 2px;
    border-bottom: 1px dotted rgb(var(--v-theme-primary));
  }

  .description {
    height: 52px;
  }
}

.v-locale--is-rtl {
  .service-info {
    border-radius: 0.75em 0 0 0.75em;
    padding: 50px 25px 50px 15px;
  }

  .content-wrap {
    border-radius: 0.75em 0 0 0.75em;
    padding: 25px 25px 25px 15px;
  }
}
</style>
