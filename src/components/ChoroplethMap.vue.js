/// <reference types="../../node_modules/.vue-global-types/vue_3.5_false.d.ts" />
import { onMounted, ref, onUnmounted } from "vue";
import * as Plotly from "plotly.js-dist";
import * as d3 from "d3";
// Reference to the div container
const plotDiv = ref(null);
// Function to draw the Plotly map
const drawMap = () => {
    d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/2014_usa_states.csv").then((rows) => {
        function unpack(rows, key) {
            return rows.map((row) => row[key]);
        }
        var data = [
            {
                type: "choropleth",
                locationmode: "USA-states",
                locations: [
                    "CA",
                    "TX",
                    "WA",
                    "FL",
                    "NY",
                    "OH",
                    "IL",
                    "MI",
                    "PA",
                    "MN",
                    "VA",
                    "CO",
                    "IN",
                    "MO",
                    "NC",
                    "OR",
                    "AZ",
                    "GA",
                    "UT",
                    "MA",
                    "MD",
                    "TN",
                    "NJ",
                    "NV",
                    "OK",
                    "WI",
                    "KS",
                    "IA",
                    "KY",
                    "ID",
                    "AL",
                    "NH",
                    "AR",
                    "LA",
                    "CT",
                    "MT",
                    "DE",
                    "NM",
                    "RI",
                    "SC",
                    "NE",
                    "ME",
                    "MS",
                    "ND",
                    "VT",
                    "HI",
                    "DC",
                    "AK",
                    "PR",
                    "WV",
                    "WY",
                    "AE",
                ],
                z: [
                    463, 335, 221, 210, 197, 168, 167, 159, 152, 125, 125, 120, 120, 93,
                    101, 101, 86, 86, 81, 74, 75, 70, 90, 63, 55, 95, 38, 39, 41, 34, 32,
                    22, 20, 20, 29, 26, 26, 25, 25, 18, 18, 18, 8, 10, 10, 14, 2, 7, 7, 6,
                    5, 1,
                ],
                text: [
                    "California",
                    "Texas",
                    "Washington",
                    "Florida",
                    "New York",
                    "Ohio",
                    "Illinois",
                    "Michigan",
                    "Pennsylvania",
                    "Minnesota",
                    "Virginia",
                    "Colorado",
                    "Indiana",
                    "Missouri",
                    "North Carolina",
                    "Oregon",
                    "Arizona",
                    "Georgia",
                    "Utah",
                    "Massachusetts",
                    "Maryland",
                    "Tennessee",
                    "New Jersey",
                    "Nevada",
                    "Oklahoma",
                    "Wisconsin",
                    "Kansas",
                    "Iowa",
                    "Kentucky",
                    "Idaho",
                    "Alabama",
                    "New Hampshire",
                    "Arkansas",
                    "Louisiana",
                    "Connecticut",
                    "Montana",
                    "Delaware",
                    "New Mexico",
                    "Rhode Island",
                    "South Carolina",
                    "Nebraska",
                    "Maine",
                    "Mississippi",
                    "North Dakota",
                    "Vermont",
                    "Hawaii",
                    "District of Columbia",
                    "Alaska",
                    "Puerto Rico",
                    "West Virginia",
                    "Wyoming",
                    "Armed Forces Europe",
                ],
                autocolorscale: true,
            },
        ];
        const layout = {
            title: { text: "Backers by State" },
            geo: {
                scope: "usa",
                countrycolor: "rgb(255, 255, 255)",
                showland: true,
                landcolor: "rgb(217, 217, 217)",
                showlakes: true,
                lakecolor: "rgb(255, 255, 255)",
                subunitcolor: "rgb(255, 255, 255)",
            },
        };
        // Ensure div is available before rendering
        if (plotDiv.value) {
            Plotly.newPlot(plotDiv.value, data, layout, { showLink: false });
        }
    });
};
// Resize the map when the window resizes
const resizeMap = () => {
    if (plotDiv.value) {
        Plotly.relayout(plotDiv.value, {
            width: plotDiv.value.clientWidth,
            height: plotDiv.value.clientHeight,
        });
    }
};
onMounted(() => {
    drawMap();
    window.addEventListener("resize", resizeMap);
});
onUnmounted(() => {
    window.removeEventListener("resize", resizeMap);
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ref: ("plotDiv"),
        ...{ class: ("map-container") },
    });
    // @ts-ignore navigation for `const plotDiv = ref()`
    /** @type { typeof __VLS_ctx.plotDiv } */ ;
    ['map-container',];
    var __VLS_slots;
    var $slots;
    let __VLS_inheritedAttrs;
    var $attrs;
    const __VLS_refs = {
        'plotDiv': __VLS_nativeElements['div'],
    };
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
            plotDiv: plotDiv,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeRefs: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
