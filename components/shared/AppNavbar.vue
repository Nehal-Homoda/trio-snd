<script setup lang="ts">
/*##########[ IMPORTS ]##########*/
import RoutesManager from "~/core/manager/RoutesManager";
import { ref } from "vue";
import { heros, brand } from "~/core/manager/AssetsManager";
import { useAuthStore } from "~/stores/auth";
const notificationsStore = useNotificationsStore();
const { notReadNotificationLength, orderNotificationLength, publicNotificationLength } = storeToRefs(notificationsStore);

/*##########[ DEFINES ]##########*/
const { logout } = useAuthStore();
const authStore = useAuthStore();
const { user, isLoggedIn } = storeToRefs(authStore)

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const dialog = ref(false);
const loading = ref(false)
const test = ref(0);

const localePath = useLocalePath();
const router = useRouter();

const { t } = useI18n();

/*##########[ COMPUTED ]##########*/
const navDrawer = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

/*#########[METHODS]#########*/
const handleSignOut = () => {
  loading.value = true
  logout();
};

const navlinks = computed(() => {
  return {
    1: { link: RoutesManager.home, name: t('home') },
    2: { link: RoutesManager.about, name: t('how_we_are') },
    3: { link: RoutesManager.orders, name: t('track_your_order') },
    4: { link: RoutesManager.categories, name: t('our_services') },
  }
});

const notifications = computed(() => {
  return {
    1: { link: RoutesManager.notifications, name: t('general_notifications') },
    2: { link: RoutesManager.notificationsOrder, name: t('orders_notification') },
  }
});
const completeDataHandler = () => {
  router.push({
    path: localePath(RoutesManager.profile),
    query: { section: 'edit' }
  })
}

</script>
<template>
  <!-- <v-app-bar scroll-behavior="elevate" class="app-navbar px-3"> -->
  <v-app-bar scroll-behavior="fully-hide elevate" class="app-navbar px-3">
    <v-sheet width="150px" height="100%" class="d-flex align-center ps-0 ps-md-10" color="transparent">
      <NuxtLink :to="localePath(RoutesManager.home)">
        <img src="@/assets/img/logo-light.png" height="30" alt="" v-if="$vuetify.theme.name === 'dark'" />
        <img src="@/assets/img/logo-dark.png" height="30" alt="" v-else />
      </NuxtLink>
    </v-sheet>

    <div class="nav-wrap d-none d-md-flex ms-5 ms-xl-16">
      <NuxtLink v-for="(item, index) in navlinks" :key="index" class="link-item px-2 font-size-medium"
        :to="localePath(item.link)">
        {{ item.name }}
      </NuxtLink>
    </div>

    <!--====== start brand logo ======-->
    <!-- <NuxtLink :to="localePath(RoutesManager.home)"> </NuxtLink> -->
    <!--====== end brand logo ======-->

    <!--====== start nav menu ======-->
    <!-- <BaseNavMenu class="d-none d-md-flex align-center ga-7 me-16"></BaseNavMenu> -->
    <!--====== end nav menu ======-->

    <template v-slot:append>




      <div class="d-flex align-center ga-1 ms-2 pe-0 pe-md-10">
        <v-btn @click="completeDataHandler" v-if="authStore.user && !authStore.user.complete_data"
          prepend-icon="mdi-shield-check" size="small" rounded="pill" variant="tonal" color="error"
          class="font-size-small font-weight-bold me-3">{{ $t('complete_data') }}</v-btn>
        <!-- <ClientOnly> -->


        <v-menu v-if="isLoggedIn">
          <template v-slot:activator="{ props }">
            <!-- <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn> -->
            <!-- <v-img v-bind="props" width="40" height="40" rounded="xl" :src="authStore.user.avatar_path" class="pointer"></v-img> -->
            <v-avatar variant="outlined" color="primary" v-bind="props" class="pointer">
              <v-img width="100%" height="100%" cover :lazy-src="brand.avatar"
                :src="authStore.user?.avatar_path"></v-img>
            </v-avatar>
          </template>

          <v-list class="rounded-xl border-menue">
            <v-list-item @click="goTo(RoutesManager.profile)">
              <template v-slot:prepend>
                <v-avatar>
                  <v-img width="100%" height="100%" cover :lazy-src="brand.avatar"
                    :src="authStore.user?.avatar_path"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold ">{{
                authStore.user?.name
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                authStore.user?.email
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider class="my-2 text-primary" thickness="2"></v-divider>

            <BaseConfirmActionDialog @confirm="handleSignOut" :loading="loading" v-model="dialog">
              <template v-slot="activatorProps">
                <v-list-item class="pointer" v-bind="activatorProps" base-color="primary">
                  <v-icon>mdi mdi-logout</v-icon>
                  {{ $t('sign_out') }}
                </v-list-item>
              </template>
            </BaseConfirmActionDialog>

          </v-list>
        </v-menu>


        <template v-else>
          <div class="ga-2 d-flex">
            <!-- <BaseGradientBtn color="primary" variant="elevated" height="35px" rounded="lg"
            class="font-size-small font-weigh-medium text-white" @click="goTo(RoutesManager.introLogin)">
            سجل واشحن الان
          </BaseGradientBtn> -->
            <BaseGradientBtn color="primary" variant="elevated" height="35px" rounded="lg"
              class="font-size-small font-weigh-medium text-white" @click="goTo(RoutesManager.login)">
              {{ $t('login_in') }}
            </BaseGradientBtn>

            <!-- <v-btn color="primary" variant="outlined" rounded="lg" height="35px"
        class="font-size-small font-weigh-medium" @click="$router.push(`${RoutesManager.introLogin}`)">
        تسجيل الدخول
      </v-btn> -->
          </div>
        </template>
        <v-btn icon>
          <v-img @click="goTo(RoutesManager.notificationBubble)" width="35" height="35"
            src="~/assets/img/bubble-gift.png"></v-img>
        </v-btn>


        <BaseColorModeToggle />
        <BaseLocaleDropdown />

          <v-menu v-if="isLoggedIn">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" size="small" variant="outlined" v-bind="props" icon=" mdi mdi-bell">
                <v-badge dir="ltr" v-if="!!notReadNotificationLength" color="success">
                  <template v-slot:badge>
                    <span class="font-size-xx-small font-weight-bold">{{ notReadNotificationLength }}</span>
                  </template>
                  <v-icon>mdi-bell</v-icon>
                </v-badge>
                <v-icon v-else>mdi-bell</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item color="primary" width="250" :to="localePath(RoutesManager.notifications)">
                <v-list-item-title class="cursor-pointer"> {{ $t('general_notifications') }}</v-list-item-title>
                <template v-if="!!publicNotificationLength" v-slot:append>
                  <v-avatar size="20" color="success" class="font-size-x-small font-weight-bold">
                    {{ publicNotificationLength }}
                  </v-avatar>
                </template>
              </v-list-item>
              <v-list-item color="primary" width="250" :to="localePath(RoutesManager.notificationsOrder)">
                <v-list-item-title class="cursor-pointer">{{ $t('orders_notification') }}</v-list-item-title>
                <template v-if="!!orderNotificationLength" v-slot:append>
                  <v-avatar size="20" color="success" class="font-size-x-small font-weight-bold">
                    {{ orderNotificationLength }}
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>

        <!-- <v-btn @click="navDrawer = !navDrawer" color="primary" rounded="circlur" class="d-md-none"
          icon="mdi-menu"></v-btn> -->

      </div>
    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.app-navbar {
  border-bottom: 1px solid rgb(var(--v-theme-primary));



}

.border-menue {
  border: 1px solid rgb(var(--v-theme-primary));
}

.nav-wrap {
  display: flex;
  gap: 1.5rem;
  align-items: center;

  .service-btn {
    font-size: 13px !important;
    font-weight: 550 !important;
  }

  .link-item {
    text-decoration: none;
    color: rgb(var(--v-theme-brand-text-color-default));
    font-size: 13px;
    font-weight: 550;
    position: relative;
    cursor: pointer;

    &.router-link-exact-active,
    &:hover {
      color: rgb(var(--v-theme-primary));

      &::before {
        content: "";
        width: 100%;
        height: 2px;
        position: absolute;
        bottom: -30%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgb(var(--v-theme-primary));
      }
    }
  }
}

.service-wrap {
  width: 200px;
  text-align: end;

  .link-item {
    text-decoration: none;
    color: rgb(var(--v-theme-brand-text-color-default));
  }
}

.btn-wrapper {
  display: flex;
  gap: 25px;
  align-items: center;
}
</style>
