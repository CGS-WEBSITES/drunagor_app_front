/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/UserStore";
import BaseAlert from "@/components/Alerts/BaseAlert.vue";
const userStore = useUserStore();
const router = useRouter();
const editableStore = ref({
    site: "",
    storename: "",
    country: null,
    zipcode: "",
    MerchantID: "",
    storeImage: "",
    address: "",
    streetNumber: "",
    complement: "",
    city: "",
    state: "",
});
const selectedStoreIndex = ref(null);
const StateList = ref([
    { name: "Alabama" },
    { name: "Alaska" },
    { name: "Arizona" },
    { name: "Arkansas" },
    { name: "California" },
    { name: "Colorado" },
    { name: "Connecticut" },
    { name: "Delaware" },
    { name: "Florida" },
    { name: "Georgia" },
    { name: "Hawaii" },
    { name: "Idaho" },
    { name: "Illinois" },
    { name: "Indiana" },
    { name: "Iowa" },
    { name: "Kansas" },
    { name: "Kentucky" },
    { name: "Louisiana" },
    { name: "Maine" },
    { name: "Maryland" },
    { name: "Massachusetts" },
    { name: "Michigan" },
    { name: "Minnesota" },
    { name: "Mississippi" },
    { name: "Missouri" },
    { name: "Montana" },
    { name: "Nebraska" },
    { name: "Nevada" },
    { name: "New Hampshire" },
    { name: "New Jersey" },
    { name: "New Mexico" },
    { name: "New York" },
    { name: "North Carolina" },
    { name: "North Dakota" },
    { name: "Ohio" },
    { name: "Oklahoma" },
    { name: "Oregon" },
    { name: "Pennsylvania" },
    { name: "Rhode Island" },
    { name: "South Carolina" },
    { name: "South Dakota" },
    { name: "Tennessee" },
    { name: "Texas" },
    { name: "Utah" },
    { name: "Vermont" },
    { name: "Virginia" },
    { name: "Washington" },
    { name: "West Virginia" },
    { name: "Wisconsin" },
    { name: "Wyoming" },
]);
const selectedCountry = ref(250);
const stores = ref([]);
const form = ref({
    site: "",
    storename: "",
    country: null,
    zipcode: "",
    MerchantID: "",
    storeImage: "",
    complement: "",
    address: "",
    streetNumber: "",
    city: "",
    state: "",
});
const countriesList = ref([]);
const storeForm = ref(null);
const showVerificationMessage = ref(false);
const isExpanded = ref(false);
const editDialog = ref(false);
const successDialog = ref(false);
const accountData = ref(null);
const axios = inject("axios");
const trimValue = (value) => value?.trim?.() || "";
const sanitizeStoreValues = (store) => {
    store.site = trimValue(store.site);
    store.storename = trimValue(store.storename);
    store.zipcode = trimValue(store.zipcode);
    store.MerchantID = trimValue(store.MerchantID);
    store.complement = trimValue(store.complement);
    store.address = trimValue(store.address);
    store.streetNumber = trimValue(store.streetNumber);
    store.city = trimValue(store.city);
    store.state = trimValue(store.state || "");
};
const isUnitedStates = computed(() => {
    const selectedCountry = form.value.country;
    if (typeof selectedCountry === "number") {
        return selectedCountry === 250;
    }
    const countryObject = countriesList.value.find((c) => c.name.toLowerCase() === (selectedCountry || "").toLowerCase());
    return countryObject?.countries_pk === 250;
});
const storedUser = localStorage.getItem("app_user");
const appUser = storedUser ? JSON.parse(storedUser).users_pk : null;
const fetchCountries = () => {
    axios
        .get("countries/search")
        .then((response) => {
        countriesList.value = response.data.countries.map((country) => ({
            countries_pk: country.countries_pk,
            name: country.name,
            abbreviation: country.abbreviation,
        }));
    })
        .catch((error) => {
        console.error("Erro ao buscar países:", error);
    });
};
const fetchStores = async () => {
    try {
        const response = await axios.get("/stores/list", {
            params: { users_fk: userStore.user?.users_pk },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        stores.value = [...response.data.stores];
    }
    catch (error) {
        console.error("❌ Erro ao buscar lojas:", error?.response?.data || error?.message);
        stores.value = [];
    }
};
const onlyAllowAlphanumeric = (event) => {
    const char = event.key;
    if (!/^[a-zA-Z0-9]$/.test(char)) {
        event.preventDefault();
    }
};
const getCountryNameFromId = (id) => {
    if (typeof id === "string") {
        const matchByName = countriesList.value.find((c) => c.name.toLowerCase() === id.toLowerCase());
        if (matchByName)
            return matchByName.name;
    }
    if (typeof id === "number") {
        const matchById = countriesList.value.find((c) => c.countries_pk === id);
        if (matchById)
            return matchById.name;
    }
    return "";
};
const saveStore = async () => {
    sanitizeStoreValues(form.value);
    const { valid } = await storeForm.value.validate();
    if (!valid) {
        console.warn("❌ Formulário inválido. Corrija os erros.");
        return;
    }
    const store = form.value;
    const countryName = getCountryNameFromId(store.country);
    const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${countryName}`;
    const payload = {
        web_site: store.site,
        name: store.storename,
        zip_code: store.zipcode,
        countries_fk: store.country,
        users_fk: userStore.user?.users_pk,
        address: fullAddress,
        picture_hash: form.value.storeImage,
        merchant_id: store.MerchantID,
    };
    try {
        const response = await axios.post("/stores/cadastro", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        const newStorePk = response.data.store?.stores_pk || response.data.stores_pk;
        if (newStorePk) {
            await axios.get(`/stores/${newStorePk}/verify`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
        }
        form.value = {
            storename: "",
            site: "",
            country: null,
            zipcode: "",
            MerchantID: "",
            storeImage: "",
            complement: "",
            address: "",
            streetNumber: "",
            city: "",
            state: "",
        };
        isExpanded.value = false;
        await fetchStores();
        successDialog.value = true;
    }
    catch (error) {
        console.error("❌ Erro ao cadastrar/validar a loja:", error.response?.data || error.message);
    }
};
const goToCreateEvent = () => {
    successDialog.value = false;
    router.push({ path: "/events", query: { action: "create" } });
};
const cancelForm = () => {
    form.value = {
        site: "",
        storename: "",
        country: null,
        zipcode: "",
        MerchantID: "",
        storeImage: "",
        complement: "",
        address: "",
        streetNumber: "",
        city: "",
        state: "",
    };
    isExpanded.value = false;
};
const toggleForm = () => {
    isExpanded.value = !isExpanded.value;
};
const openEditDialog = (store, index) => {
    const addressParts = store.address?.split(",").map((s) => s.trim()) || [];
    const [streetNumber, address, complement, city, state, countryName] = addressParts;
    const countryObject = countriesList.value.find((c) => c.name.toLowerCase() === (countryName || "").toLowerCase());
    const countryId = countryObject ? countryObject.countries_pk : null;
    editableStore.value = {
        stores_pk: store.stores_pk,
        storename: store.name || store.storename,
        site: store.web_site || store.site || "",
        zipcode: store.zip_code || store.zipcode || "",
        country: countryId,
        state: state || "",
        city: city || "",
        complement: complement || "",
        address: address || "",
        streetNumber: streetNumber || "",
        MerchantID: store.MerchantID || store.merchant_id,
        storeImage: store.picture_hash || store.storeImage,
    };
    selectedStoreIndex.value = index;
    editDialog.value = true;
};
const handleImageUpload = async (event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file)
        return;
    const formData = new FormData();
    formData.append("file", file);
    await axios
        .post("/images/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((response) => {
        if (editDialog.value) {
            editableStore.value.storeImage = response.data.image_key;
        }
        else {
            form.value.storeImage = response.data.image_key;
        }
    })
        .catch((error) => {
        console.error("❌ Error uploading image:", error.response?.data || error);
    });
};
const saveEditedStore = async () => {
    sanitizeStoreValues(editableStore.value);
    const store = editableStore.value;
    const countryName = getCountryNameFromId(store.country);
    const fullAddress = `${store.streetNumber}, ${store.address}, ${store.complement}, ${store.city}, ${store.state}, ${countryName}`;
    const payload = {
        stores_pk: store.stores_pk,
        name: store.storename,
        web_site: store.site,
        zip_code: store.zipcode,
        countries_fk: store.country,
        users_fk: userStore.user?.users_pk,
        address: fullAddress,
        picture_hash: store.storeImage,
        merchant_id: store.MerchantID,
    };
    try {
        await axios.put(`/stores/alter`, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
        await fetchStores();
        editDialog.value = false;
    }
    catch (error) {
        console.error("❌ Erro ao atualizar a loja:", error.response?.data || error.message);
    }
};
const removeStore = async (stores_pk) => {
    try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`/stores/${stores_pk}/delete/`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        await fetchStores();
    }
    catch (error) {
        console.error("❌ Erro ao excluir a loja:", error.response?.data || error.message);
    }
};
const getMerchantAccount = () => {
    const merchantId = "136699508";
    const token = "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";
    axios
        .get(`https://shoppingcontent.googleapis.com/content/v2.1/${merchantId}/accounts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
        console.log("Dados da conta:", response.data);
        accountData.value = response.data;
    })
        .catch((error) => {
        console.error("Erro ao buscar dados da conta:", error);
    });
};
onMounted(() => {
    fetchStores();
    fetchCountries();
    getMerchantAccount();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "d-flex justify-center mb-4" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "d-flex justify-center mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    color: "secundary",
    ...{ class: "text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase mb-0" },
    minWidth: "378px",
    minHeight: "60px",
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    color: "secundary",
    ...{ class: "text-h5 font-weight-black pl-2 pt-2 pb-2 text-uppercase mb-0" },
    minWidth: "378px",
    minHeight: "60px",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.toggleForm)
};
__VLS_7.slots.default;
const __VLS_12 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "pr-3" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "pr-3" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
var __VLS_7;
var __VLS_3;
/** @type {[typeof BaseAlert, typeof BaseAlert, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(BaseAlert, new BaseAlert({
    modelValue: (__VLS_ctx.showVerificationMessage),
    type: "info",
    icon: "mdi-alert-octagram-outline",
    color: "warning",
    ...{ class: "my-4" },
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.showVerificationMessage),
    type: "info",
    icon: "mdi-alert-octagram-outline",
    color: "warning",
    ...{ class: "my-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
var __VLS_18;
const __VLS_19 = {}.VCol;
/** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    cols: "12",
    ...{ class: "d-flex justify-center pa-0" },
}));
const __VLS_21 = __VLS_20({
    cols: "12",
    ...{ class: "d-flex justify-center pa-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.VContainer;
/** @type {[typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, typeof __VLS_components.VContainer, typeof __VLS_components.vContainer, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    maxWidth: "800",
    ...{ style: {} },
    ...{ class: "pa-4" },
}));
const __VLS_25 = __VLS_24({
    maxWidth: "800",
    ...{ style: {} },
    ...{ class: "pa-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    ...{ class: "pl-2 pr-2 pb-2 pt-2" },
    rounded: "lg",
    elevation: "3",
}));
const __VLS_29 = __VLS_28({
    ...{ class: "pl-2 pr-2 pb-2 pt-2" },
    rounded: "lg",
    elevation: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
if (__VLS_ctx.isExpanded) {
    const __VLS_31 = {}.VCardText;
    /** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
    const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_34.slots.default;
    const __VLS_35 = {}.VForm;
    /** @type {[typeof __VLS_components.VForm, typeof __VLS_components.vForm, typeof __VLS_components.VForm, typeof __VLS_components.vForm, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        ref: "storeForm",
    }));
    const __VLS_37 = __VLS_36({
        ref: "storeForm",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    /** @type {typeof __VLS_ctx.storeForm} */ ;
    var __VLS_39 = {};
    __VLS_38.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-h6 font-weight-medium pl-3 pb-3 pt-0" },
    });
    const __VLS_41 = {}.VFileInput;
    /** @type {[typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...{ 'onChange': {} },
        label: "Upload Store Image (Recommended square images)",
        accept: "image/*",
        variant: "outlined",
        ...{ class: "mb-3" },
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onChange': {} },
        label: "Upload Store Image (Recommended square images)",
        accept: "image/*",
        variant: "outlined",
        ...{ class: "mb-3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_45;
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = {
        onChange: (__VLS_ctx.handleImageUpload)
    };
    var __VLS_44;
    if (__VLS_ctx.form.storeImage) {
        const __VLS_49 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
            src: (__VLS_ctx.form.storeImage.startsWith('http')
                ? __VLS_ctx.form.storeImage
                : `http://druna-user-pic.s3.us-east-2.amazonaws.com/${__VLS_ctx.form.storeImage}`),
            height: "100",
            ...{ class: "rounded-lg mb-3" },
        }));
        const __VLS_51 = __VLS_50({
            src: (__VLS_ctx.form.storeImage.startsWith('http')
                ? __VLS_ctx.form.storeImage
                : `http://druna-user-pic.s3.us-east-2.amazonaws.com/${__VLS_ctx.form.storeImage}`),
            height: "100",
            ...{ class: "rounded-lg mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    }
    const __VLS_53 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        label: "Website",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.site),
    }));
    const __VLS_55 = __VLS_54({
        label: "Website",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.site),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    const __VLS_57 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        label: "Store Name",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.storename),
        rules: ([(v) => !!v || 'Store name is required']),
    }));
    const __VLS_59 = __VLS_58({
        label: "Store Name",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.storename),
        rules: ([(v) => !!v || 'Store name is required']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    const __VLS_61 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        ...{ 'onKeypress': {} },
        label: "Street Number",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.streetNumber),
        rules: ([(v) => !!v || 'Street Number is required']),
        type: "text",
    }));
    const __VLS_63 = __VLS_62({
        ...{ 'onKeypress': {} },
        label: "Street Number",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.streetNumber),
        rules: ([(v) => !!v || 'Street Number is required']),
        type: "text",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_65;
    let __VLS_66;
    let __VLS_67;
    const __VLS_68 = {
        onKeypress: (__VLS_ctx.onlyAllowAlphanumeric)
    };
    var __VLS_64;
    const __VLS_69 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        label: "Street Name",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.address),
        rules: ([(v) => !!v || 'Street name is required']),
    }));
    const __VLS_71 = __VLS_70({
        label: "Street Name",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.address),
        rules: ([(v) => !!v || 'Street name is required']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    const __VLS_73 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        label: "Apt, suite, etc.",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.complement),
    }));
    const __VLS_75 = __VLS_74({
        label: "Apt, suite, etc.",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.complement),
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    const __VLS_77 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        label: "City",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.city),
        rules: ([(v) => !!v || 'City name is required']),
    }));
    const __VLS_79 = __VLS_78({
        label: "City",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.city),
        rules: ([(v) => !!v || 'City name is required']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    const __VLS_81 = {}.VAutocomplete;
    /** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        modelValue: (__VLS_ctx.form.country),
        items: (__VLS_ctx.countriesList),
        itemTitle: "name",
        itemValue: "countries_pk",
        variant: "solo-filled",
        label: "Select or type a country",
        rules: ([(v) => !!v || 'country is required']),
        ...{ class: "mb-0" },
    }));
    const __VLS_83 = __VLS_82({
        modelValue: (__VLS_ctx.form.country),
        items: (__VLS_ctx.countriesList),
        itemTitle: "name",
        itemValue: "countries_pk",
        variant: "solo-filled",
        label: "Select or type a country",
        rules: ([(v) => !!v || 'country is required']),
        ...{ class: "mb-0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    if (__VLS_ctx.isUnitedStates) {
        const __VLS_85 = {}.VAutocomplete;
        /** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
            modelValue: (__VLS_ctx.form.state),
            items: (__VLS_ctx.StateList),
            itemTitle: "name",
            variant: "outlined",
            label: "Select State",
            rules: ([(v) => !!v || 'State is required']),
            ...{ class: "mb-0" },
        }));
        const __VLS_87 = __VLS_86({
            modelValue: (__VLS_ctx.form.state),
            items: (__VLS_ctx.StateList),
            itemTitle: "name",
            variant: "outlined",
            label: "Select State",
            rules: ([(v) => !!v || 'State is required']),
            ...{ class: "mb-0" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    }
    if (__VLS_ctx.isUnitedStates) {
        const __VLS_89 = {}.VTextField;
        /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
            label: "Zip Code",
            variant: "outlined",
            modelValue: (__VLS_ctx.form.zipcode),
            rules: ([(v) => !!v || 'Zipcode is required']),
        }));
        const __VLS_91 = __VLS_90({
            label: "Zip Code",
            variant: "outlined",
            modelValue: (__VLS_ctx.form.zipcode),
            rules: ([(v) => !!v || 'Zipcode is required']),
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    }
    const __VLS_93 = {}.VTextField;
    /** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        label: "Google Merchant ID",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.MerchantID),
    }));
    const __VLS_95 = __VLS_94({
        label: "Google Merchant ID",
        variant: "outlined",
        modelValue: (__VLS_ctx.form.MerchantID),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    var __VLS_38;
    const __VLS_97 = {}.VCardActions;
    /** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({}));
    const __VLS_99 = __VLS_98({}, ...__VLS_functionalComponentArgsRest(__VLS_98));
    __VLS_100.slots.default;
    const __VLS_101 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        color: "green",
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        color: "green",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_105;
    let __VLS_106;
    let __VLS_107;
    const __VLS_108 = {
        onClick: (__VLS_ctx.saveStore)
    };
    __VLS_104.slots.default;
    var __VLS_104;
    const __VLS_109 = {}.VBtn;
    /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        ...{ 'onClick': {} },
        color: "red",
        text: "true",
    }));
    const __VLS_111 = __VLS_110({
        ...{ 'onClick': {} },
        color: "red",
        text: "true",
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    let __VLS_113;
    let __VLS_114;
    let __VLS_115;
    const __VLS_116 = {
        onClick: (__VLS_ctx.cancelForm)
    };
    __VLS_112.slots.default;
    var __VLS_112;
    var __VLS_100;
    var __VLS_34;
}
const __VLS_117 = {}.VDivider;
/** @type {[typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, typeof __VLS_components.VDivider, typeof __VLS_components.vDivider, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    ...{ class: "my-4" },
}));
const __VLS_119 = __VLS_118({
    ...{ class: "my-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
if (__VLS_ctx.stores.length > 0) {
    const __VLS_121 = {}.VRow;
    /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
        noGutters: true,
        ...{ class: "d-flex flex-column" },
    }));
    const __VLS_123 = __VLS_122({
        noGutters: true,
        ...{ class: "d-flex flex-column" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    __VLS_124.slots.default;
    for (const [store, index] of __VLS_getVForSourceType((__VLS_ctx.stores))) {
        const __VLS_125 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
            key: (store.stores_pk),
            ...{ class: "pr-4" },
            cols: "12",
        }));
        const __VLS_127 = __VLS_126({
            key: (store.stores_pk),
            ...{ class: "pr-4" },
            cols: "12",
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        __VLS_128.slots.default;
        const __VLS_129 = {}.VCard;
        /** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
            color: "primary",
            minHeight: "130px",
            ...{ class: "mb-4 event-card" },
        }));
        const __VLS_131 = __VLS_130({
            color: "primary",
            minHeight: "130px",
            ...{ class: "mb-4 event-card" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        __VLS_132.slots.default;
        const __VLS_133 = {}.VRow;
        /** @type {[typeof __VLS_components.VRow, typeof __VLS_components.vRow, typeof __VLS_components.VRow, typeof __VLS_components.vRow, ]} */ ;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
            noGutters: true,
        }));
        const __VLS_135 = __VLS_134({
            noGutters: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_134));
        __VLS_136.slots.default;
        const __VLS_137 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            cols: "2",
            lg: "2",
        }));
        const __VLS_139 = __VLS_138({
            cols: "2",
            lg: "2",
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        __VLS_140.slots.default;
        const __VLS_141 = {}.VImg;
        /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            src: (store.picture_hash
                ? `https://assets.drunagor.app/${store.picture_hash}`
                : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
            ...{ class: "event-img" },
        }));
        const __VLS_143 = __VLS_142({
            src: (store.picture_hash
                ? `https://assets.drunagor.app/${store.picture_hash}`
                : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'),
            ...{ class: "event-img" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        var __VLS_140;
        const __VLS_145 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            cols: "8",
            lg: "9",
            ...{ class: "pa-2" },
        }));
        const __VLS_147 = __VLS_146({
            cols: "8",
            lg: "9",
            ...{ class: "pa-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        __VLS_148.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "text-subtitle-1 font-weight-bold" },
        });
        (store.name);
        const __VLS_149 = {}.VTooltip;
        /** @type {[typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, typeof __VLS_components.VTooltip, typeof __VLS_components.vTooltip, ]} */ ;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
            location: "top",
        }));
        const __VLS_151 = __VLS_150({
            location: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        __VLS_152.slots.default;
        {
            const { activator: __VLS_thisSlot } = __VLS_152.slots;
            const [{ props }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_153 = {}.VIcon;
            /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
            // @ts-ignore
            const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
                ...(props),
                color: (store.verified ? 'green' : 'yellow'),
                size: "20",
                ...{ class: "ml-2" },
            }));
            const __VLS_155 = __VLS_154({
                ...(props),
                color: (store.verified ? 'green' : 'yellow'),
                size: "20",
                ...{ class: "ml-2" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_154));
            __VLS_156.slots.default;
            (store.verified
                ? "mdi-check-decagram-outline"
                : "mdi-alert-octagram-outline");
            var __VLS_156;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (store.verified
            ? "Your store has been verified and is eligible to create events."
            : "Your store is under review and cannot create events yet. The verification process may take up to 3 business days.");
        var __VLS_152;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-caption" },
        });
        const __VLS_157 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
            color: "red",
        }));
        const __VLS_159 = __VLS_158({
            color: "red",
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        __VLS_160.slots.default;
        var __VLS_160;
        (store.address);
        (store.streetNumber);
        (store.city);
        (store.state);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-caption" },
        });
        (store.merchant_id);
        var __VLS_148;
        const __VLS_161 = {}.VCol;
        /** @type {[typeof __VLS_components.VCol, typeof __VLS_components.vCol, typeof __VLS_components.VCol, typeof __VLS_components.vCol, ]} */ ;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
            cols: "2",
            lg: "1",
            ...{ class: "d-flex flex-column align-center justify-center gap-2" },
        }));
        const __VLS_163 = __VLS_162({
            cols: "2",
            lg: "1",
            ...{ class: "d-flex flex-column align-center justify-center gap-2" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        __VLS_164.slots.default;
        const __VLS_165 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
            ...{ 'onClick': {} },
            color: "terciary",
            icon: true,
            ...{ class: "mb-4" },
            size: "small",
        }));
        const __VLS_167 = __VLS_166({
            ...{ 'onClick': {} },
            color: "terciary",
            icon: true,
            ...{ class: "mb-4" },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        let __VLS_169;
        let __VLS_170;
        let __VLS_171;
        const __VLS_172 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.stores.length > 0))
                    return;
                __VLS_ctx.openEditDialog(store, index);
            }
        };
        __VLS_168.slots.default;
        const __VLS_173 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({}));
        const __VLS_175 = __VLS_174({}, ...__VLS_functionalComponentArgsRest(__VLS_174));
        __VLS_176.slots.default;
        var __VLS_176;
        var __VLS_168;
        const __VLS_177 = {}.VBtn;
        /** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
        // @ts-ignore
        const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
            ...{ 'onClick': {} },
            color: "red",
            size: "small",
            icon: true,
        }));
        const __VLS_179 = __VLS_178({
            ...{ 'onClick': {} },
            color: "red",
            size: "small",
            icon: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_178));
        let __VLS_181;
        let __VLS_182;
        let __VLS_183;
        const __VLS_184 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.stores.length > 0))
                    return;
                __VLS_ctx.removeStore(store.stores_pk);
            }
        };
        __VLS_180.slots.default;
        const __VLS_185 = {}.VIcon;
        /** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
        // @ts-ignore
        const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({}));
        const __VLS_187 = __VLS_186({}, ...__VLS_functionalComponentArgsRest(__VLS_186));
        __VLS_188.slots.default;
        var __VLS_188;
        var __VLS_180;
        var __VLS_164;
        var __VLS_136;
        var __VLS_132;
        var __VLS_128;
    }
    var __VLS_124;
}
const __VLS_189 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    modelValue: (__VLS_ctx.editDialog),
    maxWidth: "500",
}));
const __VLS_191 = __VLS_190({
    modelValue: (__VLS_ctx.editDialog),
    maxWidth: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
__VLS_192.slots.default;
const __VLS_193 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({}));
const __VLS_195 = __VLS_194({}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
const __VLS_197 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    ...{ class: "text-h5 font-weight-bold" },
}));
const __VLS_199 = __VLS_198({
    ...{ class: "text-h5 font-weight-bold" },
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
var __VLS_200;
const __VLS_201 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({}));
const __VLS_203 = __VLS_202({}, ...__VLS_functionalComponentArgsRest(__VLS_202));
__VLS_204.slots.default;
const __VLS_205 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    label: "Site",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.site),
}));
const __VLS_207 = __VLS_206({
    label: "Site",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.site),
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
const __VLS_209 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
    label: "Store Name",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.storename),
}));
const __VLS_211 = __VLS_210({
    label: "Store Name",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.storename),
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
const __VLS_213 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
    ...{ 'onKeypress': {} },
    label: "Street Number",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.streetNumber),
}));
const __VLS_215 = __VLS_214({
    ...{ 'onKeypress': {} },
    label: "Street Number",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.streetNumber),
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
let __VLS_217;
let __VLS_218;
let __VLS_219;
const __VLS_220 = {
    onKeypress: (__VLS_ctx.onlyAllowAlphanumeric)
};
var __VLS_216;
const __VLS_221 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    label: "Street Name",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.address),
}));
const __VLS_223 = __VLS_222({
    label: "Street Name",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.address),
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
const __VLS_225 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
    label: "Apt, suite, etc.",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.complement),
}));
const __VLS_227 = __VLS_226({
    label: "Apt, suite, etc.",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.complement),
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
const __VLS_229 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
    label: "City",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.city),
}));
const __VLS_231 = __VLS_230({
    label: "City",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.city),
}, ...__VLS_functionalComponentArgsRest(__VLS_230));
const __VLS_233 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
    label: "State",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.state),
}));
const __VLS_235 = __VLS_234({
    label: "State",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.state),
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
const __VLS_237 = {}.VAutocomplete;
/** @type {[typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, typeof __VLS_components.VAutocomplete, typeof __VLS_components.vAutocomplete, ]} */ ;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
    modelValue: (__VLS_ctx.editableStore.country),
    items: (__VLS_ctx.countriesList),
    itemTitle: "name",
    itemValue: "countries_pk",
    variant: "solo-filled",
    label: "Select or type a country",
    ...{ class: "mb-0" },
}));
const __VLS_239 = __VLS_238({
    modelValue: (__VLS_ctx.editableStore.country),
    items: (__VLS_ctx.countriesList),
    itemTitle: "name",
    itemValue: "countries_pk",
    variant: "solo-filled",
    label: "Select or type a country",
    ...{ class: "mb-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
const __VLS_241 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    label: "Zip Code",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.zipcode),
}));
const __VLS_243 = __VLS_242({
    label: "Zip Code",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.zipcode),
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
const __VLS_245 = {}.VTextField;
/** @type {[typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, typeof __VLS_components.VTextField, typeof __VLS_components.vTextField, ]} */ ;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
    label: "Merchant ID",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.MerchantID),
}));
const __VLS_247 = __VLS_246({
    label: "Merchant ID",
    outlined: true,
    modelValue: (__VLS_ctx.editableStore.MerchantID),
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
const __VLS_249 = {}.VFileInput;
/** @type {[typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, typeof __VLS_components.VFileInput, typeof __VLS_components.vFileInput, ]} */ ;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
    ...{ 'onChange': {} },
    label: "Upload Store Image",
    accept: "image/*",
}));
const __VLS_251 = __VLS_250({
    ...{ 'onChange': {} },
    label: "Upload Store Image",
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
let __VLS_253;
let __VLS_254;
let __VLS_255;
const __VLS_256 = {
    onChange: (__VLS_ctx.handleImageUpload)
};
var __VLS_252;
if (__VLS_ctx.editableStore.storeImage) {
    const __VLS_257 = {}.VImg;
    /** @type {[typeof __VLS_components.VImg, typeof __VLS_components.vImg, typeof __VLS_components.VImg, typeof __VLS_components.vImg, ]} */ ;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
        src: (__VLS_ctx.editableStore.storeImage),
        height: "100",
        ...{ class: "mt-2 rounded" },
    }));
    const __VLS_259 = __VLS_258({
        src: (__VLS_ctx.editableStore.storeImage),
        height: "100",
        ...{ class: "mt-2 rounded" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
}
var __VLS_204;
const __VLS_261 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
    ...{ class: "d-flex justify-space-between" },
}));
const __VLS_263 = __VLS_262({
    ...{ class: "d-flex justify-space-between" },
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
__VLS_264.slots.default;
const __VLS_265 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
    ...{ 'onClick': {} },
    color: "red",
}));
const __VLS_267 = __VLS_266({
    ...{ 'onClick': {} },
    color: "red",
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
let __VLS_269;
let __VLS_270;
let __VLS_271;
const __VLS_272 = {
    onClick: (...[$event]) => {
        __VLS_ctx.editDialog = false;
    }
};
__VLS_268.slots.default;
var __VLS_268;
const __VLS_273 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
    ...{ 'onClick': {} },
    color: "green",
}));
const __VLS_275 = __VLS_274({
    ...{ 'onClick': {} },
    color: "green",
}, ...__VLS_functionalComponentArgsRest(__VLS_274));
let __VLS_277;
let __VLS_278;
let __VLS_279;
const __VLS_280 = {
    onClick: (__VLS_ctx.saveEditedStore)
};
__VLS_276.slots.default;
var __VLS_276;
var __VLS_264;
var __VLS_196;
var __VLS_192;
const __VLS_281 = {}.VDialog;
/** @type {[typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, typeof __VLS_components.VDialog, typeof __VLS_components.vDialog, ]} */ ;
// @ts-ignore
const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
    modelValue: (__VLS_ctx.successDialog),
    maxWidth: "500",
    persistent: true,
}));
const __VLS_283 = __VLS_282({
    modelValue: (__VLS_ctx.successDialog),
    maxWidth: "500",
    persistent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_282));
__VLS_284.slots.default;
const __VLS_285 = {}.VCard;
/** @type {[typeof __VLS_components.VCard, typeof __VLS_components.vCard, typeof __VLS_components.VCard, typeof __VLS_components.vCard, ]} */ ;
// @ts-ignore
const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({}));
const __VLS_287 = __VLS_286({}, ...__VLS_functionalComponentArgsRest(__VLS_286));
__VLS_288.slots.default;
const __VLS_289 = {}.VCardTitle;
/** @type {[typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, typeof __VLS_components.VCardTitle, typeof __VLS_components.vCardTitle, ]} */ ;
// @ts-ignore
const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
    ...{ class: "text-h5 text-success font-weight-bold" },
}));
const __VLS_291 = __VLS_290({
    ...{ class: "text-h5 text-success font-weight-bold" },
}, ...__VLS_functionalComponentArgsRest(__VLS_290));
__VLS_292.slots.default;
const __VLS_293 = {}.VIcon;
/** @type {[typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, typeof __VLS_components.VIcon, typeof __VLS_components.vIcon, ]} */ ;
// @ts-ignore
const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
    start: true,
    color: "success",
}));
const __VLS_295 = __VLS_294({
    start: true,
    color: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_294));
__VLS_296.slots.default;
var __VLS_296;
var __VLS_292;
const __VLS_297 = {}.VCardText;
/** @type {[typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, typeof __VLS_components.VCardText, typeof __VLS_components.vCardText, ]} */ ;
// @ts-ignore
const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({}));
const __VLS_299 = __VLS_298({}, ...__VLS_functionalComponentArgsRest(__VLS_298));
__VLS_300.slots.default;
var __VLS_300;
const __VLS_301 = {}.VCardActions;
/** @type {[typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, typeof __VLS_components.VCardActions, typeof __VLS_components.vCardActions, ]} */ ;
// @ts-ignore
const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({}));
const __VLS_303 = __VLS_302({}, ...__VLS_functionalComponentArgsRest(__VLS_302));
__VLS_304.slots.default;
const __VLS_305 = {}.VSpacer;
/** @type {[typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, typeof __VLS_components.VSpacer, typeof __VLS_components.vSpacer, ]} */ ;
// @ts-ignore
const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({}));
const __VLS_307 = __VLS_306({}, ...__VLS_functionalComponentArgsRest(__VLS_306));
const __VLS_309 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
    ...{ 'onClick': {} },
    color: "grey-darken-1",
    variant: "text",
}));
const __VLS_311 = __VLS_310({
    ...{ 'onClick': {} },
    color: "grey-darken-1",
    variant: "text",
}, ...__VLS_functionalComponentArgsRest(__VLS_310));
let __VLS_313;
let __VLS_314;
let __VLS_315;
const __VLS_316 = {
    onClick: (...[$event]) => {
        __VLS_ctx.successDialog = false;
    }
};
__VLS_312.slots.default;
var __VLS_312;
const __VLS_317 = {}.VBtn;
/** @type {[typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, typeof __VLS_components.VBtn, typeof __VLS_components.vBtn, ]} */ ;
// @ts-ignore
const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
    ...{ 'onClick': {} },
    color: "primary",
    variant: "elevated",
}));
const __VLS_319 = __VLS_318({
    ...{ 'onClick': {} },
    color: "primary",
    variant: "elevated",
}, ...__VLS_functionalComponentArgsRest(__VLS_318));
let __VLS_321;
let __VLS_322;
let __VLS_323;
const __VLS_324 = {
    onClick: (__VLS_ctx.goToCreateEvent)
};
__VLS_320.slots.default;
var __VLS_320;
var __VLS_304;
var __VLS_288;
var __VLS_284;
var __VLS_30;
var __VLS_26;
var __VLS_22;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-black']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['my-4']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['event-img']} */ ;
/** @type {__VLS_StyleScopedClasses['pa-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-subtitle-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['text-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-space-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-h5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-success']} */ ;
/** @type {__VLS_StyleScopedClasses['font-weight-bold']} */ ;
// @ts-ignore
var __VLS_40 = __VLS_39;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseAlert: BaseAlert,
            editableStore: editableStore,
            StateList: StateList,
            stores: stores,
            form: form,
            countriesList: countriesList,
            storeForm: storeForm,
            showVerificationMessage: showVerificationMessage,
            isExpanded: isExpanded,
            editDialog: editDialog,
            successDialog: successDialog,
            isUnitedStates: isUnitedStates,
            onlyAllowAlphanumeric: onlyAllowAlphanumeric,
            saveStore: saveStore,
            goToCreateEvent: goToCreateEvent,
            cancelForm: cancelForm,
            toggleForm: toggleForm,
            openEditDialog: openEditDialog,
            handleImageUpload: handleImageUpload,
            saveEditedStore: saveEditedStore,
            removeStore: removeStore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
