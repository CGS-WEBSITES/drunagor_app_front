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
        img: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Dashboard/btn-companion.png",
        label: "COMPANION",
        route: { name: "CampaignTracker" },
    },
    {
        img: "https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Dashboard/btn-library3.png",
        label: "LIBRARY",
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
        ...{ class: ("avatar-overlayuser") },
    }));
    const __VLS_32 = __VLS_31({
        size: ("236"),
        rounded: ("0"),
        ...{ class: ("avatar-overlayuser") },
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
        ...{ class: ("user_nameuser text-h3") },
    }));
    const __VLS_44 = __VLS_43({
        ...{ class: ("user_nameuser text-h3") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    (__VLS_ctx.user.user_name);
    __VLS_47.slots.default;
    var __VLS_47;
    __VLS_29.slots.default;
    var __VLS_29;
    __VLS_23.slots.default;
    var __VLS_23;
    __VLS_17.slots.default;
    var __VLS_17;
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_48 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ class: ("d-md-none justify-center align-center ml-0") },
    }));
    const __VLS_50 = __VLS_49({
        ...{ class: ("d-md-none justify-center align-center ml-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_54 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
        color: ("background"),
        ...{ class: ("card-overlay full-screen-card") },
        image: ((__VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png')),
        flat: (true),
    }));
    const __VLS_56 = __VLS_55({
        color: ("background"),
        ...{ class: ("card-overlay full-screen-card") },
        image: ((__VLS_ctx.assets + '/Profile/profile-bg-warriors-transparent.png')),
        flat: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    const __VLS_60 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        color: ("primary"),
        height: ("136"),
        ...{ class: ("card-overlay1 full-screen-card") },
        flat: (true),
    }));
    const __VLS_62 = __VLS_61({
        color: ("primary"),
        height: ("136"),
        ...{ class: ("card-overlay1 full-screen-card") },
        flat: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_59.slots.default;
    var __VLS_59;
    const __VLS_66 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
        cols: ("12"),
    }));
    const __VLS_68 = __VLS_67({
        cols: ("12"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    const __VLS_72 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        noGutters: (true),
    }));
    const __VLS_74 = __VLS_73({
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    const __VLS_78 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        cols: ("8"),
        ...{ class: ("avatar-mobile") },
    }));
    const __VLS_80 = __VLS_79({
        cols: ("8"),
        ...{ class: ("avatar-mobile") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const __VLS_84 = {}.VAvatar;
    /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        size: ("140"),
        rounded: ("0"),
    }));
    const __VLS_86 = __VLS_85({
        size: ("140"),
        rounded: ("0"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const __VLS_90 = {}.VImg;
    /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ("Profile"),
        ...{ style: ({}) },
    }));
    const __VLS_92 = __VLS_91({
        src: ((__VLS_ctx.user.picture_hash
            ? __VLS_ctx.assets + '/Profile/' + __VLS_ctx.user.picture_hash
            : __VLS_ctx.assets + '/Profile/user.png')),
        alt: ("Profile"),
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    __VLS_89.slots.default;
    var __VLS_89;
    const __VLS_96 = {}.VCardTitle;
    /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ class: ("user_name2 text-h5") },
    }));
    const __VLS_98 = __VLS_97({
        ...{ class: ("user_name2 text-h5") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    (__VLS_ctx.user.user_name);
    __VLS_101.slots.default;
    var __VLS_101;
    __VLS_83.slots.default;
    var __VLS_83;
    __VLS_77.slots.default;
    var __VLS_77;
    __VLS_71.slots.default;
    var __VLS_71;
    __VLS_53.slots.default;
    var __VLS_53;
    const __VLS_102 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        ...{ class: ("mt-4 d-none d-md-flex justify-center align-center ma-0 w-100") },
    }));
    const __VLS_104 = __VLS_103({
        ...{ class: ("mt-4 d-none d-md-flex justify-center align-center ma-0 w-100") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    const __VLS_108 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        cols: ("12"),
        sm: ("12"),
        md: ("8"),
        ...{ class: ("px-6") },
    }));
    const __VLS_110 = __VLS_109({
        cols: ("12"),
        sm: ("12"),
        md: ("8"),
        ...{ class: ("px-6") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const __VLS_114 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        color: ("primary"),
        height: ("116px"),
        ...{ class: ("move_topouser pt-12") },
    }));
    const __VLS_116 = __VLS_115({
        color: ("primary"),
        height: ("116px"),
        ...{ class: ("move_topouser pt-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    const __VLS_120 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        color: ("secundary"),
        ...{ class: ("move_topouser pt-12") },
    }));
    const __VLS_122 = __VLS_121({
        color: ("secundary"),
        ...{ class: ("move_topouser pt-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const __VLS_126 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
        ...{ class: ("mt-2 d-flex justify-center align-center ma-0 w-100") },
    }));
    const __VLS_128 = __VLS_127({
        ...{ class: ("mt-2 d-flex justify-center align-center ma-0 w-100") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const __VLS_132 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("ml-5 pt-12") },
    }));
    const __VLS_134 = __VLS_133({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("ml-5 pt-12") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    if (__VLS_ctx.isMobile) {
        const __VLS_138 = {}.VCarousel;
        /** @type { [typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, ] } */ ;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
            height: ((__VLS_ctx.isMobile ? '400px' : 'auto')),
            hideDelimiters: (true),
        }));
        const __VLS_140 = __VLS_139({
            height: ((__VLS_ctx.isMobile ? '400px' : 'auto')),
            hideDelimiters: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.carouselItems))) {
            const __VLS_144 = {}.VCarouselItem;
            /** @type { [typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, ] } */ ;
            // @ts-ignore
            const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
                key: ((index)),
            }));
            const __VLS_146 = __VLS_145({
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_145));
            const __VLS_150 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }));
            const __VLS_152 = __VLS_151({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_151));
            const __VLS_156 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
                cols: ("12"),
            }));
            const __VLS_158 = __VLS_157({
                cols: ("12"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_157));
            const __VLS_162 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
                ...{ 'onClick': {} },
                ...{ style: (({ height: __VLS_ctx.isMobile ? '400px' : 'auto' })) },
                ...{ class: ("mx-auto") },
                disabled: ((index > 0 ? true : false)),
            }));
            const __VLS_164 = __VLS_163({
                ...{ 'onClick': {} },
                ...{ style: (({ height: __VLS_ctx.isMobile ? '400px' : 'auto' })) },
                ...{ class: ("mx-auto") },
                disabled: ((index > 0 ? true : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_163));
            let __VLS_168;
            const __VLS_169 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.isMobile)))
                        return;
                    __VLS_ctx.router.push(item.route);
                }
            };
            let __VLS_165;
            let __VLS_166;
            const __VLS_170 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
                ...{ style: ({}) },
                src: ((item.img)),
                height: ("500"),
                cover: (true),
                gradient: ((index > 0
                    ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                    : false)),
            }));
            const __VLS_172 = __VLS_171({
                ...{ style: ({}) },
                src: ((item.img)),
                height: ("500"),
                cover: (true),
                gradient: ((index > 0
                    ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)'
                    : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_171));
            const __VLS_176 = {}.VCardActions;
            /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
            // @ts-ignore
            const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
            const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
            const __VLS_182 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
                ...{ class: ("d-flex justify-center") },
            }));
            const __VLS_184 = __VLS_183({
                ...{ class: ("d-flex justify-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_183));
            const __VLS_188 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                ...{ class: ("text-center") },
            }));
            const __VLS_190 = __VLS_189({
                ...{ class: ("text-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            (item.label);
            __VLS_193.slots.default;
            var __VLS_193;
            __VLS_187.slots.default;
            var __VLS_187;
            __VLS_181.slots.default;
            var __VLS_181;
            if (index > 0) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: ({}) },
                    ...{ class: ("text-center") },
                });
                const __VLS_194 = {}.ComingSoon;
                /** @type { [typeof __VLS_components.ComingSoon, typeof __VLS_components.comingSoon, typeof __VLS_components.ComingSoon, typeof __VLS_components.comingSoon, ] } */ ;
                // @ts-ignore
                const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({}));
                const __VLS_196 = __VLS_195({}, ...__VLS_functionalComponentArgsRest(__VLS_195));
            }
            __VLS_167.slots.default;
            var __VLS_167;
            __VLS_161.slots.default;
            var __VLS_161;
            __VLS_155.slots.default;
            var __VLS_155;
            __VLS_149.slots.default;
            var __VLS_149;
        }
        __VLS_143.slots.default;
        var __VLS_143;
    }
    else {
        const __VLS_200 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            align: ("center"),
            justify: ("center"),
        }));
        const __VLS_202 = __VLS_201({
            align: ("center"),
            justify: ("center"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.carouselItems))) {
            const __VLS_206 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
                cols: ("12"),
                md: ("4"),
                lg: ("3"),
                key: ((index)),
            }));
            const __VLS_208 = __VLS_207({
                cols: ("12"),
                md: ("4"),
                lg: ("3"),
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_207));
            const __VLS_212 = {}.VHover;
            /** @type { [typeof __VLS_components.VHover, typeof __VLS_components.vHover, typeof __VLS_components.VHover, typeof __VLS_components.vHover, ] } */ ;
            // @ts-ignore
            const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({}));
            const __VLS_214 = __VLS_213({}, ...__VLS_functionalComponentArgsRest(__VLS_213));
            {
                const { default: __VLS_thisSlot } = __VLS_217.slots;
                const [{ isHovering, props }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_218 = {}.VCard;
                /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
                // @ts-ignore
                const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
                    ...{ 'onClick': {} },
                    ...{ class: (({ 'on-hover': isHovering })) },
                    elevation: ((isHovering ? 12 : 2)),
                    ...(props),
                    disabled: ((index > 3 ? true : false)),
                }));
                const __VLS_220 = __VLS_219({
                    ...{ 'onClick': {} },
                    ...{ class: (({ 'on-hover': isHovering })) },
                    elevation: ((isHovering ? 12 : 2)),
                    ...(props),
                    disabled: ((index > 3 ? true : false)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_219));
                let __VLS_224;
                const __VLS_225 = {
                    onClick: (...[$event]) => {
                        if (!(!((__VLS_ctx.isMobile))))
                            return;
                        __VLS_ctx.router.push(item.route);
                    }
                };
                let __VLS_221;
                let __VLS_222;
                const __VLS_226 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
                    src: ((item.img)),
                    gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
                }));
                const __VLS_228 = __VLS_227({
                    src: ((item.img)),
                    gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_227));
                __VLS_223.slots.default;
                var __VLS_223;
                __VLS_217.slots['' /* empty slot name completion */];
            }
            var __VLS_217;
            __VLS_211.slots.default;
            var __VLS_211;
        }
        __VLS_205.slots.default;
        var __VLS_205;
    }
    __VLS_137.slots.default;
    var __VLS_137;
    __VLS_131.slots.default;
    var __VLS_131;
    const __VLS_232 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        ...{ class: ("mt-4 d-flex justify-center align-center  py-6") },
        noGutters: (true),
    }));
    const __VLS_234 = __VLS_233({
        ...{ class: ("mt-4 d-flex justify-center align-center  py-6") },
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    const __VLS_238 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-5 mb-0") },
    }));
    const __VLS_240 = __VLS_239({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-5 mb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    if (__VLS_ctx.campaignList.length > 0) {
        const __VLS_244 = {}.VCarousel;
        /** @type { [typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, ] } */ ;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
            hideDelimiters: (true),
            height: ((__VLS_ctx.isMobile ? '400px' : 'auto')),
        }));
        const __VLS_246 = __VLS_245({
            hideDelimiters: (true),
            height: ((__VLS_ctx.isMobile ? '400px' : 'auto')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.campaignStore.findAll()))) {
            const __VLS_250 = {}.VCarouselItem;
            /** @type { [typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, ] } */ ;
            // @ts-ignore
            const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
                key: ((index)),
            }));
            const __VLS_252 = __VLS_251({
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_251));
            const __VLS_256 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }));
            const __VLS_258 = __VLS_257({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_257));
            const __VLS_262 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
                cols: ("10"),
                sm: ("10"),
                md: ("12"),
            }));
            const __VLS_264 = __VLS_263({
                cols: ("10"),
                sm: ("10"),
                md: ("12"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_263));
            const __VLS_268 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
                ...{ 'onClick': {} },
                color: ("primary"),
                ...{ class: ("mx-auto") },
            }));
            const __VLS_270 = __VLS_269({
                ...{ 'onClick': {} },
                color: ("primary"),
                ...{ class: ("mx-auto") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_269));
            let __VLS_274;
            const __VLS_275 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.campaignList.length > 0)))
                        return;
                    __VLS_ctx.router.push({
                        name: 'Campaign',
                        params: { id: item.campaignId },
                    });
                }
            };
            let __VLS_271;
            let __VLS_272;
            if (item.campaign === 'core') {
                const __VLS_276 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
                    src: ("https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"),
                    cover: (true),
                }));
                const __VLS_278 = __VLS_277({
                    src: ("https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"),
                    cover: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_277));
            }
            else if (item.campaign === 'apocalypse') {
                const __VLS_282 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
                    src: ("https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"),
                    cover: (true),
                }));
                const __VLS_284 = __VLS_283({
                    src: ("https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"),
                    cover: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_283));
            }
            else if (item.campaign === 'awakenings') {
                const __VLS_288 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
                    src: ("https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"),
                    cover: (true),
                }));
                const __VLS_290 = __VLS_289({
                    src: ("https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"),
                    cover: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_289));
            }
            if (item.name) {
                const __VLS_294 = {}.VCardTitle;
                /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
                // @ts-ignore
                const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
                    ...{ class: ("text-uppercase") },
                }));
                const __VLS_296 = __VLS_295({
                    ...{ class: ("text-uppercase") },
                }, ...__VLS_functionalComponentArgsRest(__VLS_295));
                (item.name);
                __VLS_299.slots.default;
                var __VLS_299;
            }
            const __VLS_300 = {}.VCardText;
            /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
            // @ts-ignore
            const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({}));
            const __VLS_302 = __VLS_301({}, ...__VLS_functionalComponentArgsRest(__VLS_301));
            const __VLS_306 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
                noGutters: (true),
            }));
            const __VLS_308 = __VLS_307({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_307));
            for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.findHeroes(item.campaignId)))) {
                const __VLS_312 = {}.VCol;
                /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
                // @ts-ignore
                const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
                    ...{ class: ("d-flex") },
                    key: ((hero.heroId)),
                }));
                const __VLS_314 = __VLS_313({
                    ...{ class: ("d-flex") },
                    key: ((hero.heroId)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_313));
                const __VLS_318 = {}.VAvatar;
                /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
                // @ts-ignore
                const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
                    rounded: ("0"),
                    image: ((hero.images.avatar)),
                    size: ("120"),
                }));
                const __VLS_320 = __VLS_319({
                    rounded: ("0"),
                    image: ((hero.images.avatar)),
                    size: ("120"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_319));
                __VLS_317.slots.default;
                var __VLS_317;
            }
            __VLS_311.slots.default;
            var __VLS_311;
            __VLS_305.slots.default;
            var __VLS_305;
            __VLS_273.slots.default;
            var __VLS_273;
            __VLS_267.slots.default;
            var __VLS_267;
            __VLS_261.slots.default;
            var __VLS_261;
            __VLS_255.slots.default;
            var __VLS_255;
        }
        __VLS_249.slots.default;
        var __VLS_249;
    }
    else {
        const __VLS_324 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
            noGutters: (true),
            ...{ class: ("justify-center py-6") },
        }));
        const __VLS_326 = __VLS_325({
            noGutters: (true),
            ...{ class: ("justify-center py-6") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_325));
        const __VLS_330 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({
            cols: ("12"),
        }));
        const __VLS_332 = __VLS_331({
            cols: ("12"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_331));
        const __VLS_336 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
            ...{ class: ("mx-auto") },
        }));
        const __VLS_338 = __VLS_337({
            ...{ class: ("mx-auto") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_337));
        const __VLS_342 = {}.VCardTitle;
        /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
        // @ts-ignore
        const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
            ...{ class: ("mx-auto text-center") },
        }));
        const __VLS_344 = __VLS_343({
            ...{ class: ("mx-auto text-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_343));
        __VLS_347.slots.default;
        var __VLS_347;
        const __VLS_348 = {}.VCardActions;
        /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
        // @ts-ignore
        const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
            ...{ class: ("d-flex justify-center") },
        }));
        const __VLS_350 = __VLS_349({
            ...{ class: ("d-flex justify-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_349));
        const __VLS_354 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({
            ...{ 'onClick': {} },
        }));
        const __VLS_356 = __VLS_355({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_355));
        let __VLS_360;
        const __VLS_361 = {
            onClick: (...[$event]) => {
                if (!(!((__VLS_ctx.campaignList.length > 0))))
                    return;
                __VLS_ctx.router.push({ name: 'Campaign Overview' });
            }
        };
        let __VLS_357;
        let __VLS_358;
        __VLS_359.slots.default;
        var __VLS_359;
        __VLS_353.slots.default;
        var __VLS_353;
        __VLS_341.slots.default;
        var __VLS_341;
        __VLS_335.slots.default;
        var __VLS_335;
        __VLS_329.slots.default;
        var __VLS_329;
    }
    __VLS_243.slots.default;
    var __VLS_243;
    __VLS_237.slots.default;
    var __VLS_237;
    __VLS_125.slots.default;
    var __VLS_125;
    __VLS_113.slots.default;
    var __VLS_113;
    __VLS_107.slots.default;
    var __VLS_107;
    const __VLS_362 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
        ...{ class: ("move_topo2 d-md-none justify-center align-center ") },
    }));
    const __VLS_364 = __VLS_363({
        ...{ class: ("move_topo2 d-md-none justify-center align-center ") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_363));
    const __VLS_368 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-0") },
    }));
    const __VLS_370 = __VLS_369({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    const __VLS_374 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({
        ...{ class: ("d-sm justify-center align-center ma-0 w-100") },
        justify: ("center"),
    }));
    const __VLS_376 = __VLS_375({
        ...{ class: ("d-sm justify-center align-center ma-0 w-100") },
        justify: ("center"),
    }, ...__VLS_functionalComponentArgsRest(__VLS_375));
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.carouselItems))) {
        const __VLS_380 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
            cols: ("6"),
            key: ((index)),
        }));
        const __VLS_382 = __VLS_381({
            cols: ("6"),
            key: ((index)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_381));
        const __VLS_386 = {}.VHover;
        /** @type { [typeof __VLS_components.VHover, typeof __VLS_components.vHover, typeof __VLS_components.VHover, typeof __VLS_components.vHover, ] } */ ;
        // @ts-ignore
        const __VLS_387 = __VLS_asFunctionalComponent(__VLS_386, new __VLS_386({}));
        const __VLS_388 = __VLS_387({}, ...__VLS_functionalComponentArgsRest(__VLS_387));
        {
            const { default: __VLS_thisSlot } = __VLS_391.slots;
            const [{ isHovering, props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_392 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
                ...{ 'onClick': {} },
                ...{ class: (({ 'on-hover': isHovering })) },
                elevation: ((isHovering ? 12 : 2)),
                ...(props),
                disabled: ((index > 3 ? true : false)),
            }));
            const __VLS_394 = __VLS_393({
                ...{ 'onClick': {} },
                ...{ class: (({ 'on-hover': isHovering })) },
                elevation: ((isHovering ? 12 : 2)),
                ...(props),
                disabled: ((index > 3 ? true : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_393));
            let __VLS_398;
            const __VLS_399 = {
                onClick: (...[$event]) => {
                    __VLS_ctx.router.push(item.route);
                }
            };
            let __VLS_395;
            let __VLS_396;
            const __VLS_400 = {}.VImg;
            /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
            // @ts-ignore
            const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
                src: ((item.img)),
                height: (true),
                with: (true),
                cover: (true),
                gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
            }));
            const __VLS_402 = __VLS_401({
                src: ((item.img)),
                height: (true),
                with: (true),
                cover: (true),
                gradient: ((index > 3 ? 'to top, rgba(0,0,0,1), rgba(0,0,0,.6)' : false)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_401));
            __VLS_397.slots.default;
            var __VLS_397;
            __VLS_391.slots['' /* empty slot name completion */];
        }
        var __VLS_391;
        __VLS_385.slots.default;
        var __VLS_385;
    }
    __VLS_379.slots.default;
    var __VLS_379;
    const __VLS_406 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_407 = __VLS_asFunctionalComponent(__VLS_406, new __VLS_406({
        ...{ class: ("d-flex justify-center align-center w-100 ") },
        noGutters: (true),
    }));
    const __VLS_408 = __VLS_407({
        ...{ class: ("d-flex justify-center align-center w-100 ") },
        noGutters: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_407));
    const __VLS_412 = {}.VCol;
    /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-0 mb-0") },
    }));
    const __VLS_414 = __VLS_413({
        cols: ("12"),
        sm: ("12"),
        md: ("12"),
        ...{ class: ("px-0 mb-0") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    if (__VLS_ctx.campaignList.length > 0) {
        const __VLS_418 = {}.VCarousel;
        /** @type { [typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, typeof __VLS_components.VCarousel, typeof __VLS_components.vCarousel, ] } */ ;
        // @ts-ignore
        const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
            showArrows: ("hover"),
            hideDelimiters: (true),
            height: ("500"),
        }));
        const __VLS_420 = __VLS_419({
            showArrows: ("hover"),
            hideDelimiters: (true),
            height: ("500"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_419));
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.campaignStore.findAll()))) {
            const __VLS_424 = {}.VCarouselItem;
            /** @type { [typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, typeof __VLS_components.VCarouselItem, typeof __VLS_components.vCarouselItem, ] } */ ;
            // @ts-ignore
            const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
                key: ((index)),
            }));
            const __VLS_426 = __VLS_425({
                key: ((index)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_425));
            const __VLS_430 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }));
            const __VLS_432 = __VLS_431({
                noGutters: (true),
                ...{ class: ("justify-center") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_431));
            const __VLS_436 = {}.VCol;
            /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
            // @ts-ignore
            const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
                cols: ("12"),
                sm: ("12"),
                md: ("12"),
            }));
            const __VLS_438 = __VLS_437({
                cols: ("12"),
                sm: ("12"),
                md: ("12"),
            }, ...__VLS_functionalComponentArgsRest(__VLS_437));
            const __VLS_442 = {}.VCard;
            /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
            // @ts-ignore
            const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({
                ...{ 'onClick': {} },
                ...{ class: ("mx-4") },
            }));
            const __VLS_444 = __VLS_443({
                ...{ 'onClick': {} },
                ...{ class: ("mx-4") },
            }, ...__VLS_functionalComponentArgsRest(__VLS_443));
            let __VLS_448;
            const __VLS_449 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.campaignList.length > 0)))
                        return;
                    __VLS_ctx.router.push({
                        name: 'Campaign',
                        params: { id: item.campaignId },
                    });
                }
            };
            let __VLS_445;
            let __VLS_446;
            if (item.campaign === 'core') {
                const __VLS_450 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({
                    src: ("https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"),
                    maxHeight: ("200"),
                    cover: (true),
                }));
                const __VLS_452 = __VLS_451({
                    src: ("https://assets.drunagor.app/CampaignTracker/CoreCompanion.webp"),
                    maxHeight: ("200"),
                    cover: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_451));
            }
            else if (item.campaign === 'apocalypse') {
                const __VLS_456 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
                    src: ("https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"),
                    maxHeight: ("200"),
                    cover: (true),
                }));
                const __VLS_458 = __VLS_457({
                    src: ("https://assets.drunagor.app/CampaignTracker/ApocCompanion.webp"),
                    maxHeight: ("200"),
                    cover: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_457));
            }
            else if (item.campaign === 'awakenings') {
                const __VLS_462 = {}.VImg;
                /** @type { [typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ] } */ ;
                // @ts-ignore
                const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
                    src: ("https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"),
                    maxHeight: ("200"),
                    cover: (true),
                }));
                const __VLS_464 = __VLS_463({
                    src: ("https://assets.drunagor.app/CampaignTracker/AwakComapanion.webp"),
                    maxHeight: ("200"),
                    cover: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_463));
            }
            if (item.name) {
                const __VLS_468 = {}.VCardSubtitle;
                /** @type { [typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, typeof __VLS_components.VCardSubtitle, typeof __VLS_components.vCardSubtitle, ] } */ ;
                // @ts-ignore
                const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
                    ...{ class: ("text-uppercase mt-3") },
                }));
                const __VLS_470 = __VLS_469({
                    ...{ class: ("text-uppercase mt-3") },
                }, ...__VLS_functionalComponentArgsRest(__VLS_469));
                (item.name);
                __VLS_473.slots.default;
                var __VLS_473;
            }
            const __VLS_474 = {}.VCardText;
            /** @type { [typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ] } */ ;
            // @ts-ignore
            const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({}));
            const __VLS_476 = __VLS_475({}, ...__VLS_functionalComponentArgsRest(__VLS_475));
            const __VLS_480 = {}.VRow;
            /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
            // @ts-ignore
            const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
                noGutters: (true),
            }));
            const __VLS_482 = __VLS_481({
                noGutters: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_481));
            for (const [hero] of __VLS_getVForSourceType((__VLS_ctx.findHeroes(item.campaignId)))) {
                const __VLS_486 = {}.VCol;
                /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
                // @ts-ignore
                const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
                    ...{ class: ("d-flex") },
                    key: ((hero.heroId)),
                }));
                const __VLS_488 = __VLS_487({
                    ...{ class: ("d-flex") },
                    key: ((hero.heroId)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_487));
                const __VLS_492 = {}.VAvatar;
                /** @type { [typeof __VLS_components.VAvatar, typeof __VLS_components.vAvatar, ] } */ ;
                // @ts-ignore
                const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
                    rounded: ("0"),
                    image: ((hero.images.avatar)),
                    size: ("66"),
                }));
                const __VLS_494 = __VLS_493({
                    rounded: ("0"),
                    image: ((hero.images.avatar)),
                    size: ("66"),
                }, ...__VLS_functionalComponentArgsRest(__VLS_493));
                __VLS_491.slots.default;
                var __VLS_491;
            }
            __VLS_485.slots.default;
            var __VLS_485;
            __VLS_479.slots.default;
            var __VLS_479;
            __VLS_447.slots.default;
            var __VLS_447;
            __VLS_441.slots.default;
            var __VLS_441;
            __VLS_435.slots.default;
            var __VLS_435;
            __VLS_429.slots.default;
            var __VLS_429;
        }
        __VLS_423.slots.default;
        var __VLS_423;
    }
    else {
        const __VLS_498 = {}.VRow;
        /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
        // @ts-ignore
        const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
            noGutters: (true),
            ...{ class: ("justify-center py-6") },
        }));
        const __VLS_500 = __VLS_499({
            noGutters: (true),
            ...{ class: ("justify-center py-6") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_499));
        const __VLS_504 = {}.VCol;
        /** @type { [typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ] } */ ;
        // @ts-ignore
        const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({
            cols: ("10"),
        }));
        const __VLS_506 = __VLS_505({
            cols: ("10"),
        }, ...__VLS_functionalComponentArgsRest(__VLS_505));
        const __VLS_510 = {}.VCard;
        /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
        // @ts-ignore
        const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({
            ...{ class: ("mx-auto") },
        }));
        const __VLS_512 = __VLS_511({
            ...{ class: ("mx-auto") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_511));
        const __VLS_516 = {}.VCardTitle;
        /** @type { [typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ] } */ ;
        // @ts-ignore
        const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({}));
        const __VLS_518 = __VLS_517({}, ...__VLS_functionalComponentArgsRest(__VLS_517));
        __VLS_521.slots.default;
        var __VLS_521;
        const __VLS_522 = {}.VCardActions;
        /** @type { [typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ] } */ ;
        // @ts-ignore
        const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
            ...{ class: ("d-flex justify-center") },
        }));
        const __VLS_524 = __VLS_523({
            ...{ class: ("d-flex justify-center") },
        }, ...__VLS_functionalComponentArgsRest(__VLS_523));
        const __VLS_528 = {}.VBtn;
        /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
        // @ts-ignore
        const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
            ...{ 'onClick': {} },
        }));
        const __VLS_530 = __VLS_529({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_529));
        let __VLS_534;
        const __VLS_535 = {
            onClick: (...[$event]) => {
                if (!(!((__VLS_ctx.campaignList.length > 0))))
                    return;
                __VLS_ctx.router.push({ name: 'Campaign Overview' });
            }
        };
        let __VLS_531;
        let __VLS_532;
        __VLS_533.slots.default;
        var __VLS_533;
        __VLS_527.slots.default;
        var __VLS_527;
        __VLS_515.slots.default;
        var __VLS_515;
        __VLS_509.slots.default;
        var __VLS_509;
        __VLS_503.slots.default;
        var __VLS_503;
    }
    __VLS_417.slots.default;
    var __VLS_417;
    __VLS_411.slots.default;
    var __VLS_411;
    __VLS_373.slots.default;
    var __VLS_373;
    __VLS_367.slots.default;
    var __VLS_367;
    __VLS_5.slots.default;
    var __VLS_5;
    ['d-none', 'd-md-flex', 'justify-center', 'align-center', 'ml-16', 'px-6', 'avatar-overlayuser', 'user_nameuser', 'text-h3', 'd-md-none', 'justify-center', 'align-center', 'ml-0', 'card-overlay', 'full-screen-card', 'card-overlay1', 'full-screen-card', 'avatar-mobile', 'user_name2', 'text-h5', 'mt-4', 'd-none', 'd-md-flex', 'justify-center', 'align-center', 'ma-0', 'w-100', 'px-6', 'move_topouser', 'pt-12', 'move_topouser', 'pt-12', 'mt-2', 'd-flex', 'justify-center', 'align-center', 'ma-0', 'w-100', 'ml-5', 'pt-12', 'justify-center', 'mx-auto', 'd-flex', 'justify-center', 'text-center', 'text-center', 'on-hover', 'mt-4', 'd-flex', 'justify-center', 'align-center', 'py-6', 'px-5', 'mb-0', 'justify-center', 'mx-auto', 'text-uppercase', 'd-flex', 'justify-center', 'py-6', 'mx-auto', 'mx-auto', 'text-center', 'd-flex', 'justify-center', 'move_topo2', 'd-md-none', 'justify-center', 'align-center', 'px-0', 'd-sm', 'justify-center', 'align-center', 'ma-0', 'w-100', 'on-hover', 'd-flex', 'justify-center', 'align-center', 'w-100', 'px-0', 'mb-0', 'justify-center', 'mx-4', 'text-uppercase', 'mt-3', 'd-flex', 'justify-center', 'py-6', 'mx-auto', 'd-flex', 'justify-center',];
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
            campaignStore: campaignStore,
            campaignList: campaignList,
            router: router,
            user: user,
            assets: assets,
            isMobile: isMobile,
            carouselItems: carouselItems,
            findHeroes: findHeroes,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
