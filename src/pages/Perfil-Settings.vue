<template>

  <v-container class="d-flex justify-center">
    <profile-card
      profileImage="src/assets/Imagem colada.png"
      altText="User Profile"
      title="MagoVeio99MagiALot"
      :points="9844522"
      :ranking="99999"
      user-since="11/11/2011"
    />
  </v-container>

  <navigation-bar
    :buttons="buttons"
    :separators="[true, false, true, true, false]"
  />
  <AccountForm/>

  <Privacy/>

  <AdOptions
  />


</template>


<script lang="ts" setup>
import ProfileCard from '@/components/ProfileCard.vue';
import NavigationBar from '@/components/NavigationBar.vue';

const buttons = [
  { icon: 'mdi-account', value: 'profile' },
  { icon: 'mdi-square-edit-outline', value: 'edit' },
  { icon: 'mdi-magnify', value: 'search' },
  { icon: 'mdi-account-group', value: 'group' },
  { icon: 'mdi-cog-outline', value: 'settings' },
  { icon: 'mdi-logout', value: 'logout' },
];



</script>

<style scoped>

</style>
