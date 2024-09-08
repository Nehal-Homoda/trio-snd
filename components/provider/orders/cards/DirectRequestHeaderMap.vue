<script setup>
import { icons } from "~/core/manager/AssetsManager";
import * as gmaps from "@googlemaps/js-api-loader";
const { Loader } = gmaps;
import mapStyle from '~/assets/gmap-style/gmapStyle.json';

defineProps(['providers'])

const display = useDisplay()

const config = useRuntimeConfig();

const center = ref({ lat: 0, lng: 0 });
const map = ref(null);

const markersData = [
    { position: { lat: 40.7128, lng: -74.006 }, icon: icons.iconMarkerPrimary }, // New York
    { position: { lat: 34.0522, lng: -118.2437 }, icon: icons.iconMarkerPrimary }, // Los Angeles
    { position: { lat: 41.8781, lng: -87.6298 }, icon: icons.iconMarkerPrimary }, // Chicago
];
const markers = ref([]);


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
        const mapEl = document.querySelector("#direct-request-header-map");

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

    });
};
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("lat", position.coords.latitude);
            console.log("lng", position.coords.longitude);

            center.value.lat = position.coords.latitude;
            center.value.lng = position.coords.longitude;
            initializeGoogleMap();
            // getAddressFromLatLng(center.value);
        });
    } else {
        // Geolocation is not supported by this browser.
    }
};


onMounted(() => {
    getLocation();
    
});

</script>

<template>
    <v-card class="direct-request-header-map-card" width="100%" height="350px" elevation="0" rounded="lg">
        <div id="direct-request-header-map"></div>
        <div class="content-wrap-overlay">
            <img :src="icons.iconMarkerPrimary" alt="" class="marker-img" />
            <ProviderOrdersCardsListingMap :providers="providers" />
        </div>
    </v-card>
</template>

<style scoped lang="scss">
.direct-request-header-map-card {
    position: relative;

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

        .marker-img {
            width: 25px;
            height: 50px;
            object-fit: contain;
            display: block;
        }
    }

    #direct-request-header-map {
        width: 100%;
        height: 100%;
    }
}

</style>
