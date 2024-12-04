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
  <statistics-card
    title="STATISTICS"
    :stats="statsData"
    user-since="11/11/2011"
  />
  <achievements-list
    title="ACHIEVEMENTS"
    total="[TOTAL]"
    :achievements="achievementsData"
  />
  <FavoriteCampaignCard
    image="https://lh6.googleusercontent.com/proxy/2qMKbpv3vomFIt5hI_Rxy6fuNTDBuQMR7IC6wx-4fWYguoWKNXz27FwuwLmNS-iMQa8CqHyPEDrcWIyW8WikWY8gd20NVuoMCgv7uxST8nxBbNq5z0YZYs7mzhStq_Q"
    title="FAVORITE CAMPAIGN"
    subtitle="Chronicles of Drunagor: Age of Darkness The Rise of the Undead Dragon"
    progress="100"
    details="Door 01 - The entrance to the citadel - Chapter 2"
  />
  <badges-list
    title="BADGES"
    total="[TOTAL]"
    :badges="badgesData"
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

import StatisticsCard from '@/components/StatisticsCard.vue';

// Dados das estatísticas
const statsData = [
  { category: 'Statistic Category', name: 'Statistic name [10/100] %total%' },
  { category: 'Statistic Category', name: 'Statistic name: 97 TIMES' },
  { category: 'Statistic Category', name: 'Statistic name [10/100] %total%' },
];

import AchievementsList from '@/components/AchievementsList.vue';

// Dados das conquistas
const achievementsData = [
  {
    image: 'https://cdn-icons-png.flaticon.com/512/1312/1312197.png', // Substituir pelo caminho da imagem
    title: 'GREAT ACHIEVEMENT',
    description: 'Achievement short description here cabe duas',
    date: '11/11/2024',
    icon: 'mdi-trophy',
    progress: '15/43',
  },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/1312/1312197.png',
    title: 'GREAT ACHIEVEMENT',
    description: 'Achievement short description here cabe duas',
    date: '11/11/2024',
    icon: 'mdi-trophy',
    progress: '15/43',
  },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/1312/1312197.png',
    title: 'GREAT ACHIEVEMENT',
    description: 'Achievement short description here cabe duas',
    date: '11/11/2024',
    icon: 'mdi-trophy',
    progress: '15/43',
  },
  // Adicione mais conquistas conforme necessário
];

import badgesList from '@/components/Badges.vue';

const badgesData = [
  {
    image: 'https://cdn.mos.cms.futurecdn.net/P9nEHqSzs3dUrSdmBDrPxn.jpg', // Substituir pelo caminho da imagem
    title: 'BADGE FODA 1',
    description: 'MT MIDIAAAAA',
    date: '11/11/2024',
    icon: 'mdi-police-badge',
    progress: '15/43',
  },
  {
    image: 'https://cdn.mos.cms.futurecdn.net/P9nEHqSzs3dUrSdmBDrPxn.jpg',
    title: 'BADGE FODA 2',
    description: 'MT MIDAAAA 2',
    date: '11/11/2024',
    icon: 'mdi-police-badge',
    progress: '15/43',
  },
  {
    image: 'https://i.pinimg.com/736x/41/41/6a/41416adf9a5754774ed8798406808dfd.jpg',
    title: 'BADGE FODA 3',
    description: 'MT MIDIAAAAA 3',
    date: '11/11/2024',
    icon: 'mdi-police-badge',
    progress: '15/43',
  },
  // Adicione mais conquistas conforme necessário
];


</script>

<style scoped>

</style>
