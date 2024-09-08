<template>
    <div class="color-mode-toggle">
        <v-btn :icon="modes[selectedModeIndex].icon" color="primary" variant="outlined" size="small"
            @click="themeToggleHandlar"></v-btn>
    </div>
</template>

<script setup>
const colorMode = useColorMode();
const theme = useTheme();
const modes = Object.values({
    "1": {
        slug: 'system',
        icon: 'mdi-laptop'
    },
    "2": {
        slug: 'light',
        icon: 'mdi-weather-sunny'
    },
    "3": {
        slug: 'dark',
        icon: 'mdi-weather-night'
    },
});
const selectedModeIndex = ref(1);
const config = useRuntimeConfig();
const colorModeCookie = useCookie('colorModeCookie');


const themeToggleHandlar = () => {

    selectedModeIndex.value++;

    selectedModeIndex.value = selectedModeIndex.value >= modes.length ? 0 : selectedModeIndex.value;
    colorMode.preference = modes[selectedModeIndex.value].slug;

}
const setPreference = (mode) => {

    modes.forEach((item, index) => {
        if (item.slug === colorMode.preference) {
            selectedModeIndex.value = index;
        }
    })
}

watch(colorMode, (newValue) => {
    // setPreference(colorMode.preference);
    theme.global.name.value = newValue.value;
    colorModeCookie.value = theme.global.name.value;

    modes.forEach((item, index) => {
        if (item.slug === colorMode.preference) {
            selectedModeIndex.value = index;
        }
    })

}, { deep: true })

onMounted(() => {

    setPreference(colorMode.preference);
    theme.global.name.value = colorMode.value;
})

</script>

<style lang="scss"></style>