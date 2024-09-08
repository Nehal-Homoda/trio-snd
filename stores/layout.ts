/*##########[ IMPORTS ]##########*/
import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", () => {
    /*##########[ DEFINES ]##########*/
    /*##########[ STATE ]##########*/
    const isVuetifyReady = ref(false);
    const footerLinks = ref([
        {link: '/', t_name: 'how_we_are'},
        {link: '/about', t_name: 'contact_us'},
        {link: '/contact', t_name: 'pack_now'},
    ])
    /*##########[ COMPUTED ]##########*/
    /*##########[ MUTATIONS ]##########*/
    /*##########[ ACTIONS ]##########*/

    return {
        footerLinks,
        isVuetifyReady
    };
});