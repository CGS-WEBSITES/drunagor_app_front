<template>

    <v-row no-gutters>
        <v-col cols="12">
            <FavoriteCampaignCard
                image="https://i.ibb.co/bJzLDg8/21312312313123.png"
                title="FAVORITE CAMPAIGN"
                subtitle="CoD: Age of Darkness"
                subtitle2="The Rise of the Undead Dragon" 
                details="Door 01 - The entrance to the citadel - Chapter 2" />
            <statistics-card title="STATISTICS" :stats="statsData" user-since="11/11/2011" />
            <achievements-list title="ACHIEVEMENTS" total="13/37" :achievements="achievementsData" />
            <badges-list title="BADGES" total="13/37" :badges="badgesData" />
        </v-col>
    </v-row>

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
        image: 'https://i.ibb.co/9cBwVj9/Rectangle12213121.png',
        title: 'GREAT ACHIEVEMENT',
        description: 'Achievement short description here cabe duas',
        date: '11/11/2024',
        icon: 'mdi-trophy',
        progress: '15/43',
    },
    {
        image: 'https://i.ibb.co/9cBwVj9/Rectangle12213121.png',
        title: 'GREAT ACHIEVEMENT',
        description: 'Achievement short description here cabe duas',
        date: '11/11/2024',
        icon: 'mdi-trophy',
        progress: '15/43',
    },
    {
        image: 'https://i.ibb.co/9cBwVj9/Rectangle12213121.png',
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
        image: 'https://i.ibb.co/8MQPSjg/Rectangle121.webp', // Substituir pelo caminho da imagem
        title: 'BADGE FODA 1',
        description: 'MT MIDIAAAAA',
        date: '11/11/2024',
        icon: 'mdi-police-badge',
        progress: '15/43',
    },
    {
        image: 'https://i.ibb.co/8MQPSjg/Rectangle121.webp',
        title: 'BADGE FODA 2',
        description: 'MT MIDAAAA 2',
        date: '11/11/2024',
        icon: 'mdi-police-badge',
        progress: '15/43',
    },
    {
        image: 'https://i.ibb.co/8MQPSjg/Rectangle121.webp',
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