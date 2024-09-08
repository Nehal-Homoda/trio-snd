<script setup>
import { icons } from "~/core/manager/AssetsManager";
import * as gmaps from "@googlemaps/js-api-loader";
const { Loader } = gmaps;
import mapStyle from '~/assets/gmap-style/gmapStyle.json';

const display = useDisplay()

const config = useRuntimeConfig();
const props = defineProps([
  "modelValue",
  "placeholder",
  "label",
  "default-location",
  "required",
  "disabled",
  "orderOptionValue",
]);
const emit = defineEmits(["update:modelValue", "set-location"]);
const isDataSet = ref(false);
const inputValue = ref(null);
const center = ref({ lat: 0, lng: 0 });
const map = ref(null);
const dialog = ref(false);
const markersData = [
  { position: { lat: 40.7128, lng: -74.006 }, icon: icons.iconMarkerPrimary }, // New York
  { position: { lat: 34.0522, lng: -118.2437 }, icon: icons.iconMarkerPrimary }, // Los Angeles
  { position: { lat: 41.8781, lng: -87.6298 }, icon: icons.iconMarkerPrimary }, // Chicago
];
const markers = ref([]);
const geocoder = ref(null);
const fullAddress = ref({});
const savedEnterLocationAddress = ref(null);
const savedEnterCountry = ref(null);
const isWithinCountry = ref(true);
const isAddressFromInputSet = ref(false);
// Define the allowed region bounds
const allowedBounds = ref({
  north: 50.0,
  south: 20.0,
  east: -60.0,
  west: -130.0,
});
const isWithinBounds = (position) => {
  return (
    position.lat() <= allowedBounds.value.north &&
    position.lat() >= allowedBounds.value.south &&
    position.lng() <= allowedBounds.value.east &&
    position.lng() >= allowedBounds.value.west
  );
};

const openDialog = () => {
  if (props.disabled) return;
  // console.log("open");
  dialog.value = true;
  initializeGoogleMap();
  // const timeout = setTimeout(() => {
  //   clearTimeout(timeout);
  // }, 300);
};

const initializeGoogleMap = async () => {
  console.log(mapStyle)
  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey,
    version: "weekly",
    libraries: ["drawing", "geometry", "places", "visualization"],
    language: "ar",
    region: "EG",
  });

  // Initialize the geocoder


  loader.load().then(async () => {
    console.log("Map Loaded");
    /*==| INITIAL MAP ELEMENT |==*/
    const mapEl = document.querySelector("#get-location-map");

    /*==| SET MAP OPTIONS |==*/
    const mapOptions = {
      zoom: 17,
      center: new google.maps.LatLng(center.value),
      mapTypeId: google.maps.MapTypeId.satellite,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      gestureHandling: "greedy",
      // styles: mapStyle
      // mapTypeControlOptions: {
      //   // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      //   position: google.maps.ControlPosition.LEFT_TOP,
      // },
      //   streetViewControlOptions: {
      //   position: google.maps.ControlPosition.LEFT_TOP,
      // },
    };

    /*==| INITIAL MAP |==*/
    map.value = new google.maps.Map(mapEl, mapOptions);
    geocoder.value = new google.maps.Geocoder();

    // const marker = new google.maps.Marker({
    //   position: new google.maps.LatLng(center.value),
    //   map: map.value,
    //   icon: icons.iconMarkerPrimary,
    //   // optimized: false // Ensure marker is re-rendered on each position change
    //   draggable: true,
    //   clickable: true,
    // });

    // Function to reposition the marker at the map's center
    const updateMarkerPosition = async () => {
      await geocodeCountryFromMarkerLocation(map.value.getCenter());

      console.log('in')

      if (!isWithinCountry.value) {
        await map.value.setCenter(center.value);
        return;
      }

      // map.value.setCenter(marker.getPosition());
      // console.log(map.value.get)
      await getAddressFromLatLng(map.value.getCenter());

      fullAddress.value.lat = map.value.getCenter().lat().toString();
      fullAddress.value.lng = map.value.getCenter().lng().toString();

      setLocation();
    };

    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.value.lat + 1,
      south: center.value.lat - 1,
      east: center.value.lng + 1,
      west: center.value.lng - 1,
    };
    const input = document.getElementById("pac-input");
    const mobileAppbar = document.querySelector(".dialog-card-wrap-mobile-appbar");

    // Create the search box and link it to the UI element.
    const searchBox = new google.maps.places.SearchBox(input);

    if (display.mobile) {
      map.value.controls[google.maps.ControlPosition.LEFT_TOP].push(mobileAppbar);

    } else {
      // map.value.controls[google.maps.ControlPosition.LEFT_TOP].push(input);
    }
    // Bias the SearchBox results towards current map's viewport.
    map.value.addListener("bounds_changed", () => {
      searchBox.setBounds(map.value.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", async () => {
      const places = searchBox.getPlaces();

      // console.log(places);

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      isAddressFromInputSet.value = true;
      await map.value.fitBounds(bounds);
      // marker.setPosition(map.value.getCenter())
      await geocodeCountryFromMarkerLocation(map.value.getCenter());
      if (!isWithinCountry.value) {
        map.value.setCenter(center.value);
        await getAddressFromLatLng(map.value.getCenter());
        fullAddress.value.lat = center.value.lat.toString();
        fullAddress.value.lng = center.value.lng.toString();
        setLocation();

        return;
      } else {
        // console.log('set address from input')
        fullAddress.value.lat = map.value.getCenter().lat().toString();
        fullAddress.value.lng = map.value.getCenter().lng().toString();
        fullAddress.value.title = places[0].name + ", " + places[0].formatted_address;
        setLocation();
        // isAddressFromInputSet.value = true;
      }
    });

    await geocodeCountryFromMyLocation();

    // markersData.forEach(data => {
    //     new google.maps.Marker({
    //         position: new google.maps.LatLng(data.position),
    //         map: map.value,
    //         icon: data.icon
    //     });
    // });
    // marker.addListener("dragend", async () => {

    //   await geocodeCountryFromMarkerLocation(marker.getPosition());
    //   if (!isWithinCountry.value) {

    //     map.value.setCenter(center.value);
    //     marker.setPosition(center.value)

    //     return
    //   }

    //   map.value.setCenter(marker.getPosition());
    //   // console.log(map.value.get)
    //   await getAddressFromLatLng(marker.getPosition());

    //   fullAddress.value.lat = marker.getPosition().lat().toString();
    //   fullAddress.value.lng = marker.getPosition().lng().toString();

    //   setLocation();
    //   // console.log(fullAddress.value);
    // });
    // marker.addListener("click", async () => {
    //   await geocodeCountryFromMarkerLocation(marker.getPosition());
    //   if (!isWithinCountry.value) {

    //     map.value.setCenter(center.value);
    //     marker.setPosition(center.value)

    //     return
    //   }
    //   map.value.setCenter(marker.getPosition());
    //   // console.log(map.value.get)
    //   await getAddressFromLatLng(marker.getPosition());
    //   fullAddress.value.lat = marker.getPosition().lat().toString();
    //   fullAddress.value.lng = marker.getPosition().lng().toString();

    //   setLocation();
    //   // console.log(fullAddress.value);
    // });
    // Update the marker position on map events
    google.maps.event.addListener(map.value, "idle", async function () {
      if (isAddressFromInputSet.value) return;
      await updateMarkerPosition();
    });

    // If you want to update marker on zoom, drag, and other map events
    google.maps.event.addListener(map.value, "zoom_changed", async function () {
      if (isAddressFromInputSet.value) return;
      await updateMarkerPosition();
    });
    google.maps.event.addListener(map.value, "dragend", function () {
      console.log('draaaaged')
      isAddressFromInputSet.value = false;
    });

    // Initial marker position update
    updateMarkerPosition();
  });
};
const getAddressFromLatLng = async (position) => {
  await geocoder.value.geocode({ location: position }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        // console.log("Address: ", results);
        // console.log("Address: " + results[0].formatted_address);
        // console.log("lat: " + results[0].geometry);
        if (!savedEnterLocationAddress.value) {
          savedEnterLocationAddress.value = results;
        }
        fullAddress.value.title = results[0].formatted_address;
      } else {
        console.log("No results found");
      }
    } else {
      console.log("Geocoder failed due to: " + status);
    }
  });
};
const geocodeCountryFromMyLocation = async () => {
  await geocoder.value.geocode(
    { location: center.value },
    (results, status) => {
      if (status === "OK") {
        results.forEach((item) => {
          if (item.types.includes("country")) {
            // console.log(item)
            // console.log(item.formatted_address)
            savedEnterCountry.value = item.formatted_address;
          }
        });
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    }
  );
};
const geocodeCountryFromMarkerLocation = async (position) => {
  await geocoder.value.geocode({ location: position }, (results, status) => {
    if (status === "OK") {
      results.forEach((item) => {
        if (item.types.includes("country")) {
          // console.log(item)
          // console.log(item.formatted_address)
          if (savedEnterCountry.value !== item.formatted_address) {
            isWithinCountry.value = false;
          } else {
            isWithinCountry.value = true;
          }
        }
      });
    } else {
      console.log("Geocoder failed due to: " + status);
    }
  });
};
const geocodeCountryBoundsFromMyLocation = async (countryName) => {
  return new Promise((resolve, reject) => {
    geocoder.value.geocode({ address: countryName }, (results, status) => {
      if (status === "OK" && results[0]) {
        const countryBounds = results[0].geometry.bounds;
        allowedBounds.value.north = countryBounds.getNorthEast().lat();
        allowedBounds.value.south = countryBounds.getSouthWest().lat();
        allowedBounds.value.east = countryBounds.getNorthEast().lng();
        allowedBounds.value.west = countryBounds.getSouthWest().lng();
        console.log("bounds", countryBounds);
        console.log("bounds", allowedBounds.value);
        resolve(countryBounds);
      } else {
        reject("Geocoder failed due to: " + status);
      }
    });
  });
};
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("lat", position.coords.latitude);
      console.log("lng", position.coords.longitude);

      center.value.lat = position.coords.latitude;
      center.value.lng = position.coords.longitude;
      // getAddressFromLatLng(center.value);
    });
  } else {
    // Geolocation is not supported by this browser.
  }
};
const setLocation = () => {
  emit("update:modelValue", fullAddress.value);
  inputValue.value = fullAddress.value.title;
};

watch(
  props,
  (newValue, oldValue) => {

    if (!isDataSet.value) {

      if (newValue.modelValue) {
        isDataSet.value = true;
        fullAddress.value = props.modelValue;
        center.value.lat = parseFloat(props.modelValue.lat);
        center.value.lng = parseFloat(props.modelValue.lng);
        inputValue.value = fullAddress.value.title;
      } else {
        fullAddress.value = {};
        inputValue.value = null;
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  getLocation();

  if (props.modelValue) {
    fullAddress.value = props.modelValue;
    // center.value.lat = parseFloat(props.modelValue.lat);
    // center.value.lng = parseFloat(props.modelValue.lng);
    inputValue.value = fullAddress.value.title;
  } else {
    fullAddress.value = {};
    inputValue.value = null;
  }
});

const {t}=useI18n();
const requiredRule = () => {
  if (!props.required) return [];
  return [(v) => !!v || t('required')];
};
</script>

<template>
  <label class="text-h6 font-weight-medium">{{ props.label }}
    <v-icon color="error" size="10" v-if="required">mdi-asterisk</v-icon></label>

  <v-text-field @click="openDialog" :readonly="true" variant="solo-filled" height="55" color="primary"
    :placeholder="!!fullAddress.title ? fullAddress.title : placeholder" :rules="requiredRule()" v-model="inputValue"
    class="mt-1">
    <template v-slot:prepend-inner>
      <v-icon color="primary">mdi-map-marker-outline</v-icon>
    </template>
  </v-text-field>

  <template v-if="!$vuetify.display.mobile">
    <v-dialog v-model="dialog" max-width="1000">
      <template v-slot:default="{ isActive }">
        <div class="text-end">
          <div class="dialog-card-wrap-mobile-appbar d-flex align-center justify-center">
            <v-btn size="small" class="mobile-back-btn" color="white" @click="isActive.value = false"
              :icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'"></v-btn>
            <input id="pac-input" type="text" class="controls rounded-xl" :placeholder="$t('search_for_address')" />
          </div>
          <v-card rounded="xl" class="location-card-map position-relative">
            <!-- <input id="pac-input" type="text" class="controls rounded-xl" placeholder="Search for address" /> -->
            <div id="get-location-map"></div>
            <img :src="icons.iconMarkerPrimary" alt="" class="marker-img" />
            <v-btn max-width="350px" @click="isActive.value = false" color="primary" width="75%" height="45" rounded="lg"
            class="set-location-btn text-white">
            <template v-slot:prepend>
              <v-icon size="17" class="mt-1">mdi-crosshairs-gps</v-icon>
            </template>
            {{ $t('set_location') }}
          </v-btn>
          </v-card>
        </div>
      </template>
    </v-dialog>
  </template>
  <template v-else>
    <v-dialog transition="dialog-bottom-transition" fullscreen v-model="dialog">
      <template v-slot:default="{ isActive }">
        <div class="dialog-card-wrap-mobile location-card-map">
          <div class="dialog-card-wrap-mobile-appbar d-flex align-center justify-center">
            <v-btn size="small" class="mobile-back-btn" color="white" @click="isActive.value = false"
              :icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'"></v-btn>
            <input id="pac-input" type="text" class="controls rounded-xl" :placeholder="$t('search_for_address')" />
          </div>
          <div id="get-location-map" class="mobile"></div>
          <img :src="icons.iconMarkerPrimary" alt="" class="marker-img" />
          <v-btn @click="isActive.value = false" color="primary" width="75%" height="45" rounded="lg"
            class="set-location-btn text-white">
            <template v-slot:prepend>
              <v-icon size="17" class="mt-1">mdi-crosshairs-gps</v-icon>
            </template>
           {{ $t('set_location') }}
          </v-btn>
        </div>
      </template>
    </v-dialog>
  </template>
</template>

<style lang="scss">
.dialog-card-wrap-mobile {
  width: 100%;
  height: 100vh;
  background-color: #fff !important;

  
}
.set-location-btn {
  position: absolute !important;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.location-card-map {
  .marker-img {
    width: 25px;
    height: 50px;
    position: absolute;
    top: calc(50% - 25px);
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: contain;
    z-index: 1;
    pointer-events: none;
    /* Ensures clicks pass through the image */
  }
}

.dialog-card-wrap-mobile-appbar {
  width: 100%;
  position: absolute;
}



.mobile-back-btn {
  background-color: #fff !important;
  border: 1px solid rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

#get-location-map {
  width: 100%;
  height: 75vh;

  &.mobile {
    height: 100%;
  }
}



.pac-card {
  height: 50px;
  background-color: #fff;
  border: 0;
  border-radius: 2px;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
  margin: 10px;
  padding: 0 0.5em;
  font: 400 18px Roboto, Arial, sans-serif;
  overflow: hidden;
  font-family: Roboto;
  padding: 0;
}

.pac-container {
  padding-bottom: 12px;
  margin-right: 12px;
  z-index: 9999;
}

.pac-controls {
  display: inline-block;
  padding: 5px 11px;
}

.pac-controls label {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 300;
}

#pac-input {
  height: 40px !important;
  background-color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  padding: 0 1.5rem;
  text-overflow: ellipsis;
  width: 80%;
  margin: 15px;
  box-shadow: 0 0 15px #0000002e, 0 0 0 1px rgb(var(--v-theme-primary));
  box-sizing: border-box;
  outline: none;
  border: none;
  // position: absolute;
}

/* #pac-input:focus {
  border-color: #4d90fe;
} */
</style>
