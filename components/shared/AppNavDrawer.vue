<script setup>
/*##########[ IMPORTS ]##########*/
import RoutesManager from "~/core/manager/RoutesManager";

/*##########[ DEFINES ]##########*/
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const localePath = useLocalePath();

/*##########[ COMPUTED ]##########*/
const navDrawer = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});


const authStore = useAuthStore();



</script>

<template>
  <v-navigation-drawer temporary v-model="navDrawer" location="end">

    <v-sheet height="90px" class="d-flex align-center" color="transparent">
      <v-btn @click="navDrawer = !navDrawer" rounded="circlur" icon="mdi-close"></v-btn>
    </v-sheet>
    <v-sheet width="300px" height="calc(100% - 100px)"
      class="d-flex flex-column align-center justify-center ga-7 pb-16" color="transparent">

      <div class="nav-wrap">
        <NuxtLink class="link-item" :to="localePath(RoutesManager.home)">{{$t('home')}}</NuxtLink>
        <NuxtLink class="link-item" :to="localePath(RoutesManager.about)">{{ $t('how_we_are') }}</NuxtLink>
        <NuxtLink class="link-item" :to="localePath(RoutesManager.orders)">{{$t('track_your_order') }}</NuxtLink>
        <NuxtLink class="link-item" :to="localePath(RoutesManager.categories)">{{ $t('our_services') }}</NuxtLink>
      </div>

      <ClientOnly>
        <template v-if="!authStore.isLoggedIn">
          <!-- <BaseGradientBtn color="primary"  variant="elevated" width="160px" height="35px" rounded="lg"
            class="font-size-small font-weigh-medium text-white" @click="goTo(RoutesManager.introLogin)">
            سجل واشحن الان
          </BaseGradientBtn> -->

          <v-btn color="primary" variant="outlined" rounded="lg" width="160px" height="35px" class="font-size-small font-weigh-medium"
            @click="$router.push(`${localePath(RoutesManager.introLogin)}`)">
             {{ $t('login_in') }}
          </v-btn>
        </template>
      </ClientOnly>
    </v-sheet>
  </v-navigation-drawer>
</template>


<style lang="scss" scoped>
.nav-wrap {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;

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
        bottom: 0%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgb(var(--v-theme-primary));
      }
    }
  }
}
</style>