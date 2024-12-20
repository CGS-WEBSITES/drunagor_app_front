<template>
    <v-container max-width="800" class="pa-2">
      <v-card rounded="lg" elevation="3">
        <v-card-title
          class="d-flex justify-space-between align-center"
          @click="toggleExpanded"
        >
          <span class="text-h5 font-weight-black pl-3 pt-2 pb-2">AVATAR</span>
          <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-card-title>
  
        <v-expand-transition>
          <v-card-text v-if="isExpanded">
            <v-row>
              <v-col
                v-for="(avatar, index) in avatars"
                :key="index"
                cols="4"
                sm="4"
                lg="3" 
                class="d-flex justify-center align-center"
              >
                <v-img
                  :src="avatar.image"
                  alt="Avatar"
                  max-width="200"
                  max-height="200"
                  class="rounded-lg"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-container>

    <v-container max-width="800" class="pa-2">
      <v-card rounded="lg" elevation="3">
        <v-card-title
          class="d-flex justify-space-between align-center"
          @click="toggleExpanded1"
        >
          <span class="text-h5 font-weight-black pl-3 pt-2 pb-2">BACKGROUNDS</span>
          <v-icon>{{ isExpanded1 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-card-title>
  
        <v-expand-transition>
          <v-card-text v-if="isExpanded1">
            <v-row>
              <v-col
                v-for="(avatar, index) in back"
                :key="index"
                cols="6"
                sm=""
                lg="6" 
                class="d-flex justify-center align-center"
              >
                <v-img
                  :src="avatar.image"
                  alt="Avatar"
                  max-width="800"
                  max-height="600"
                  class="rounded-lg"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-container>

    <v-container max-width="800" class="pa-2">
      <v-card rounded="lg" elevation="3">
        <v-card-title
          class="d-flex justify-space-between align-center"
          @click="toggleExpanded2"
        >
          <span class="text-h5 font-weight-black pl-3 pt-2 pb-2">COLOR</span>
          <v-icon>{{ isExpanded2 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-card-title>
  
        <v-expand-transition>
          <v-card-text v-if="isExpanded2">
            <v-row>
              <v-col
                v-for="(avatar, index) in color"
                :key="index"
                cols="4"
                sm="4"
                lg="3" 
                class="d-flex justify-center align-center"
              >
                <v-img
                  :src="avatar.image"
                  alt="Avatar"
                  max-width="200"
                  max-height="200"
                  class="rounded-lg"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-container>


  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';

  const isExpanded = ref(false);
  const isExpanded1 = ref(false);
  const isExpanded2 = ref(false);
  
  const avatars = ref([
    { image: 'https://pbs.twimg.com/media/FMFSl1nWUAEWfH4.png' }, // Substitua com URLs de imagens reais
    { image: 'https://pbs.twimg.com/media/F_QpCoAXEAAQ4i5.png' },
    { image: 'https://pbs.twimg.com/media/F_QyAkqWQAEoa8B.png' },
    { image: 'https://pbs.twimg.com/media/FMIx8qWWQAUSWcH.jpg:large' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1nEi1_5tCqWt4-fy-nIHQOzULoJbreh0qIQ&s' },
    { image: 'https://pbs.twimg.com/media/FON11yUXEAUQ62z.jpg' },
  ]);

  const back = ref([
    { image: 'https://i.pinimg.com/originals/47/24/3e/47243e1d51883c7982c681759c99b720.jpg' }, // Substitua com URLs de imagens reais
    { image: 'https://wallpapergod.com/images/hd/anime-1920X1080-wallpaper-zt2ofpcty3uddiht.jpeg' },
    { image: 'https://wallpapersmug.com/download/1920x1080/058c6f/a-world-full-of-red.jpg' },
    { image: 'https://wallpapers.com/images/hd/dark-anime-scenery-wot9wg412s7h8yxa.jpg' },
    { image: 'https://i.redd.it/4g3lhgf6t9sb1.jpg' },
    { image: 'https://wallpapercat.com/w/full/3/a/3/5816740-1920x1080-desktop-hd-cool-anime-background-image.jpg' },
  ]);

  const color = ref([
    { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solid_red.svg/1024px-Solid_red.svg.png' }, // Substitua com URLs de imagens reais
    { image: 'https://cdn.shopify.com/s/files/1/0560/8177/6714/products/wall-paint-color-vernice-rc-neutrals-017-50565A.jpg?v=1666960890' },
    { image: 'https://images.tcdn.com.br/img/img_prod/700425/tinta_acrilica_ss288_bright_green_8941_1_e555cddd9def8b0f2f50d16803f67982.jpg' },
  ]);
  
  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
  };

  const toggleExpanded1 = () => {
    isExpanded1.value = !isExpanded1.value;
  };

  const toggleExpanded2 = () => {
    isExpanded2.value = !isExpanded2.value;
  };
  
  
  </script>
 
  