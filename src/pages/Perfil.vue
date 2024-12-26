<template>
  <v-row no-gutters>
    <v-col cols="12">
      <profile-card profileImage="https://pbs.twimg.com/media/FBPOkeXXMAE9-lN.jpg" altText="User Profile"
        title="MagoVeio99MagiALot" :points="9844522" :ranking="99999" user-since="11/11/2011"
        style="background-image: src/assets/awakenings.webp" />
    </v-col>
    <v-col cols="12">
      <navigation-bar :buttons="buttons" :separators="[true, false, true, true, false]" />
    </v-col>
    <v-col cols="12">
      <router-view />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>

</script>

<style scoped></style>
