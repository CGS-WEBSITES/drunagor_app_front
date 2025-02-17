/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import '@fontsource/poppins'; // Import Poppins font
import '@fontsource/cinzel'




// Composables
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "DarkTheme",
    themes: {
      DarkTheme: {
        dark: true,
        colors: { // We have omitted the standard color properties here to emphasize the custom one that we've added
          background: '#141414',
          surface: '#262626',
          primary: '#363636',
          secondary: '#3d3d3d',
          terciary: '#DDDDDD', //EAEAEA
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      CoreTheme: {
        dark: false,
        colors: { // We have omitted the standard color properties here to emphasize the custom one that we've added
          background: '#172A2C',
          surface: '#274B4E',
          primary: '#3C7376',
          secondary: '#4F9398',
          terciary: '#DDDDDD', //EAEAEA
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
      ApocTheme: {
        dark: false,
        colors: { // We have omitted the standard color properties here to emphasize the custom one that we've added
          background: '#141414',
          surface: '#262626',
          primary: '#802222',
          secondary: '#3D3D3D',
          terciary: '#DDDDDD', //EAEAEA
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  typography: {
    defaultFontFamily: 'Poppins', // Set Poppins as the default font
  },
  components: {
    ...components,
    ...labsComponents,
  }
});


