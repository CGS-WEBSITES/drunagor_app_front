/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importa o roteador
import { useUserStore } from "@/store/UserStore";
const user = useUserStore().user;
// Roteador
const router = useRouter();
// Função de navegação
const navigateTo = (route) => {
    router.push(route);
};
// Estado do botão ativo
const activeButton = ref(null);
// Grupos de botões (divididos em 3 grupos)
const userbuttons = ref([
    { icon: 'mdi-account', value: 'PerfilHome', route: '/profile/home', text: "profile" },
    { icon: 'mdi-magnify', value: 'search', route: '/profile/friend-store', text: "search users" },
    { icon: 'mdi-account-group', value: 'group', route: '/profile/friend-storelist', text: "friends" },
    { icon: 'mdi-cog-outline', value: 'settings', route: '/profile/settings', text: "settings" },
]);
const retailbuttons = ref([
    { icon: 'mdi-account', value: 'PerfilHome', route: '/profile/home', text: "profile" },
    { icon: 'mdi-store', value: 'logout', route: '/profile/store-settings', text: "stores" },
    { icon: 'mdi-magnify', value: 'search', route: '/profile/friend-store', text: "search users" },
    { icon: 'mdi-account-group', value: 'group', route: '/profile/friend-storelist', text: "friends" },
    { icon: 'mdi-cog-outline', value: 'settings', route: '/profile/settings', text: "settings" },
]);
const usermobilebuttons = ref([
    { icon: 'mdi-account', value: 'PerfilHome', route: '/profile/home', text: "profile" },
    { icon: 'mdi-magnify', value: 'search', route: '/profile/friend-store', text: "search users" },
    { icon: 'mdi-account-group', value: 'group', route: '/profile/friend-storelist', text: "friends" },
    { icon: 'mdi-cog-outline', value: 'settings', route: '/profile/settings', text: "settings" },
    { icon: 'mdi-logout', value: 'logout', route: '/perfil/', text: "logout" },
]);
const retailmobilebuttons = ref([
    { icon: 'mdi-account', value: 'PerfilHome', route: '/profile/home', text: "profile" },
    { icon: 'mdi-store', value: 'logout', route: '/profile/store-settings', text: "stores" },
    { icon: 'mdi-magnify', value: 'search', route: '/profile/friend-store', text: "search users" },
    { icon: 'mdi-account-group', value: 'group', route: '/profile/friend-storelist', text: "friends" },
    { icon: 'mdi-cog-outline', value: 'settings', route: '/profile/settings', text: "settings" },
    { icon: 'mdi-logout', value: 'logout', route: '/perfil/', text: "logout" },
]);
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    const __VLS_0 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("d-md-none pa-4") },
    }));
    const __VLS_2 = __VLS_1({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("d-md-none pa-4") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const __VLS_6 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("3"),
        ...{ class: ("mx-auto py-4 px-6 d-flex justify-center") },
    }));
    const __VLS_8 = __VLS_7({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("3"),
        ...{ class: ("mx-auto py-4 px-6 d-flex justify-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const __VLS_12 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        justify: ("space-between"),
        align: ("center"),
        ...{ class: ("py-2") },
        ...{ style: ({}) },
    }));
    const __VLS_14 = __VLS_13({
        justify: ("space-between"),
        align: ("center"),
        ...{ class: ("py-2") },
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    if (__VLS_ctx.user?.roles_fk === 2) {
        for (const [button, i] of __VLS_getVForSourceType((__VLS_ctx.usermobilebuttons))) {
            (button.value);
            const __VLS_18 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
                ...{ 'onClick': {} },
                icon: ((button.icon)),
            }));
            const __VLS_20 = __VLS_19({
                ...{ 'onClick': {} },
                icon: ((button.icon)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_19));
            let __VLS_24;
            const __VLS_25 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.user?.roles_fk === 2)))
                        return;
                    __VLS_ctx.navigateTo(button.route);
                }
            };
            let __VLS_21;
            let __VLS_22;
            var __VLS_23;
            if (i % 2 === 0 && i !== __VLS_ctx.usermobilebuttons.length - 1) {
                const __VLS_26 = {}.VDivider;
                /** @type { [typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ] } */ ;
                // @ts-ignore
                const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
                    vertical: (true),
                }));
                const __VLS_28 = __VLS_27({
                    vertical: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_27));
            }
        }
    }
    else if (__VLS_ctx.user?.roles_fk === 3) {
        for (const [button, i] of __VLS_getVForSourceType((__VLS_ctx.retailmobilebuttons))) {
            (button.value);
            const __VLS_32 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                ...{ 'onClick': {} },
                icon: ((button.icon)),
            }));
            const __VLS_34 = __VLS_33({
                ...{ 'onClick': {} },
                icon: ((button.icon)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            let __VLS_38;
            const __VLS_39 = {
                onClick: (...[$event]) => {
                    if (!(!((__VLS_ctx.user?.roles_fk === 2))))
                        return;
                    if (!((__VLS_ctx.user?.roles_fk === 3)))
                        return;
                    __VLS_ctx.navigateTo(button.route);
                }
            };
            let __VLS_35;
            let __VLS_36;
            var __VLS_37;
            if (i % 3 === 0 && i !== __VLS_ctx.retailmobilebuttons.length - 1) {
                const __VLS_40 = {}.VDivider;
                /** @type { [typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ] } */ ;
                // @ts-ignore
                const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
                    vertical: (true),
                }));
                const __VLS_42 = __VLS_41({
                    vertical: (true),
                }, ...__VLS_functionalComponentArgsRest(__VLS_41));
            }
        }
    }
    __VLS_17.slots.default;
    var __VLS_17;
    __VLS_11.slots.default;
    var __VLS_11;
    __VLS_5.slots.default;
    var __VLS_5;
    const __VLS_46 = {}.VContainer;
    /** @type { [typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ] } */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("d-none d-md-flex") },
    }));
    const __VLS_48 = __VLS_47({
        maxWidth: ("800"),
        ...{ style: ({}) },
        ...{ class: ("d-none d-md-flex") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    const __VLS_52 = {}.VCard;
    /** @type { [typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ] } */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("3"),
        ...{ class: ("mx-auto py-4 px-6 d-flex justify-center") },
    }));
    const __VLS_54 = __VLS_53({
        color: ("primary"),
        rounded: ("lg"),
        elevation: ("3"),
        ...{ class: ("mx-auto py-4 px-6 d-flex justify-center") },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const __VLS_58 = {}.VRow;
    /** @type { [typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ] } */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        justify: ("space-between"),
        align: ("center"),
        ...{ class: ("py-2") },
        ...{ style: ({}) },
    }));
    const __VLS_60 = __VLS_59({
        justify: ("space-between"),
        align: ("center"),
        ...{ class: ("py-2") },
        ...{ style: ({}) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    if (__VLS_ctx.user?.roles_fk === 2) {
        for (const [button, index] of __VLS_getVForSourceType((__VLS_ctx.userbuttons))) {
            const __VLS_64 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                ...{ 'onClick': {} },
                ...{ class: ("mx-1") },
                rounded: (true),
            }));
            const __VLS_66 = __VLS_65({
                ...{ 'onClick': {} },
                ...{ class: ("mx-1") },
                rounded: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_65));
            let __VLS_70;
            const __VLS_71 = {
                onClick: (...[$event]) => {
                    if (!((__VLS_ctx.user?.roles_fk === 2)))
                        return;
                    __VLS_ctx.navigateTo(button.route);
                }
            };
            let __VLS_67;
            let __VLS_68;
            const __VLS_72 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                ...{ style: ({}) },
            }));
            const __VLS_74 = __VLS_73({
                ...{ style: ({}) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_73));
            (button.icon);
            __VLS_77.slots.default;
            var __VLS_77;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (button.text);
            __VLS_69.slots.default;
            var __VLS_69;
        }
    }
    else if (__VLS_ctx.user?.roles_fk === 3) {
        for (const [button, index] of __VLS_getVForSourceType((__VLS_ctx.retailbuttons))) {
            const __VLS_78 = {}.VBtn;
            /** @type { [typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ] } */ ;
            // @ts-ignore
            const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
                ...{ 'onClick': {} },
                ...{ class: ("mx-1") },
                rounded: (true),
            }));
            const __VLS_80 = __VLS_79({
                ...{ 'onClick': {} },
                ...{ class: ("mx-1") },
                rounded: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_79));
            let __VLS_84;
            const __VLS_85 = {
                onClick: (...[$event]) => {
                    if (!(!((__VLS_ctx.user?.roles_fk === 2))))
                        return;
                    if (!((__VLS_ctx.user?.roles_fk === 3)))
                        return;
                    __VLS_ctx.navigateTo(button.route);
                }
            };
            let __VLS_81;
            let __VLS_82;
            const __VLS_86 = {}.VIcon;
            /** @type { [typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ] } */ ;
            // @ts-ignore
            const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
                ...{ style: ({}) },
            }));
            const __VLS_88 = __VLS_87({
                ...{ style: ({}) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_87));
            (button.icon);
            __VLS_91.slots.default;
            var __VLS_91;
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (button.text);
            __VLS_83.slots.default;
            var __VLS_83;
        }
    }
    __VLS_63.slots.default;
    var __VLS_63;
    __VLS_57.slots.default;
    var __VLS_57;
    __VLS_51.slots.default;
    var __VLS_51;
    ['d-md-none', 'pa-4', 'mx-auto', 'py-4', 'px-6', 'd-flex', 'justify-center', 'py-2', 'd-none', 'd-md-flex', 'mx-auto', 'py-4', 'px-6', 'd-flex', 'justify-center', 'py-2', 'mx-1', 'mx-1',];
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
            user: user,
            navigateTo: navigateTo,
            userbuttons: userbuttons,
            retailbuttons: retailbuttons,
            usermobilebuttons: usermobilebuttons,
            retailmobilebuttons: retailmobilebuttons,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
