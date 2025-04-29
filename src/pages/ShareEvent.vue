<template>
    <v-row justify="center">
        <v-col cols="12" class="text-center">
            <h1 class="cinzel-text font-weight-black pl-3 pt-15 justify-center text-center text-h2">
                EVENTS
            </h1>
        </v-col>
    </v-row>

    <v-row justify="center">
        <v-col cols="12" md="6" class="ml-6">
            <v-card color="#151515">
                <v-card color="surface">
                    <v-card-text>
                        <p><v-icon>mdi-seat</v-icon> Disponible Seats: {{ selectedEvent?.seats_number }}</p>
                        <p><v-icon>mdi-sword-cross</v-icon> Scenario: {{ selectedEvent?.scenario }}</p>
                        <p class="text-end scheduled-box">
                            Scheduled for: {{
                                new Date(selectedEvent?.date).toLocaleString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                            hour12: true
                            })
                            }}
                        </p>
                    </v-card-text>

                    <v-card color="primary" min-height="130px" class="mr-4 event-card">
                        <v-row no-gutters>
                            <v-col cols="3">
                                <v-img :src="selectedEvent?.picture_hash
                                    ? `https://druna-assets.s3.us-east-2.amazonaws.com/${selectedEvent.picture_hash}`
                                    : 'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'"
                                    class="event-img" />
                            </v-col>
                            <v-col cols="9" class="pa-2">
                                <h3 class="text-subtitle-1 font-weight-bold">
                                    {{ selectedEvent?.store_name }}
                                </h3>
                                <p class="text-caption">
                                    <v-icon color="red">mdi-map-marker</v-icon>
                                    {{ selectedEvent?.address }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-card>

                    <v-card-text>
                        <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
                        <v-row v-for="(reward, index) in selectedEvent?.rewards" :key="index" class="align-center my-2">
                            <v-col cols="3">
                                <v-avatar size="60">
                                    <v-img :src="reward.image"></v-img>
                                </v-avatar>
                            </v-col>
                            <v-col cols="9">
                                <h4 class="text-subtitle-1 font-weight-bold">{{ reward.name }}</h4>
                                <p class="text-body-2">{{ reward.description }}</p>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-row class="mt-2 pb-3 ml-0">
                        <v-col cols="6" class="pa-0">
                            <v-btn block color="#907041" class="rounded-0" @click="openLoginDialog">
                                Maybe I’ll Go
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="pa-0">
                            <v-btn block color="#539041" class="rounded-0" @click="openLoginDialog">
                                Count me in
                            </v-btn>
                        </v-col>
                    </v-row>

                    <!-- Dialog de login -->
                    <v-dialog v-model="showLoginDialog" width="460">
                        <v-card color="#1e1e1e" class="pa-4">
                            <v-card-title class="text-h6 text-center text-white">
                                Join an Event
                            </v-card-title>

                            <v-card-text class="text-center text-white">
                                To join a Drunagor event, you must be logged in.<br /><br />
                                After logging in, you can find this event by visiting the
                                <strong>Events</strong> tab.
                            </v-card-text>

                            <v-card-actions class="justify-center mt-2">
                                <v-btn variant="outlined" color="white" class="mx-2" size="small" @click="goToLogin">
                                    LOG IN
                                </v-btn>

                                <v-btn variant="outlined" color="white" class="mx-2" size="small" @click="goToSignup">
                                    SIGN UP
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const axios = inject("axios");

const selectedEvent = ref(null);
const showLoginDialog = ref(false);

const openLoginDialog = () => {
    showLoginDialog.value = true;
};

const goToLogin = () => {
    router.push({ path: "/login", query: { tab: "login" } });
};

const goToSignup = () => {
    router.push({ path: "/login", query: { tab: "signup" } });
};

const fetchEvent = async () => {
    try {
        const eventIdEncoded = route.params.id;
        if (!eventIdEncoded) throw new Error("Missing ID");

        const decodedId = atob(eventIdEncoded);
        const response = await axios.get(`/events/${decodedId}`);
        selectedEvent.value = response.data;
    } catch (err) {
        console.error("Event fetch failed:", err);
    }
};

onMounted(fetchEvent);
</script>


<style scoped>
/* Event Card */
.event-card {
    display: flex;
    align-items: center;
    border-radius: 8px;
    padding: 10px;
    margin-left: 18px;
    background-color: #292929;
}

/* Event Image */
.event-img {
    width: 110px;
    height: 110px;
    border-radius: 4px;
}

/* Sort Buttons */
.sort-btn {
    font-weight: bold;
    text-transform: uppercase;
    color: white;
}

.sort-btn.active {
    text-decoration: underline;
}

.scheduled-box {
    display: inline-block;
    /* Faz o fundo se ajustar ao tamanho do conteúdo */
    background-color: white;
    /* Fundo branco */
    padding: 6px 12px;
    /* Espaçamento interno */
    border-radius: 20px;
    /* Bordas arredondadas */
    font-size: 14px;
    /* Tamanho do texto */
    font-weight: 500;
    /* Peso do texto */
    color: black;
    /* Cor do texto */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Sombra leve para destacar */
}

.scheduled-box strong {
    font-weight: bold;
    /* Deixa "SCHEDULED FOR:" em negrito */
}
</style>

<style>
.cinzel-text {
    font-family: "Cinzel", serif;
}

.EventsTabs {
    background: #424242;
    transform: translateY(-8px);
    position: relative;
}

.CreateNew {
    position: relative;
    transform: translateY(-8px) translateX(12px);
    background-color: #484848;
}

.SortBy {
    position: relative;
    transform: translateY(-8px) translateX(12px);
    background-color: #292929;
}

.event-card {
    cursor: pointer;
    transition: 0.2s ease-in-out;
}

.event-card:hover {
    transform: scale(1.02);
}

.event-dialog-img {
    border-radius: 8px;
}

.rewards-container {
    gap: -40px;
}

.dark-background {
    background-color: #121212;
    color: white;
}

.date-input {
    max-width: 190px;
}

.hour-input {
    max-width: 110px;
    margin-left: 10px;
}

.launch-btn {
    background-color: white;
    color: black;
    font-weight: bold;
}

.selected-reward {
    opacity: 1;
    transition: all 0.2s ease-in-out;
}

.unselected-reward {
    filter: grayscale(100%);
    opacity: 0.5;
    transition: all 0.2s ease-in-out;
}

.check-icon {
    position: absolute;
    top: -5px;
    right: -5px;
    background: white;
    border-radius: 50%;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    color: red;
}

.redbutton {
    background: #691d1d;
    transform: translateY(px) translateX(-0px);
    width: 80px;
    height: 160px;
}

.editbutton {
    background: gray;
    transform: translateX(10px);
    width: 80px;
    height: 160px;
}
</style>