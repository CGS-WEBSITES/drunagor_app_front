/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
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
        colors: {
          background: '#141414',
          surface: '#262626',
          primary: '#363636',
          secondary: '#3d3d3d',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#00F5FF', // Neon Cyan
        },
      },
      CoreTheme: {
        dark: false,
        colors: {
          background: '#172A2C',
          surface: '#274B4E',
          primary: '#3C7376',
          secondary: '#4F9398',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#FFD700', // Bright Gold
        },
      },
      ApocTheme: {
        dark: true,
        colors: {
          background: '#141414',
          surface: '#262626',
          primary: '#802222',
          secondary: '#3D3D3D',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#FF3E3E', // Neon Crimson/Red
        },
      },
      NightsTheme: {
        dark: true,
        colors: {
          background: '#22162C',
          surface: '#3F2851',
          primary: '#5D3C76',
          secondary: '#774D98',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#A3E635', // Lime Green
        },
      },
      EarthTheme: {
        dark: true,
        colors: {
          background: '#3C2510',
          surface: '#5B3919',
          primary: '#804F22',
          secondary: '#A66A32',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#39FF14', // Neon Green
        },
      },
      BlueTheme: {
        dark: true,
        colors: {
          background: '#102139',
          surface: '#1A3660',
          primary: '#224780',
          secondary: '#2F60AA',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#FF9F00', // Neon Orange
        },
      },
      CrimsonTheme: {
        dark: true,
        colors: {
          background: '#421111',
          surface: '#6B1C1C',
          primary: '#802222',
          secondary: '#A33131',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#FFFF00', // Neon Yellow
        },
      },
      VioletTheme: {
        dark: true,
        colors: {
          background: '#2A0F36',
          surface: '#4F1B66',
          primary: '#622280',
          secondary: '#783198',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#00FFFF', // Cyan
        },
      },
      RoseTheme: {
        dark: true,
        colors: {
          background: '#392020',
          surface: '#582E2E',
          primary: '#763C3C',
          secondary: '#9C5151',
          terciary: '#DDDDDD',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          playbutton: '#FF007F', // Neon Rose/Pink
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
