<template>
  <v-container max-width="800" style="min-width: 360px;" class="pa-4">
    <v-card rounded="lg" elevation="3" color="primary" class="pl-1 pt-1 pr-1 pb-0">
      <!-- Cabeçalho -->
      <v-card-title class="d-flex justify-space-between pb-0">
        <span class="text-uppercase font-weight-black text-bold text-h5 mb-4 pb-0">BADGES</span>
      </v-card-title>

      <!-- Virtual Scroller -->
      <div v-if="userRewards.length > 0">
  <v-virtual-scroll class="pt-0" :items="userRewards" :item-height="130">
    <template #default="{ item }">
      <v-card
        rounded="lg"
        elevation="3"
        class="py-2 px-0 mb-2 d-flex align-center"
        color="secundary"
      >
        <v-row class="align-center">
          <!-- Ícone -->
          <v-col cols="2" lg="2" class="d-flex align-center justify-center ml-3 ml-md-0">
            <v-img
              :src="item.image"
              alt="Reward Icon"
              max-height="80"
              class="rounded-lg"
            ></v-img>
          </v-col>

          <!-- Detalhes -->
          <v-col cols="9" class="pl-0 d-flex flex-column justify-center">
            <p class="font-weight-bold white--text ma-0">{{ item.title }}</p>
            <p class="text-body-2 grey--text ma-0">{{ item.description }}</p>
            <p class="text-caption grey--text ma-0">{{ item.date }}</p>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-virtual-scroll>
</div>

<!-- Mensagem de nenhum reward -->
<div v-else class="text-center py-2">
  <v-icon color="grey lighten-1" size="48">mdi-emoticon-sad-outline</v-icon>
  <p class="mt-4 text-body-1 white--text font-weight-medium">
    You don't have any rewards yet.
  </p>
  <p class="text-caption grey--text pb-2">
    Join events to fight for them!
  </p>
</div>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userRewards = ref([]);

const fetchUserRewards = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('app_user'));
    if (!userData?.users_pk) return;

    const response = await axios.get('/rl_users_rewards/list_rewards', {
      params: { users_fk: userData.users_pk },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    userRewards.value = (response.data.rewards || []).map((reward) => ({
      image: `https://druna-assets.s3.us-east-2.amazonaws.com/${reward.picture_hash}`,
      title: reward.name,
      description: '',
      date: new Date(reward.date).toLocaleDateString(),
    }));
  } catch (err) {
    console.error('❌ Erro ao buscar rewards do usuário:', err);
    userRewards.value = [];
  }
};

onMounted(() => {
  fetchUserRewards();
});
</script>
