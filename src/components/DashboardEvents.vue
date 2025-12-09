<template>
  <v-card color="primary" class="fill-height d-flex flex-column w-100">
    <v-tabs v-model="activeTab" bg-color="background" grow class="flex-grow-0 mb-3">
      <v-tab value="upcoming">Events</v-tab>
      <v-tab value="myevents">My Events</v-tab>
    </v-tabs>

    <div class="flex-grow-1 mt-2 content-scroll" style="overflow-y:auto">
      <div v-if="activeTab==='upcoming'" class="px-2 py-3 fill-height d-flex flex-column">
        <div v-if="loading" class="d-flex justify-center align-center" style="height:200px">
          <v-progress-circular indeterminate color="primary"/>
        </div>
        <div v-else class="d-flex flex-column flex-grow-1">
          <div v-if="upcomingEventsPreviewSliced.length>0">
            <v-row dense class="mx-n1">
              <v-col cols="12" md="6" v-for="event in upcomingEventsPreviewSliced" :key="event.events_pk" class="px-1">
                <v-card color="terciary" class="pt-0 pb-2 event-card" @click="openDialog(event)">
                  <v-img v-if="getSeasonInfo(event.seasons_fk).flag" :src="getSeasonInfo(event.seasons_fk).flag" class="season-flag"/>
                  <v-row no-gutters align="center">
                    <v-col cols="3" class="d-flex justify-center">
                      <div class="text-center" style="width:70px;color:black">
                        <p class="pt-3 text-caption font-weight-bold">
                          {{ new Date(event.event_date).toLocaleDateString('en-US',{month:'short'}).toUpperCase() }}
                        </p>
                        <p class="cinzel-text text-h3 font-weight-bold">
                          {{ String(event.event_date).split('T')[0].split('-')[2] }}
                        </p>
                        <p class="text-caption font-weight-bold">
                          {{ new Date(event.event_date).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}) }}
                        </p>
                      </div>
                    </v-col>
                    <v-col cols="7" class="pt-2" :class="display.xs.value?'pl-4':''">
                      <h3 class="pb-1">
                        <v-icon class="pr-1" size="small" color="black">mdi-chess-rook</v-icon>
                        {{ event.store_name }}
                      </h3>
                      <p class="text-caption text-truncate">
                        <v-icon color="red">mdi-map-marker</v-icon>
                        {{ event.address }}
                      </p>
                      <p class="text-caption">
                        <v-icon color="red">mdi-sword-cross</v-icon>
                        {{ event.scenario }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-btn
              v-if="upcomingEventsPreview.length>=itemsLimit"
              block
              color="white"
              class="text-black mt-2 see-all-btn"
              @click="goToEvents"
            >See all events</v-btn>
          </div>
          <div v-else class="d-flex fill-height align-center justify-center">
            <v-card color="transparent" flat class="text-center pa-5 fill-height d-flex align-center justify-center">
              <p>No upcoming events at the moment.</p>
            </v-card>
          </div>
        </div>
      </div>

      <div v-else class="px-2 py-3 fill-height d-flex flex-column">
        <div v-if="loading" class="d-flex justify-center align-center" style="height:200px">
          <v-progress-circular indeterminate color="primary"/>
        </div>
        <div v-else class="d-flex flex-column flex-grow-1">
          <div v-if="myEventsPreviewSliced.length>0">
            <v-row dense class="mx-n1">
              <v-col cols="12" md="6" v-for="event in myEventsPreviewSliced" :key="event.events_pk" class="px-1">
                <v-card color="terciary" class="pt-0 pb-2 event-card" @click="openMyEventsDialog(event)">
                  <v-img v-if="getSeasonInfo(event.seasons_fk).flag" :src="getSeasonInfo(event.seasons_fk).flag" class="season-flag"/>
                  <v-row no-gutters align="center">
                    <v-col cols="3" class="d-flex justify-center">
                      <div class="text-center" style="width:70px;color:black">
                        <p class="pt-3 text-caption font-weight-bold">
                          {{ new Date(event.event_date).toLocaleDateString('en-US',{month:'short'}).toUpperCase() }}
                        </p>
                        <p class="cinzel-text text-h3 font-weight-bold">
                          {{ String(event.event_date).split('T')[0].split('-')[2] }}
                        </p>
                        <p class="text-caption font-weight-bold">
                          {{ new Date(event.event_date).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}) }}
                        </p>
                      </div>
                    </v-col>
                    <v-col cols="9" class="pt-2" :class="display.xs.value?'pl-4':''">
                      <h3 class="pb-1">
                        <v-icon class="pr-1" size="small" color="black">mdi-chess-rook</v-icon>
                        {{ event.store_name }}
                      </h3>
                      <p class="text-caption text-truncate">
                        <v-icon color="red">mdi-map-marker</v-icon>
                        {{ event.address }}
                      </p>
                      <p class="text-caption">
                        <v-icon color="red">mdi-sword-cross</v-icon>
                        {{ event.scenario }}
                      </p>
                    </v-col>
                  </v-row>
                  <div style="position:absolute;bottom:8px;right:8px;z-index:3">
                    <v-tooltip :text="getEventStatusInfo(event.status).tooltip" location="top">
                      <template #activator="{ props }">
                        <v-icon v-bind="props" :color="getEventStatusInfo(event.status).color" size="large">
                          {{ getEventStatusInfo(event.status).icon }}
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-btn
              v-if="myEventsPreview.length>=itemsLimit"
              block
              color="white"
              class="text-black mt-2 see-all-btn"
              @click="goToEvents"
            >See all events</v-btn>
          </div>
          <div v-else class="d-flex fill-height align-center justify-center">
            <v-card color="transparent" flat class="text-center pa-5 fill-height d-flex align-center justify-center">
              <p>You have no upcoming events.</p>
            </v-card>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="600">
      <v-card color="surface" style="position:relative">
        <div v-if="dialogLoading" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary"/>
        </div>
        <v-card-actions class="d-flex justify-left"><v-btn color="red" @click="dialog=false">X</v-btn></v-card-actions>
        <v-card-text>
          <v-btn block color="blue" size="small" variant="flat" class="mb-4" @click="shareEvent(selectedEvent?.events_pk)">
            <v-icon start>mdi-share-variant</v-icon>
            Share Event
          </v-btn>
          <p><v-icon>mdi-seat</v-icon> Available Seats: {{ selectedEvent?.seats_number }}</p>
          <p><v-icon>mdi-sword-cross</v-icon> Scenario: {{ selectedEvent?.scenario }}</p>
          <p v-if="getSeasonInfo(selectedEvent?.seasons_fk).name"><v-icon>mdi-shield-sun</v-icon> Season: {{ getSeasonInfo(selectedEvent.seasons_fk).name }}</p>
          <p class="text-end scheduled-box">
            Scheduled for:
            {{ new Date(selectedEvent?.event_date).toLocaleString('en-US',{month:'2-digit',day:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) }}
          </p>
        </v-card-text>
        <v-card color="primary" min-height="130px" class="mx-4 event-card-dialog" @click="openInGoogleMaps">
          <v-row no-gutters>
            <v-col cols="3" lg="3"><v-img :src="selectedEvent?.picture_hash?`https://assets.drunagor.app/${selectedEvent.picture_hash}`:'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'" class="event-img"/></v-col>
            <v-col cols="9" class="pa-2">
              <h3 class="text-subtitle-1 font-weight-bold">{{ selectedEvent?.store_name }}</h3>
              <p class="text-caption"><v-icon color="red">mdi-map-marker</v-icon> {{ selectedEvent?.address }}</p>
            </v-col>
          </v-row>
        </v-card>
        <v-card color="primary" class="mx-4 mt-4 event-card">
          <v-responsive style="width:100%;height:200px" aspect-ratio="16/9">
            <iframe v-if="selectedEvent?.latitude" :src="`https://maps.google.com/maps?q=${selectedEvent.latitude},${selectedEvent.longitude}&z=15&output=embed`" frameborder="0" style="border:0;width:100%;height:100%" allowfullscreen loading="lazy"/>
          </v-responsive>
        </v-card>
        <v-card-text v-if="eventRewards.length">
          <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
          <v-row v-for="reward in eventRewards" :key="reward.rewards_pk" class="align-center my-2">
            <v-col cols="3" md="2"><v-avatar size="60"><v-img :src="`https://assets.drunagor.app/${reward.picture_hash}`"/></v-avatar></v-col>
            <v-col cols="9" md="10">
              <h4 class="text-subtitle-1 font-weight-bold">{{ reward.name }}</h4>
              <p class="text-body-2">{{ reward.description }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <BaseAlert v-model="showAlert" :type="alertType" class="mt-4 mx-4" border="start" variant="tonal" closable>
          <span v-html="alertMessage"></span>
        </BaseAlert>
        <v-row class="mt-2 ml-0"><v-col cols="12" class="mb-2"><v-btn block color="#539041" class="rounded-0" @click="joinEvent">Count me in</v-btn></v-col></v-row>
        <v-dialog v-model="showDialog" width="400">
          <v-card style="position:relative">
            <v-card-title class="text-h6">Share Event</v-card-title>
            <v-card-text><v-text-field v-model="sharedLink" label="Event Link" readonly density="compact" hide-details/></v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="success" size="small" @click="copyLink(sharedLink)">Copy Link</v-btn>
              <v-btn color="grey" size="small" @click="showDialog=false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>

    <v-dialog v-model="myDialog" max-width="700">
      <v-card color="surface" class="pa-6" style="position:relative">
        <div v-if="dialogLoading" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary"/>
        </div>
        <div class="d-flex align-center justify-space-between pl-8">
          <v-card-title class="text-h6 font-weight-bold pa-0">{{ selectedMyEvent?.store_name }}</v-card-title>
          <v-icon color="red" @click="myDialog=false" class="mr-2" style="cursor:pointer">mdi-close</v-icon>
        </div>
        <div class="mt-1 pl-6" style="display:inline-block">
          <p class="text-caption scheduled-box ma-0">
            Scheduled for:
            {{ new Date(selectedMyEvent?.event_date).toLocaleString('en-US',{month:'2-digit',day:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) }}
          </p>
        </div>
        <v-row>
          <v-col cols="12" class="text-center px-5">
            <v-row>
              <v-col cols="12" class="d-flex align-center justify-center mb-2">
                <p class="text-subtitle-2 font-weight-medium my-0 mr-2">Status: {{ currentPlayer?.event_status }}</p>
                <v-btn icon="mdi-refresh" variant="text" size="small" :loading="isRefreshingStatus" @click="refreshEventStatus()"/>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-btn class="mb-4" block color="green" @click="showCampaignDialog=true" :disabled="!currentPlayer||currentPlayer.event_status!=='Joined the Quest'">Join Campaign</v-btn>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-btn class="mb-8" block color="red" @click="quitEvent()">Quit Event</v-btn>
              </v-col>
            </v-row>
            <BaseAlert v-model="showQuitSuccessAlert" type="success" title="Success" class="mb-4" variant="tonal" closable>You have successfully left the event.</BaseAlert>
            <BaseAlert v-model="showQuitErrorAlert" type="error" title="Failed to Leave Event" class="mb-4" variant="tonal" closable>{{ quitErrorMessage }}</BaseAlert>
          </v-col>
        </v-row>
        <v-card color="primary" min-height="130px" class="mx-4 event-card-dialog" @click="openInGoogleMaps">
          <v-row no-gutters>
            <v-col cols="3" lg="3"><v-img :src="selectedMyEvent?.picture_hash?`https://assets.drunagor.app/${selectedMyEvent.picture_hash}`:'https://s3.us-east-2.amazonaws.com/assets.drunagor.app/Profile/store.png'" class="event-img"/></v-col>
            <v-col cols="9" class="pa-2">
              <h3 class="text-subtitle-1 font-weight-bold">{{ selectedMyEvent?.store_name }}</h3>
              <p class="text-caption"><v-icon color="red">mdi-map-marker</v-icon> {{ selectedMyEvent?.address }}</p>
            </v-col>
          </v-row>
        </v-card>
        <v-card color="primary" class="mx-4 mt-4 event-card">
          <v-responsive style="width:100%;height:200px" aspect-ratio="16/9">
            <iframe v-if="selectedMyEvent?.latitude" :src="`https://maps.google.com/maps?q=${selectedMyEvent.latitude},${selectedMyEvent.longitude}&z=15&output=embed`" frameborder="0" style="border:0;width:100%;height:100%" allowfullscreen loading="lazy"/>
          </v-responsive>
        </v-card>
        <v-card-text v-if="eventRewards.length">
          <h3 class="text-h6 font-weight-bold">REWARDS:</h3>
          <v-row v-for="(reward,index) in eventRewards" :key="index" class="align-center my-2">
            <v-col cols="3" md="2"><v-avatar size="60"><v-img :src="`https://assets.drunagor.app/${reward.picture_hash}`"/></v-avatar></v-col>
            <v-col cols="9" md="10">
              <h4 class="text-subtitle-1 font-weight-bold">{{ reward.name }}</h4>
              <p class="text-body-2">{{ reward.description }}</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showQuitConfirmDialog" max-width="400">
      <v-card style="position:relative">
        <div v-if="dialogLoading" class="dialog-overlay">
          <v-progress-circular indeterminate size="80" color="primary"/>
        </div>
        <v-card-title class="text-h6">Confirm Exit</v-card-title>
        <v-card-text>Are you sure you want to quit this event? This action cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="grey" text @click="showQuitConfirmDialog=false">Cancel</v-btn>
          <v-btn color="red-darken-2" text @click="confirmQuitEvent">Quit Event</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCampaignDialog" max-width="320" persistent/>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useUserStore } from '@/store/UserStore'
import { useRouter } from 'vue-router'
import BaseAlert from '@/components/Alerts/BaseAlert.vue'
import s1flag from '@/assets/s1flag.png'
import s2flag from '@/assets/s2flag.png'

const router = useRouter()
const userStore = useUserStore()
const axios: any = inject('axios')
const display = useDisplay()

const activeTab = ref<'upcoming'|'myevents'>('upcoming')
const loading = ref(true)
const dialogLoading = ref(false)
const allEvents = ref<any[]>([])
const myEvents = ref<any[]>([])
const playerFk = ref<string|null>(null)
const players = ref<any[]>([])

const dialog = ref(false)
const selectedEvent = ref<any>(null)
const eventRewards = ref<any[]>([])
const showAlert = ref(false)
const alertType = ref<'success'|'error'|'info'|'warning'>('success')
const alertMessage = ref('')
const showDialog = ref(false)
const sharedLink = ref('')

const myDialog = ref(false)
const selectedMyEvent = ref<any>(null)
const showQuitConfirmDialog = ref(false)
const rlEventsUsersPkToQuit = ref<any>(null)
const isRefreshingStatus = ref(false)
const showQuitSuccessAlert = ref(false)
const showQuitErrorAlert = ref(false)
const quitErrorMessage = ref('')
const showCampaignDialog = ref(false)

const filterAndSortUpcoming = (eventList:any[]) => {
  const now = new Date()
  return eventList.filter(e => new Date(e.event_date)>now).sort((a,b)=>new Date(a.event_date).getTime()-new Date(b.event_date).getTime())
}

const upcomingEventsPreview = computed(()=>filterAndSortUpcoming(allEvents.value))
const myEventsPreview = computed(()=>filterAndSortUpcoming(myEvents.value))

const itemsLimit = computed(()=>{
  if (display.xs.value) return 4
  if (display.sm.value || display.md.value) return 5
  return 12
})

const upcomingEventsPreviewSliced = computed(()=>upcomingEventsPreview.value.slice(0,itemsLimit.value))
const myEventsPreviewSliced = computed(()=>myEventsPreview.value.slice(0,itemsLimit.value))

const currentPlayer = computed(()=>{
  if(!userStore.user?.users_pk) return null
  return players.value.find(p=>p.users_pk===userStore.user.users_pk)||null
})

const goToEvents = () => router.push({ name:'Events' })

const openInGoogleMaps = () => {
  const event = dialog.value?selectedEvent.value:selectedMyEvent.value
  if(!event?.store_name||event.latitude==null||event.longitude==null) return
  const lat = event.latitude
  const lng = event.longitude
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(mapsUrl,'_blank')
}

const shareEvent = (eventId:any) => {
  Promise.resolve(eventId).then(id=>{
    if(!id) throw new Error('Event ID not found!')
    return btoa(id.toString())
  }).then(encoded=>{
    sharedLink.value = `${window.location.origin}/event/${encoded}`
    showDialog.value = true
  }).catch(()=>{})
}

const copyLink = (link:string) => {
  navigator.clipboard.writeText(link).then(()=>{ showDialog.value=false }).catch(()=>{})
}

const getSeasonInfo = (fk:number) => {
  if(fk==2) return { flag:s1flag, name:'Season 1' }
  if(fk==3) return { flag:s2flag, name:'Season 2' }
  return { flag:null, name:'' }
}

const fetchAllEvents = async () => {
  try{
    const response = await axios.get('/events/list_events/',{
      params:{ player_fk:playerFk.value, past_events:false },
      headers:{ Authorization:`Bearer ${localStorage.getItem('accessToken')}` }
    })
    allEvents.value = response.data.events||[]
  }catch{
    allEvents.value = []
  }
}

const fetchMyEvents = async () => {
  try{
    const response = await axios.get('/events/my_events/player',{
      params:{ player_fk:playerFk.value, past_events:false },
      headers:{ Authorization:`Bearer ${localStorage.getItem('accessToken')}` }
    })
    myEvents.value = response.data.events||[]
  }catch{
    myEvents.value = []
  }
}

const fetchPlayers = async (eventPk:any) => {
  try{
    const response = await axios.get('/rl_events_users/list_players',{ params:{ events_fk:eventPk } })
    players.value = response.data.players
  }catch{
    players.value = []
  }
}

const fetchEventRewards = async (eventPk:any) => {
  try{
    const rewardsRes = await axios.get('/rl_events_rewards/list_rewards',{
      params:{ events_fk:eventPk },
      headers:{ Authorization:`Bearer ${localStorage.getItem('accessToken')}` }
    })
    eventRewards.value = rewardsRes.data.rewards||[]
  }catch{
    eventRewards.value = []
  }
}

const openDialog = async (event:any) => {
  selectedEvent.value = event
  dialog.value = true
  dialogLoading.value = true
  showAlert.value = false
  await fetchEventRewards(event.events_pk)
  dialogLoading.value = false
}

const openMyEventsDialog = async (event:any) => {
  selectedMyEvent.value = event
  myDialog.value = true
  dialogLoading.value = true
  showQuitSuccessAlert.value = false
  showQuitErrorAlert.value = false
  await Promise.all([fetchEventRewards(event.events_pk), fetchPlayers(event.events_pk)])
  const currentUserEntry = players.value.find(p=>p.users_pk===userStore.user?.users_pk)
  rlEventsUsersPkToQuit.value = currentUserEntry?currentUserEntry.rl_events_users_pk:null
  dialogLoading.value = false
}

const joinEvent = async () => {
  showAlert.value = false
  dialogLoading.value = true
  try{
    await axios.post('/rl_events_users/cadastro',
      { users_fk:userStore.user.users_pk, events_fk:selectedEvent.value.events_pk, status:1 },
      { headers:{ Authorization:`Bearer ${localStorage.getItem('accessToken')}` } }
    )
    alertType.value = 'success'
    alertMessage.value = 'You’ve successfully joined this event! Redirecting...'
    showAlert.value = true
    await fetchMyEvents()
    setTimeout(()=>{
      dialog.value = false
      activeTab.value = 'myevents'
    },2000)
  }catch(error:any){
    alertType.value = 'error'
    alertMessage.value = error.response?.data?.message||'An error occurred.'
    showAlert.value = true
  }finally{
    dialogLoading.value = false
  }
}

const refreshEventStatus = async () => {
  if(!selectedMyEvent.value) return
  isRefreshingStatus.value = true
  await fetchPlayers(selectedMyEvent.value.events_pk)
  isRefreshingStatus.value = false
}

const quitEvent = () => {
  if(rlEventsUsersPkToQuit.value){
    showQuitConfirmDialog.value = true
  }else{
    quitErrorMessage.value = 'Cannot quit event. Relationship ID not found.'
    showQuitErrorAlert.value = true
  }
}

const confirmQuitEvent = async () => {
  showQuitConfirmDialog.value = false
  dialogLoading.value = true
  try{
    await axios.delete(`/rl_events_users/${rlEventsUsersPkToQuit.value}/delete/`,{
      data:{ status:3 },
      headers:{ Authorization:`Bearer ${localStorage.getItem('accessToken')}` }
    })
    showQuitSuccessAlert.value = true
    await fetchMyEvents()
    setTimeout(()=>{ myDialog.value = false },2000)
  }catch{
    quitErrorMessage.value = 'An unexpected error occurred. Please try again.'
    showQuitErrorAlert.value = true
  }finally{
    dialogLoading.value = false
  }
}

const getEventStatusInfo = (status:string) => {
  const statuses:any = {
    'Seeks Entry':{ icon:'mdi-timer-sand', color:'orange', tooltip:'Waiting for acceptance.' },
    'Granted Passage':{ icon:'mdi-check-circle', color:'success', tooltip:'Entry accepted.' },
    'Turned Away':{ icon:'mdi-cancel', color:'error', tooltip:'Entry refused or you left.' },
    'Joined the Quest':{ icon:'mdi-sword', color:'purple', tooltip:'Campaign available.' }
  }
  return statuses[status]||{ icon:'mdi-help-circle', color:'grey', tooltip:'Unknown status.' }
}

watch(activeTab,(val)=>{
  if(val==='myevents'){
    dialog.value = false
    selectedEvent.value = null
  }else{
    myDialog.value = false
    selectedMyEvent.value = null
  }
})

onMounted(async()=>{
  const rawUser = localStorage.getItem('app_user')
  playerFk.value = rawUser?JSON.parse(rawUser).users_pk:null
  if(!playerFk.value){
    loading.value = false
    return
  }
  await Promise.all([fetchAllEvents(), fetchMyEvents()])
  loading.value = false
})
</script>

<style scoped>
.event-card{cursor:pointer;transition:transform .2s ease-in-out,box-shadow .2s ease-in-out;position:relative;overflow:hidden}
.event-card:hover{transform:translateY(-4px);box-shadow:0 4px 12px rgba(0,0,0,.3)}
.cinzel-text{font-family:"Cinzel",serif}
.scheduled-box{display:inline-block;background-color:#fff;padding:6px 12px;border-radius:20px;font-size:14px;font-weight:500;color:#000;box-shadow:0 2px 4px rgba(0,0,0,.1)}
.dialog-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(21,21,21,.7);z-index:9999;display:flex;align-items:center;justify-content:center}
.event-card-dialog .event-img{width:110px;height:110px;border-radius:4px}
.season-flag{position:absolute;top:0;right:0;width:60px;height:60px;z-index:2}
.content-scroll{padding-bottom:12px}
.see-all-btn{
  padding: 16px 18px;
}
</style>