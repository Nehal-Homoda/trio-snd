<script setup>
import { icons } from "~/core/manager/AssetsManager";
import * as gmaps from "@googlemaps/js-api-loader";
const { Loader } = gmaps;
import mapStyle from '~/assets/gmap-style/gmapStyle.json';
const display = useDisplay()

const config = useRuntimeConfig();
const props = defineProps([
    "providers",
]);

const center = ref({ lat: 0, lng: 0 });
const map = ref(null);
const dialog = ref(false);
const selectedProvider = ref(null);

const openDialog = () => {
    dialog.value = true;
    initializeGoogleMap();
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
        const mapEl = document.querySelector("#providers-listing-map");

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

        // const marker = new google.maps.Marker({
        //   position: new google.maps.LatLng(center.value),
        //   map: map.value,
        //   icon: icons.iconMarkerPrimary,
        //   // optimized: false // Ensure marker is re-rendered on each position change
        //   draggable: true,
        //   clickable: true,
        // });

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
            await map.value.fitBounds(bounds);

        });

        props.providers.forEach(data => {

            const providerMarker = new google.maps.Marker({
                position: new google.maps.LatLng({ lat: parseFloat(data.lat), lng: parseFloat(data.lng) }),
                map: map.value,
                icon: icons.iconMarkerPrimary
            });
            providerMarker.addListener('click', () => {
                selectedProvider.value = data
                console.log(selectedProvider.value)

            })

        });
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

onMounted(() => {
    getLocation();
});

const requiredRule = () => {
    if (!props.required) return [];
    return [(v) => !!v || "required"];
};
</script>

<template>

    <v-btn @click="openDialog" class="text-white px-7 font-weight-bold font-size-small" height="40" rounded="lg"
        color="primary">{{ $t('show_on_map') }}</v-btn>


    <!-- DESKTOP -->
    <template v-if="!$vuetify.display.mobile">
        <v-dialog v-model="dialog" max-width="1000">
            <template v-slot:default="{ isActive }">
                <div class="text-end">
                    <!-- MAP INPUT APPBAR -->
                    <div class="dialog-card-wrap-mobile-appbar d-flex align-center justify-center">
                        <v-btn size="small" class="mobile-back-btn" color="white" @click="isActive.value = false"
                            :icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'"></v-btn>
                        <input id="pac-input" type="text" class="controls rounded-xl"
                            :placeholder="$t('search_for_address')" />
                    </div>
                    <!-- MAP -->
                    <v-card rounded="xl" class="location-card-map position-relative">
                        <!-- <input id="pac-input" type="text" class="controls rounded-xl" placeholder="Search for address" /> -->
                        <div id="providers-listing-map"></div>
                        <Transition name="fade">
                            <div v-if="selectedProvider" @click.self="selectedProvider = null"
                                class="content-wrap-overlay  px-10">
                                <ProviderOrdersCardsDirectRequestCard :available-provider="selectedProvider" />
                            </div>
                        </Transition>
                    </v-card>
                </div>
            </template>
        </v-dialog>
    </template>
    <!-- MOBILE -->
    <template v-else>
        <v-dialog transition="dialog-bottom-transition" fullscreen v-model="dialog">
            <template v-slot:default="{ isActive }">
                <div class="dialog-card-wrap-mobile location-card-map">
                    <!-- MAP INPUT APPBAR -->
                    <div class="dialog-card-wrap-mobile-appbar d-flex align-center justify-center">
                        <v-btn size="small" class="mobile-back-btn" color="white" @click="isActive.value = false"
                            :icon="$vuetify.locale.isRtl ? 'mdi-arrow-right' : 'mdi-arrow-left'"></v-btn>
                        <input id="pac-input" type="text" class="controls rounded-xl"
                            :placeholder="$t('search_for_address')" />
                    </div>
                    <!-- MAP -->
                    <div id="providers-listing-map" class="mobile"></div>
                    <Transition name="fade">
                        <div v-if="selectedProvider" @click.self="selectedProvider = null" class="content-wrap-overlay px-10">
                            <ProviderOrdersCardsDirectRequestCard :available-provider="selectedProvider" />
                        </div>
                    </Transition>
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

    .set-location-btn {
        position: absolute;
        bottom: 3%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
    }

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

#providers-listing-map {
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

.content-wrap-overlay {
    width: 100%;
    height: 100%;
    background-color: #0000004c;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 91;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

}

/* #pac-input:focus {
  border-color: #4d90fe;
} */
</style>
