/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref, onMounted, computed, inject } from "vue";
import { useDisplay } from "vuetify";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "vue-router";
import { CampaignStore } from "@/store/CampaignStore";
import { HeroDataRepository } from "@/data/repository/HeroDataRepository";
import { HeroStore } from "@/store/HeroStore";
const campaignStore = CampaignStore();
const campaignList = computed(() => {
    return campaignStore.findAll();
});
const heroStore = HeroStore();
const router = useRouter();
const user = useUserStore().user;
const display = ref(useDisplay());
const assets = inject("assets");
const campFig = (campName) => {
    console.log(campName);
    switch (campName) {
        case 'apocalypse':
            return assets + '/Dashboard/img-campaigncore.png';
        case 'core':
            return "400";
        case 'core':
            return "500";
        case 'core':
            return "500";
        case 'core':
            return "600";
        case 'core':
            return "700";
    }
};
// Configurações de evento para rolagem
onMounted(() => { });
// Verificação de mobile
const isMobile = computed(() => {
    console.log(display.value.mdAndUp);
    return !display.value.mdAndUp;
});
// Dados do carrossel
const carouselItems = ref([
    {
        img: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Dashboard/btn-campaignmanager.png",
        label: "CAMPAIGN MANAGER",
        route: { name: "CampaignTracker" },
    },
    {
        img: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Dashboard/btn-skusmannager.png",
        label: "SKUS MANAGER",
        route: { name: "Library" },
    },
    {
        img: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Dashboard/btn-events3.png",
        label: "EVENTS",
        route: { name: "Events" },
    },
    {
        img: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Dashboard/btn-profile3.png",
        label: "PROFILE",
        route: { name: "PerfilHome" },
    },
]);
const libraryItems = ref([
    {
        name: "COREBOX",
        image: new URL(assets + "/Dashboard/btn-corebox.png", import.meta.url).href,
    },
    {
        name: "DESERT OF HELLSCAR",
        image: new URL(assets + "/Dashboard/btn-hellscar.png", import.meta.url).href,
    },
    {
        name: "APOCALYPSE",
        image: new URL(assets + "/Dashboard/btn-apoc.png", import.meta.url).href,
    },
    {
        name: "AWAKENINGS",
        image: new URL(assets + "/Dashboard/btn-awakenings.png", import.meta.url).href,
    },
]);
// Variáveis reativas
const showPopup = ref(false);
const dialog = ref(false);
const closeDialog = () => {
    dialog.value = false;
};
const openGoogleMaps = (place) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
    window.open(url, "_blank");
};
const heroDataRepository = new HeroDataRepository();
function findHeroes(campaignId) {
    const heroes = [];
    heroStore.findAllInCampaign(campaignId).forEach((hero) => {
        heroes.push(heroDataRepository.find(hero.heroId) ?? {});
    });
    return heroes;
}
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    const __VLS_0 = {}.VMain;
    /** @type { [typeof __VLS_components.VMain, typeof __VLS_components.vMain, typeof __VLS_components.VMain, typeof __VLS_components.vMain, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        ...{ class: ("d-none d-md-flex justify-center align-center ml-16") },
    }));
    const __VLS_8 = __VLS_7({
        ...{ class: ("d-none d-md-flex justify-center align-center ml-16") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        cols: ("12"),
        sm: ("10"),
        md: ("8"),
        ...{ class: ("px-6") },
    }));
    const __VLS_14 = __VLS_13({
        cols: ("12"),
        sm: ("10"),
        md: ("8"),
        ...{ class: ("px-6") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const __VLS_18 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        noGutters: (true),
    }));
    const __VLS_20 = __VLS_19({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const __VLS_24 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        cols: ("4"),
    }));
    const __VLS_26 = __VLS_25({
        cols: ("4"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const __VLS_30 = {}.VAvatar;
    /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        size: ("236"),
        rounded: ("0"),
        ...{ class: ("avatar-overlay") },
    }));
    const __VLS_32 = __VLS_31({
        size: ("236"),
        rounded: ("0"),
        ...{ class: ("avatar-overlay") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    const __VLS_36 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ("Profile"),
        ...{ style: ({}) },
    }));
    const __VLS_38 = __VLS_37({
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ("Profile"),
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_35.slots.default;
    var __VLS_35;
    const __VLS_42 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        ...{ class: ("user_name text-h3") },
    }));
    const __VLS_44 = __VLS_43({
        ...{ class: ("user_name text-h3") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    (__VLS_ctx.user.user_name);
    __VLS_47.slots.default;
    var __VLS_47;
    const __VLS_48 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ class: ("retail_name") },
    }));
    const __VLS_50 = __VLS_49({
        ...{ class: ("retail_name") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_53.slots.default;
    var __VLS_53;
    __VLS_29.slots.default;
    var __VLS_29;
    __VLS_23.slots.default;
    var __VLS_23;
    __VLS_17.slots.default;
    var __VLS_17;
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_54 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
        ...{ class: ("d-md-none justify-center align-center ml-0") },
    }));
    const __VLS_56 = __VLS_55({
        ...{ class: ("d-md-none justify-center align-center ml-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    const __VLS_60 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        color: ("background"),
        ...{ class: ("card-overlay full-screen-card") },
        image: ((__VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png')),
        flat: (true),
    }));
    const __VLS_62 = __VLS_61({
        color: ("background"),
        ...{ class: ("card-overlay full-screen-card") },
        image: ((__VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png')),
        flat: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const __VLS_66 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
        color: ("primary"),
        height: ("136"),
        ...{ class: ("card-overlay1 full-screen-card") },
        flat: (true),
    }));
    const __VLS_68 = __VLS_67({
        color: ("primary"),
        height: ("136"),
        ...{ class: ("card-overlay1 full-screen-card") },
        flat: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    __VLS_65.slots.default;
    var __VLS_65;
    const __VLS_72 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        cols: ("12"),
    }));
    const __VLS_74 = __VLS_73({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    const __VLS_78 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        noGutters: (true),
    }));
    const __VLS_80 = __VLS_79({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const __VLS_84 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        cols: ("8"),
        ...{ class: ("avatar-mobile") },
    }));
    const __VLS_86 = __VLS_85({
        cols: ("8"),
        ...{ class: ("avatar-mobile") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const __VLS_90 = {}.VAvatar;
    /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        size: ("140"),
        rounded: ("0"),
    }));
    const __VLS_92 = __VLS_91({
        size: ("140"),
        rounded: ("0"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    const __VLS_96 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ("Profile"),
        ...{ style: ({}) },
    }));
    const __VLS_98 = __VLS_97({
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ("Profile"),
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_102 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        ...{ class: ("user_name2 text-h5") },
    }));
    const __VLS_104 = __VLS_103({
        ...{ class: ("user_name2 text-h5") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    (__VLS_ctx.user.user_name);
    __VLS_107.slots.default;
    var __VLS_107;
    __VLS_89.slots.default;
    var __VLS_89;
    __VLS_83.slots.default;
    var __VLS_83;
    __VLS_77.slots.default;
    var __VLS_77;
    __VLS_59.slots.default;
    var __VLS_59;
    const __VLS_108 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ class: ("mt-4 d-none d-md-flex justify-center align-center ma-0 w-100") },
    }));
    const __VLS_110 = __VLS_109({
        ...{ class: ("mt-4 d-none d-md-flex justify-center align-center ma-0 w-100") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const __VLS_114 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        cols: ("12"),
        sm: ("12"),
        md: ("8"),
        ...{ class: ("px-6") },
    }));
    const __VLS_116 = __VLS_115({
        cols: ("12"),
        sm: ("12"),
        md: ("8"),
        ...{ class: ("px-6") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    const __VLS_120 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        color: ("primary"),
        height: ("116px"),
        ...{ class: ("move_topo pt-12") },
    }));
    const __VLS_122 = __VLS_121({
        color: ("primary"),
        height: ("116px"),
        ...{ class: ("move_topo pt-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const __VLS_126 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
        color: ("secundary"),
        ...{ class: ("move_topo pt-12") },
    }));
    const __VLS_128 = __VLS_127({
        color: ("secundary"),
        ...{ class: ("move_topo pt-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const __VLS_132 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ class: ("mt-2 d-flex justify-center align-center ma-0 w-100") },
    }));
    const __VLS_134 = __VLS_133({
        ...{ class: ("mt-2 d-flex justify-center align-center ma-0 w-100") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    const __VLS_138 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("ml-5 pt-12") },
    }));
    const __VLS_140 = __VLS_139({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("ml-5 pt-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    if (__VLS_ctx.isMobile) {
        const __VLS_144 = {}.VCarousel;
        /** @type { [typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, ] } */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            height: ((__VLS_ctx.isMobile ? '400px' : 'auto')),
            hideDelimiters: (true),
        }));
        const __VLS_146 = __VLS_145({
            height: ((__VLS_ctx.isMobile ? '400px' : 'auto')),
            hideDelimiters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.carouselItems))) {
            const __VLS_150 = {}.VCarouselItem;
            /** @type { [typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, ] } */ ;
            // @ts-ignore
            const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
                key: ((index)),
            }));
            const __VLS_152 = __VLS_151({
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_151));
            const __VLS_156 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }));
            const __VLS_158 = __VLS_157({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_157));
            const __VLS_162 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
                cols: ("12"),
            }));
            const __VLS_164 = __VLS_163({
                cols: ("12"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_163));
            const __VLS_168 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
                ...{ 'onClick': {} },
                ...{ style: (({ height: __VLS_ctx.isMobile ? '400px' : 'auto' })) },
                ...{ class: ("mx-auto") },
                disabled: ((index > 0 ? true : false)),
            }));
            const __VLS_170 = __VLS_169({
                ...{ 'onClick': {} },
                ...{ style: (({ height: __VLS_ctx.isMobile ? '400px' : 'auto' })) },
                ...{ class: ("mx-auto") },
                disabled: ((index > 0 ? true : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_169));
            let __VLS_174;
            const __VLS_175 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.isMobile)))
                        return;
                    __VLS_ctx.router.push(item.route);
                }
            };
            let __VLS_171;
            let __VLS_172;
            const __VLS_176 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
                ...{ style: ({}) },
                src: ((item.img)),
                height: ("500"),
                cover: (true),
                gradient: ((index > 0
                    ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                    : false)),
            }));
            const __VLS_178 = __VLS_177({
                ...{ style: ({}) },
                src: ((item.img)),
                height: ("500"),
                cover: (true),
                gradient: ((index > 0
                    ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                    : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_177));
            const __VLS_182 = {}.VCardActions;
            /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
            // @ts-ignore
            const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({}));
            const __VLS_184 = __VLS_183({}, ...__VLS_functionalComponentArgsRest(__VLS_183));
            const __VLS_188 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                ...{ class: ("d-flex justify-center") },
            }));
            const __VLS_190 = __VLS_189({
                ...{ class: ("d-flex justify-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            const __VLS_194 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
                ...{ class: ("text-center") },
            }));
            const __VLS_196 = __VLS_195({
                ...{ class: ("text-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_195));
            (item.label);
            __VLS_199.slots.default;
            var __VLS_199;
            __VLS_193.slots.default;
            var __VLS_193;
            __VLS_187.slots.default;
            var __VLS_187;
            if (index > 0) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: ({}) },
                    ...{ class: ("text-center") },
                });
                const __VLS_200 = {}.ComingSoon;
                /** @type { [typeof __VLS_components.ComingSoon, typeof __VLS_components.comingSoon, typeof __VLS_components.ComingSoon, typeof __VLS_components.comingSoon, ] } */ ;
                // @ts-ignore
                const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
                const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
            }
            __VLS_173.slots.default;
            var __VLS_173;
            __VLS_167.slots.default;
            var __VLS_167;
            __VLS_161.slots.default;
            var __VLS_161;
            __VLS_155.slots.default;
            var __VLS_155;
        }
        __VLS_149.slots.default;
        var __VLS_149;
    }
    else {
        const __VLS_206 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
            align: ("center"),
            justify: ("center"),
        }));
        const __VLS_208 = __VLS_207({
            align: ("center"),
            justify: ("center"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_207));
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.carouselItems))) {
            const __VLS_212 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
                cols: ("12"),
                md: ("4"),
                lg: ("3"),
                key: ((index)),
            }));
            const __VLS_214 = __VLS_213({
                cols: ("12"),
                md: ("4"),
                lg: ("3"),
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_213));
            const __VLS_218 = {}.VHover;
            /** @type { [typeof __VLS_components.VHover, typeof __VLS_components.vHover, typeof __VLS_components.VHover, typeof __VLS_components.vHover, ] } */ ;
            // @ts-ignore
            const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({}));
            const __VLS_220 = __VLS_219({}, ...__VLS_functionalComponentArgsRest(__VLS_219));
            {
                const { default: __VLS_thisSlot } = __VLS_223.slots;
                const [{ isHovering, props }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_224 = {}.VCard;
                /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
                // @ts-ignore
                const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
                    ...{ 'onClick': {} },
                    color: ("primary"),
                    ...{ class: (({ 'on-hover': isHovering })) },
                    elevation: ((isHovering ? 12 : 2)),
                    ...(props),
                    disabled: ((index > 3 ? true : false)),
                }));
                const __VLS_226 = __VLS_225({
                    ...{ 'onClick': {} },
                    color: ("primary"),
                    ...{ class: (({ 'on-hover': isHovering })) },
                    elevation: ((isHovering ? 12 : 2)),
                    ...(props),
                    disabled: ((index > 3 ? true : false)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_225));
                let __VLS_230;
                const __VLS_231 = {
                    onClick: (...[$event]) => {
                        if (!(!((__VLS_ctx.isMobile))))
                            return;
                        __VLS_ctx.router.push(item.route);
                    }
                };
                let __VLS_227;
                let __VLS_228;
                const __VLS_232 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
                    src: ((item.img)),
                    height: (true),
                    with: (true),
                    cover: (true),
                    gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
                }));
                const __VLS_234 = __VLS_233({
                    src: ((item.img)),
                    height: (true),
                    with: (true),
                    cover: (true),
                    gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_233));
                __VLS_229.slots.default;
                var __VLS_229;
                __VLS_223.slots['' /* empty slot name completion */];
            }
            var __VLS_223;
            __VLS_217.slots.default;
            var __VLS_217;
        }
        __VLS_211.slots.default;
        var __VLS_211;
    }
    __VLS_143.slots.default;
    var __VLS_143;
    __VLS_137.slots.default;
    var __VLS_137;
    const __VLS_238 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
        noGutters: (true),
        ...{ class: ("justify-center py-6") },
    }));
    const __VLS_240 = __VLS_239({
        noGutters: (true),
        ...{ class: ("justify-center py-6") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    const __VLS_244 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        cols: ("12"),
    }));
    const __VLS_246 = __VLS_245({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    const __VLS_250 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
        ...{ class: ("mx-auto") },
    }));
    const __VLS_252 = __VLS_251({
        ...{ class: ("mx-auto") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    const __VLS_256 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        ...{ class: ("mx-auto text-center") },
    }));
    const __VLS_258 = __VLS_257({
        ...{ class: ("mx-auto text-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    __VLS_261.slots.default;
    var __VLS_261;
    const __VLS_262 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
        ...{ class: ("d-flex justify-center") },
    }));
    const __VLS_264 = __VLS_263({
        ...{ class: ("d-flex justify-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    const __VLS_268 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        ...{ 'onClick': {} },
        variant: ("elevated"),
        color: ("primary"),
    }));
    const __VLS_270 = __VLS_269({
        ...{ 'onClick': {} },
        variant: ("elevated"),
        color: ("primary"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    let __VLS_274;
    const __VLS_275 = {
        onClick: (...[$event]) => {
            __VLS_ctx.router.push({ name: 'Events' });
        }
    };
    let __VLS_271;
    let __VLS_272;
    __VLS_273.slots.default;
    var __VLS_273;
    __VLS_267.slots.default;
    var __VLS_267;
    __VLS_255.slots.default;
    var __VLS_255;
    __VLS_249.slots.default;
    var __VLS_249;
    __VLS_243.slots.default;
    var __VLS_243;
    __VLS_131.slots.default;
    var __VLS_131;
    __VLS_119.slots.default;
    var __VLS_119;
    __VLS_113.slots.default;
    var __VLS_113;
    const __VLS_276 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        ...{ class: ("move_topo2 d-md-none justify-center align-center ") },
    }));
    const __VLS_278 = __VLS_277({
        ...{ class: ("move_topo2 d-md-none justify-center align-center ") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    const __VLS_282 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-0") },
    }));
    const __VLS_284 = __VLS_283({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_283));
    const __VLS_288 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        ...{ class: ("d-sm justify-center align-center ma-0 w-100") },
        justify: ("center"),
    }));
    const __VLS_290 = __VLS_289({
        ...{ class: ("d-sm justify-center align-center ma-0 w-100") },
        justify: ("center"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.carouselItems))) {
        const __VLS_294 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
            cols: ("6"),
            key: ((index)),
        }));
        const __VLS_296 = __VLS_295({
            cols: ("6"),
            key: ((index)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_295));
        const __VLS_300 = {}.VHover;
        /** @type { [typeof __VLS_components.VHover, typeof __VLS_components.vHover, typeof __VLS_components.VHover, typeof __VLS_components.vHover, ] } */ ;
        // @ts-ignore
        const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({}));
        const __VLS_302 = __VLS_301({}, ...__VLS_functionalComponentArgsRest(__VLS_301));
        {
            const { default: __VLS_thisSlot } = __VLS_305.slots;
            const [{ isHovering, props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_306 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
                ...{ 'onClick': {} },
                ...{ class: (({ 'on-hover': isHovering })) },
                elevation: ((isHovering ? 12 : 2)),
                ...(props),
                disabled: ((index > 3 ? true : false)),
            }));
            const __VLS_308 = __VLS_307({
                ...{ 'onClick': {} },
                ...{ class: (({ 'on-hover': isHovering })) },
                elevation: ((isHovering ? 12 : 2)),
                ...(props),
                disabled: ((index > 3 ? true : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_307));
            let __VLS_312;
            const __VLS_313 = {
                onClick: (...[$event]) => {
                    __VLS_ctx.router.push(item.route);
                }
            };
            let __VLS_309;
            let __VLS_310;
            const __VLS_314 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
                src: ((item.img)),
                height: (true),
                with: (true),
                cover: (true),
                gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
            }));
            const __VLS_316 = __VLS_315({
                src: ((item.img)),
                height: (true),
                with: (true),
                cover: (true),
                gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_315));
            __VLS_311.slots.default;
            var __VLS_311;
            __VLS_305.slots['' /* empty slot name completion */];
        }
        var __VLS_305;
        __VLS_299.slots.default;
        var __VLS_299;
    }
    __VLS_293.slots.default;
    var __VLS_293;
    const __VLS_320 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
        noGutters: (true),
        ...{ class: ("justify-center py-6") },
    }));
    const __VLS_322 = __VLS_321({
        noGutters: (true),
        ...{ class: ("justify-center py-6") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_321));
    const __VLS_326 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
        cols: ("12"),
    }));
    const __VLS_328 = __VLS_327({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_327));
    const __VLS_332 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        ...{ class: ("mx-auto") },
    }));
    const __VLS_334 = __VLS_333({
        ...{ class: ("mx-auto") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    const __VLS_338 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({
        ...{ class: ("mx-auto text-center") },
    }));
    const __VLS_340 = __VLS_339({
        ...{ class: ("mx-auto text-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_339));
    __VLS_343.slots.default;
    var __VLS_343;
    const __VLS_344 = {}.VCardActions;
    /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
    // @ts-ignore
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
        ...{ class: ("d-flex justify-center") },
    }));
    const __VLS_346 = __VLS_345({
        ...{ class: ("d-flex justify-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    const __VLS_350 = {}.VBtn;
    /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
    // @ts-ignore
    const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({
        ...{ 'onClick': {} },
        color: ("primary"),
    }));
    const __VLS_352 = __VLS_351({
        ...{ 'onClick': {} },
        color: ("primary"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_351));
    let __VLS_356;
    const __VLS_357 = {
        onClick: (...[$event]) => {
            __VLS_ctx.router.push({ name: 'Events' });
        }
    };
    let __VLS_353;
    let __VLS_354;
    __VLS_355.slots.default;
    var __VLS_355;
    __VLS_349.slots.default;
    var __VLS_349;
    __VLS_337.slots.default;
    var __VLS_337;
    __VLS_331.slots.default;
    var __VLS_331;
    __VLS_325.slots.default;
    var __VLS_325;
    __VLS_287.slots.default;
    var __VLS_287;
    __VLS_281.slots.default;
    var __VLS_281;
    __VLS_5.slots.default;
    var __VLS_5;
    ['d-none', 'd-md-flex', 'justify-center', 'align-center', 'ml-16', 'px-6', 'avatar-overlay', 'user_name', 'text-h3', 'retail_name', 'd-md-none', 'justify-center', 'align-center', 'ml-0', 'card-overlay', 'full-screen-card', 'card-overlay1', 'full-screen-card', 'avatar-mobile', 'user_name2', 'text-h5', 'mt-4', 'd-none', 'd-md-flex', 'justify-center', 'align-center', 'ma-0', 'w-100', 'px-6', 'move_topo', 'pt-12', 'move_topo', 'pt-12', 'mt-2', 'd-flex', 'justify-center', 'align-center', 'ma-0', 'w-100', 'ml-5', 'pt-12', 'justify-center', 'mx-auto', 'd-flex', 'justify-center', 'text-center', 'text-center', 'on-hover', 'justify-center', 'py-6', 'mx-auto', 'mx-auto', 'text-center', 'd-flex', 'justify-center', 'move_topo2', 'd-md-none', 'justify-center', 'align-center', 'px-0', 'd-sm', 'justify-center', 'align-center', 'ma-0', 'w-100', 'on-hover', 'justify-center', 'py-6', 'mx-auto', 'mx-auto', 'text-center', 'd-flex', 'justify-center',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            router: router,
            user: user,
            assets: assets,
            isMobile: isMobile,
            carouselItems: carouselItems,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
