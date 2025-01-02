/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";


// Composables
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      myCustomTheme: {
        dark: false,
        colors: { // We have omitted the standard color properties here to emphasize the custom one that we've added
          background: '#172A2C',
          surface: '#274B4E',
          primary: '#274B4E',
          'primary-darken-1': '#3700B3',
          secondary: '#3C7376',
          'secondary-darken-1': '#018786',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  components: {
    ...components,
    ...labsComponents,
  }
});


