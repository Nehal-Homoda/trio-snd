<script setup lang="ts">
import type { ResponseData, ResponseWithValue } from '~/interfaces/response/response.interface';
import type { City } from '~/interfaces/shared/shared.interface';
const loading = ref(true);
const cities = ref<City[]>([])
const dialog = ref(false)
// const dialogActivation=ref(false)
const fetchCities = () => {
  loading.value = true;
  useAppFetch<ResponseData<City>>().eventGetCity().then((response) => {
    cities.value = response.data
    console.log(cities)
  }).finally(() => {
    loading.value = false;
  })

}
const fetchUpdatedCities = (city: City) => {
  // cities.value.push(city)
  fetchCities()
}
const deleteCity = (id: any, index: any) => {
  dialog.value = true
  const fd = new FormData();
  fd.append('city_id', id);

  useAppFetch<ResponseWithValue<City>>().eventdDeleteCity(fd).then((response) => {
    fetchCities()
    dialog.value = false
    notifyAlert('success', response.meta.message)
  }).catch((error) => {
    SET_ERROR(error)
  })
}
const closeDialog = () => {
  dialog.value = false
}
definePageMeta({ middleware: 'auth' })
onMounted(() => {
  fetchCities()
})
</script>
<template>
  <v-sheet color="transparent" width="100%" min-height="100vh" class="py-16">
    <v-container>
      <span class="text-primary font-weight-bold"> {{ $t('add_address') }} </span>

      <div class="custom-table-head mt-16">
        <div class="custom-table-row-title">
          <span>{{ $t('country') }}</span>
          <span>{{ $t('city') }}</span>
          <span>{{ $t('status') }}</span>
        </div>


        <div class="d-flex justify-center justify-md-end ps-5">
          <UserOrdersFormsAddAddressForm @update-cities="fetchUpdatedCities" type="add">
            <template v-slot="activatorProps">
              <v-btn v-if="$vuetify.display.mobile" icon class="text-white" color="primary" v-bind="activatorProps">
                <v-icon color="white" size="30">mdi-plus</v-icon>
              </v-btn>
              <v-btn theme="light" v-else rounded="lg" color="primary" height="55" block class="text-white"
                v-bind="activatorProps" variant="flat">
                <template v-slot:prepend>
                  <v-icon size="30"> mdi-plus-circle</v-icon>
                </template>
                {{ $t('add_new_address') }}</v-btn>
            </template>
          </UserOrdersFormsAddAddressForm>
        </div>

      </div>
      <div class="custom-table-body">
        <div class="custom-table-row" v-for="(item, index) in cities">
          <span>{{ item.country }}</span>
          <span>{{ item.name }}</span>
          <span v-if="item.is_active_user"> {{ $t('activate') }}</span>
          <span v-if="!item.is_active_user"> {{ $t('deactivate') }} </span>
          <div class="option">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" color="primary">mdi-dots-vertical</v-icon>
              </template>

              <v-list rounded="lg" class="pa-0">
                <v-list-item class="pa-0">
                  <UserOrdersFormsAddAddressForm @update-cities="fetchUpdatedCities" :country-id="item.country_id"
                    :readonly="true" :city="item" type="update">
                    <template v-slot="activatorProps">
                      <v-btn v-bind="activatorProps" width="125" append-icon="mdi-pencil" variant="text" height="30">
                        {{ $t('edit') }}
                      </v-btn>
                    </template>

                  </UserOrdersFormsAddAddressForm>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item class="pa-0">
                  <BaseConfirmActionDialog @confirm="deleteCity(item.id, index)" :loading="loading" v-model="dialog">
                    <template v-slot="activatorProps">
                      <v-btn v-bind="activatorProps" width="125" append-icon="mdi-trash-can-outline" color="error"
                        variant="text" height="30">
                        {{ $t('delete') }}
                      </v-btn>
                    </template>

                  </BaseConfirmActionDialog>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
      <div class="custom-table-body" v-if="loading">
        <div class="custom-table-row py-1" v-for="(i) in 8">
          <v-skeleton-loader width="100%" color="transparent" type="subtitle"></v-skeleton-loader>
          <v-skeleton-loader width="100%" color="transparent" type="subtitle"></v-skeleton-loader>
          <v-skeleton-loader width="100%" color="transparent" type="subtitle"></v-skeleton-loader>
          <v-skeleton-loader width="100%" color="transparent" type="subtitle"></v-skeleton-loader>
        </div>
      </div>
    </v-container>
  </v-sheet>
</template>

<style scoped lang="scss">
.custom-table-head {
  display: grid;
  grid-template-columns: 3fr 1fr;

  .custom-table-row-title {
    height: 55px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background-color: rgb(var(--v-theme-secondary));
    padding: 1rem 2rem;
    box-shadow: 0 0 0 1.5px rgb(var(--v-theme-primary));
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 500;

    @include media-breakpoint-up(sm) {
      font-size: 1rem;

    }

    @include media-breakpoint-up(md) {
      font-size: 1.1rem;

    }

    @include media-breakpoint-up(lg) {
      font-size: 1.2rem;

    }

  }
}

.custom-table-body {
  margin-top: 50px;

  .custom-table-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background-color: rgb(var(--v-theme-secondary));
    margin-bottom: 20px;
    padding: 1rem 2rem;
    font-size: 0.8rem;
    border-radius: 10px;

    @include media-breakpoint-up(sm) {
      font-size: 1rem;

    }

    @include media-breakpoint-up(md) {
      font-size: 1.1rem;

    }

    @include media-breakpoint-up(lg) {
      font-size: 1.2rem;

    }

    .option {
      display: flex;
      align-items: end;
      justify-content: end;

    }
  }
}
</style>
