<template>
  <v-container style="min-width: 360px;" class="pa-0 ">
  <v-card
    class="profile-card mx-auto py-0"
    rounded="0"
    elevation="3"
    

    style=";overflow: visible; position: relative; text-align: center;"
  >
  <div class="position-relative">
      <v-img
        src="/home/dudu/Documentos/app-drunagor-front/src/assets/AGE_Arte271.png"
        alt="Background Image"
        max-height="729px"
        max-width="100%"
        cover
        
      ></v-img>

      <v-btn
  icon="mdi-pencil"
  class="position-absolute top-0 right-0 ma-2"
  color="rgba(0, 0, 0, 0.6)"
  elevation="3"
  :to="'/perfil/perfil-image'"
></v-btn>
    </div>
    
    <v-img
      :src="profileImage"
      :alt="altText"
      max-width="118"
      style="
        top: -30px;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 0.5px solid white;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
      "
    ></v-img>


    <v-card-text>
      <div class="user-info" style="margin-top: -80px;">
        <p class="user-name" style="font-weight: bold; font-size: 1.4rem;">
          {{ title }}
        </p>
        <p class="user-points" style="font-size: 1.1rem;">
          {{ points }} pts
        </p>
        <p class="user-ranking" style="font-size: 1.1rem;">
          {{ ranking }}°
        </p>
      </div>
    </v-card-text>
  </v-card>
</v-container>


</template>

<script lang="ts" setup>
defineProps({
  profileImage: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: 'Profile Picture',
  },
  title: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  ranking: {
    type: Number,
    required: true,
  },
  userSince: {
    type: String,
    required: true,
  },
});
</script>
