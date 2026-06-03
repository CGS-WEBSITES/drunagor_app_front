/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import UserLibraryWidget from "@/components/UserLibraryWidget.vue";
import RecentCampaignWidget from "@/components/RecentCampaignWidget.vue";
import { useUserStore } from "@/store/UserStore";
const userStore = useUserStore();
const buttons = [
    { icon: "mdi-account", value: "profile" },
    { icon: "mdi-square-edit-outline", value: "edit" },
    { icon: "mdi-magnify", value: "search" },
    { icon: "mdi-account-group", value: "group" },
    { icon: "mdi-cog-outline", value: "settings" },
    { icon: "mdi-logout", value: "logout" },
];
// Dados das estatísticas
const statsData = [
    { category: "Statistic Category", name: "Statistic name [10/100] %total%" },
    { category: "Statistic Category", name: "Statistic name: 97 TIMES" },
    { category: "Statistic Category", name: "Statistic name [10/100] %total%" },
];
// Dados das conquistas
const achievementsData = [
    {
        image: "https://i.ibb.co/9cBwVj9/Rectangle12213121.png",
        title: "GREAT ACHIEVEMENT",
        description: "Achievement short description here cabe duas",
        date: "11/11/2024",
        icon: "mdi-trophy",
        progress: "15/43",
    },
    {
        image: "https://i.ibb.co/9cBwVj9/Rectangle12213121.png",
        title: "GREAT ACHIEVEMENT",
        description: "Achievement short description here cabe duas",
        date: "11/11/2024",
        icon: "mdi-trophy",
        progress: "15/43",
    },
    {
        image: "https://i.ibb.co/9cBwVj9/Rectangle12213121.png",
        title: "GREAT ACHIEVEMENT",
        description: "Achievement short description here cabe duas",
        date: "11/11/2024",
        icon: "mdi-trophy",
        progress: "15/43",
    },
    // Adicione mais conquistas conforme necessário
];
const badgesData = [
    {
        image: "https://i.ibb.co/8MQPSjg/Rectangle121.webp", // Substituir pelo caminho da imagem
        title: "BADGE FODA 1",
        description: "MT MIDIAAAAA",
        date: "11/11/2024",
        icon: "mdi-police-badge",
        progress: "15/43",
    },
    {
        image: "https://i.ibb.co/8MQPSjg/Rectangle121.webp",
        title: "BADGE FODA 2",
        description: "MT MIDAAAA 2",
        date: "11/11/2024",
        icon: "mdi-police-badge",
        progress: "15/43",
    },
    {
        image: "https://i.ibb.co/8MQPSjg/Rectangle121.webp",
        title: "BADGE FODA 3",
        description: "MT MIDIAAAAA 3",
        date: "11/11/2024",
        icon: "mdi-police-badge",
        progress: "15/43",
    },
    // Adicione mais conquistas conforme necessário
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Badges;
/** @type {[typeof __VLS_components.Badges, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.userStore.user?.users_pk) {
    /** @type {[typeof RecentCampaignWidget, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(RecentCampaignWidget, new RecentCampaignWidget({
        userId: (__VLS_ctx.userStore.user?.users_pk),
    }));
    const __VLS_5 = __VLS_4({
        userId: (__VLS_ctx.userStore.user?.users_pk),
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
}
if (__VLS_ctx.userStore.user?.users_pk) {
    /** @type {[typeof UserLibraryWidget, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(UserLibraryWidget, new UserLibraryWidget({
        userId: (__VLS_ctx.userStore.user?.users_pk),
        userName: (__VLS_ctx.userStore.user?.user_name),
    }));
    const __VLS_8 = __VLS_7({
        userId: (__VLS_ctx.userStore.user?.users_pk),
        userName: (__VLS_ctx.userStore.user?.user_name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UserLibraryWidget: UserLibraryWidget,
            RecentCampaignWidget: RecentCampaignWidget,
            userStore: userStore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
