<script setup>
import * as gmaps from "@googlemaps/js-api-loader";
const { Loader } = gmaps;

const config = useRuntimeConfig();

const center = ref({ lat: 0, lng: 0 });
const map = ref(null);



const initializeGoogleMap = async () => {
  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey,
    version: "weekly",
    libraries: ["drawing", "geometry", "places", "visualization"],
    language: "ar",
    region: "EG",
  });

  // Initialize the geocoder

  loader.load().then(async () => {
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
    };

    /*==| INITIAL MAP |==*/
    map.value = new google.maps.Map(mapEl, mapOptions);

   
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
     
    });
  } else {
  }
};

onMounted(() => {
  getLocation();
});
</script>



<template>
  <v-card
    class="direct-request-header-map-card"
    width="100%"
    height="350px"
    elevation="0"
    rounded="lg"
  >
    <div id="direct-request-header-map"></div>
  </v-card>
</template>



<style lang="scss" scoped>
.direct-request-header-map-card {
  position: relative;
  #direct-request-header-map {
    width: 100%;
    height: 100%;
  }
}
</style>