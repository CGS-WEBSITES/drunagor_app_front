<template>
  <!-- Create or edit an event in place: only the wing (rewards follow it),
       the date and the time can change; the store is shown for reference. -->
  <v-dialog :model-value="modelValue" max-width="640" scroll-target="#app" @update:model-value="close">
    <v-card class="event-form" color="#141414">
      <div class="event-form__header">
        <div>
          <span class="event-form__kicker">{{ isEdit ? "Edit event" : "New event" }}</span>
          <h2>{{ isEdit ? "Change the details" : "Create event" }}</h2>
        </div>
        <v-btn icon variant="text" size="small" @click="close(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="event-form__body">
        <label class="event-form__label">Store</label>
        <v-text-field
          :model-value="storeName || (loadingStores ? 'Loading…' : 'No store found')"
          prepend-inner-icon="mdi-store"
          append-inner-icon="mdi-lock-outline"
          variant="solo"
          density="compact"
          flat
          readonly
          hide-details
          class="event-form__field event-form__field--locked"
        />

        <label class="event-form__label">Wing</label>
        <v-select
          v-model="form.scenario"
          :items="wingOptions"
          item-title="displayName"
          item-value="sceneries_pk"
          item-props="props"
          placeholder="Choose the wing"
          variant="solo"
          density="compact"
          flat
          hide-details
          class="event-form__field"
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :title="item.raw.displayName">
              <template v-if="item.raw.locked" #append>
                <v-icon size="18" title="Not available yet">mdi-lock</v-icon>
              </template>
            </v-list-item>
          </template>
        </v-select>

        <div class="event-form__row">
          <div>
            <label class="event-form__label">Date</label>
            <v-text-field
              v-model="form.date"
              type="date"
              :min="todayISO"
              :max="maxDateISO"
              variant="solo"
              density="compact"
              flat
              hide-details
              class="event-form__field"
            />
          </div>
          <div>
            <label class="event-form__label">Time</label>
            <div class="event-form__time">
              <v-select v-model="form.hour" :items="hourOptions" variant="solo" density="compact" flat hide-details class="event-form__field" />
              <span class="event-form__colon">:</span>
              <v-select v-model="form.minute" :items="minuteItems" variant="solo" density="compact" flat hide-details class="event-form__field" />
              <v-btn-toggle v-model="form.ampm" mandatory density="compact" class="event-form__ampm">
                <v-btn value="AM">AM</v-btn>
                <v-btn value="PM">PM</v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </div>

        <label class="event-form__label">Reward</label>
        <div class="event-form__reward">
          <template v-if="reward">
            <v-avatar size="52" rounded="lg">
              <v-img :src="`https://assets.drunagor.app/${reward.picture_hash}`" />
            </v-avatar>
            <div>
              <strong>{{ reward.name }}</strong>
              <span>Given to the players who finish the {{ wingLabel(form.scenario) }}.</span>
            </div>
          </template>
          <span v-else-if="form.scenario" class="event-form__hint">This wing has no reward.</span>
          <span v-else class="event-form__hint">Pick a wing to see its reward.</span>
        </div>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-3">{{ error }}</v-alert>
      </div>

      <button class="event-form__confirm" :disabled="!ready || saving" @click="save">
        <v-progress-circular v-if="saving" indeterminate size="20" width="2" />
        <template v-else>{{ isEdit ? "Confirm changes" : "Create event" }}</template>
      </button>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, inject, reactive, ref, watch } from "vue";
import { useUserStore } from "@/store/UserStore";
import { parseApiDate } from "@/utils/dateHelpers";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // The event to edit; create mode when empty.
  event: { type: Object, default: null },
});
const emit = defineEmits(["update:modelValue", "saved"]);

const axios = inject("axios");
const userStore = useUserStore();
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

// Retailer wings and the season each belongs to.
const WING_SEASON = { 2: 2, 3: 2, 4: 2, 5: 3, 6: 3 };
const WING_LABELS = { 2: "Wing 1 Tutorial", 3: "Wing 1 Advanced", 4: "Wing 2 Advanced", 5: "Wing 3", 6: "Wing 4" };
// The reward players get for each wing.
// Wing 1 Tutorial gives "Tutorial Completed"; Wing 1 Advanced gives none.
const WING_REWARD = { 2: 2, 4: 3, 5: 5, 6: 6 };
// Wings 3 and 4 can't be picked for new events yet.
const LOCKED_WINGS = [5, 6];

const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minuteOptions = ["00", "15", "30", "45"];

const isEdit = computed(() => !!props.event?.events_pk);
const sceneries = ref([]);
const rewards = ref([]);
const stores = ref([]);
const loadingStores = ref(false);
const saving = ref(false);
const error = ref("");
const form = reactive({ scenario: null, date: "", hour: "07", minute: "00", ampm: "PM", season: null });

const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayISO = toISO(new Date());
const maxDateISO = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return toISO(d);
})();

const wingLabel = (pk) => WING_LABELS[pk] || "wing";

const wingOptions = computed(() => {
  const options = sceneries.value
    .filter((s) => WING_SEASON[s.sceneries_pk] || s.sceneries_pk === form.scenario)
    .sort((a, b) => a.sceneries_pk - b.sceneries_pk)
    .map((s) => ({
      ...s,
      displayName: WING_LABELS[s.sceneries_pk] ? `${WING_LABELS[s.sceneries_pk]} - ${s.name}` : s.name,
      // An event already on a locked wing keeps it.
      locked: LOCKED_WINGS.includes(s.sceneries_pk) && s.sceneries_pk !== props.event?.sceneries_fk,
    }))
    .map((s) => ({ ...s, props: { disabled: s.locked } }));
  return options;
});

// Keep a minute the event already has, even if it is not a quarter hour.
const minuteItems = computed(() =>
  minuteOptions.includes(form.minute) ? minuteOptions : [...minuteOptions, form.minute].sort(),
);

const reward = computed(() => rewards.value.find((r) => r.rewards_pk === WING_REWARD[form.scenario]) || null);

// The store the event belongs to; new events go to the retailer's first
// active, verified store.
const store = computed(() => {
  if (isEdit.value) {
    const name = (props.event.store_name || "").toLowerCase().trim();
    return (
      stores.value.find((s) => s.stores_pk === props.event.stores_fk) ||
      stores.value.find((s) => (s.name || s.storename || "").toLowerCase().trim() === name) ||
      null
    );
  }
  return stores.value.find((s) => s.active && s.verified) || stores.value[0] || null;
});
const storeName = computed(() => (isEdit.value ? props.event.store_name : store.value?.name || store.value?.storename) || "");

const ready = computed(() => !!store.value && !!form.scenario && !!form.date && !!form.hour && !!form.minute);

const load = async () => {
  error.value = "";
  loadingStores.value = true;
  const requests = [
    axios.get("/stores/list", {
      params: { users_fk: userStore.user?.users_pk },
      headers: authHeaders(),
      validateStatus: (status) => status === 200 || status === 404,
    }),
    sceneries.value.length ? null : axios.get("/sceneries/search", { params: { active: true }, headers: authHeaders() }),
    rewards.value.length ? null : axios.get("/rewards/search", { headers: authHeaders() }),
  ];
  const [storeRes, sceneryRes, rewardRes] = await Promise.allSettled(requests);
  if (storeRes.status === "fulfilled") stores.value = storeRes.value.data?.stores || [];
  if (sceneryRes.status === "fulfilled" && sceneryRes.value) sceneries.value = sceneryRes.value.data?.sceneries || [];
  if (rewardRes.status === "fulfilled" && rewardRes.value) rewards.value = rewardRes.value.data?.rewards || [];
  loadingStores.value = false;

  if (isEdit.value && !form.scenario) {
    const found = sceneries.value.find((s) => s.name === props.event.scenario);
    form.scenario = found?.sceneries_pk ?? null;
  }
};

const fillForm = () => {
  const event = props.event;
  if (!event?.events_pk) {
    Object.assign(form, { scenario: null, date: "", hour: "07", minute: "00", ampm: "PM", season: null });
    return;
  }
  // Read the time as the store sees it: the API sends it with the store's
  // offset, and saving treats it as store time.
  const wallClock = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})/.exec(event.event_date || "");
  const parsed = wallClock ? null : parseApiDate(event.event_date);
  const hours24 = wallClock ? Number(wallClock[2]) : parsed ? parsed.getHours() : 19;
  Object.assign(form, {
    scenario: event.sceneries_fk ?? null,
    date: wallClock ? wallClock[1] : parsed ? toISO(parsed) : "",
    hour: String(hours24 % 12 || 12).padStart(2, "0"),
    minute: wallClock ? wallClock[3] : parsed ? String(parsed.getMinutes()).padStart(2, "0") : "00",
    ampm: hours24 >= 12 ? "PM" : "AM",
    season: event.seasons_fk ?? null,
  });
};

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    fillForm();
    load();
  },
  { immediate: true },
);

const close = (value) => {
  if (!value && !saving.value) emit("update:modelValue", false);
};

const saveRewards = async (eventPk) => {
  const target = WING_REWARD[form.scenario];
  let current = [];
  if (isEdit.value) {
    try {
      const { data } = await axios.get("/rl_events_rewards/list_rewards", { params: { events_fk: eventPk } });
      current = (data.rewards || []).map((r) => r.rewards_pk);
    } catch (_) {
      current = [];
    }
  }
  const changes = [
    ...current.filter((pk) => pk !== target).map((pk) => ({ rewards_fk: pk, active: false })),
    ...(target && !current.includes(target) ? [{ rewards_fk: target, active: true }] : []),
  ];
  await Promise.all(
    changes.map((change) =>
      axios
        .post("/rl_events_rewards/cadastro", { events_fk: eventPk, ...change }, { headers: authHeaders() })
        .catch(() => null),
    ),
  );
};

const save = async () => {
  if (!ready.value || saving.value) return;
  if (!isEdit.value && (!store.value.active || !store.value.verified)) {
    error.value = store.value.active
      ? "This store still needs verification before creating events."
      : "This store is inactive and can't host events right now.";
    return;
  }

  saving.value = true;
  error.value = "";
  const date = `${form.date}; ${form.hour}:${form.minute} ${form.ampm}`;
  const seasonsFk = WING_SEASON[form.scenario] ?? form.season ?? 3;

  try {
    let eventPk = props.event?.events_pk;
    if (isEdit.value) {
      await axios.put(
        "/events/alter",
        {
          events_pk: eventPk,
          seats_number: props.event.seats_number,
          seasons_fk: seasonsFk,
          sceneries_fk: form.scenario,
          date,
          stores_fk: store.value?.stores_pk ?? props.event.stores_fk,
        },
        { params: { events_pk: eventPk } },
      );
    } else {
      const { data } = await axios.post("/events/cadastro", null, {
        params: {
          seats_number: 4,
          seasons_fk: seasonsFk,
          sceneries_fk: form.scenario,
          date,
          stores_fk: store.value.stores_pk,
          users_fk: userStore.user?.users_pk,
          active: true,
        },
        headers: authHeaders(),
      });
      eventPk = data?.event?.events_pk;
      if (!eventPk) throw new Error("The event could not be created correctly. Please try again.");
      // Every event starts with one table.
      await axios
        .post("/event_tables/create", { events_fk: eventPk, max_players: 4, active: true }, { headers: authHeaders() })
        .catch(() => null);
    }
    await saveRewards(eventPk);
    saving.value = false;
    emit("saved", eventPk);
    emit("update:modelValue", false);
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
    saving.value = false;
  }
};
</script>

<style scoped>
.event-form {
  color: #fff;
  font-family: "Poppins", sans-serif;
}
.event-form__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 16px 4px 24px;
}
.event-form__kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.6;
}
.event-form__header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
}
.event-form__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 24px 24px;
}
.event-form__label {
  margin-top: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.85;
}
.event-form__field :deep(.v-field) {
  border-radius: 8px;
  background: #e8e8e8;
  color: #141414;
}
/* The store can't change here: greyed out. */
.event-form__field--locked {
  pointer-events: none;
}
.event-form__field--locked :deep(.v-field) {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.5);
}
.event-form__row {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 16px;
}
.event-form__time {
  display: flex;
  align-items: center;
  gap: 6px;
}
.event-form__colon {
  font-weight: 700;
}
.event-form__ampm {
  flex-shrink: 0;
  height: 40px !important;
  border-radius: 8px;
  background: #e8e8e8;
  color: #141414;
}
.event-form__ampm .v-btn--active {
  background: rgb(var(--v-theme-accent));
  color: #141414;
}
.event-form__reward {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 68px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
.event-form__reward strong {
  display: block;
  font-size: 0.95rem;
}
.event-form__reward span,
.event-form__hint {
  font-size: 0.8rem;
  opacity: 0.7;
}
.event-form__confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  background: #fff;
  color: #000;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  transition: background 0.2s ease;
}
.event-form__confirm:hover {
  background: #e0e0e0;
}
.event-form__confirm:disabled {
  opacity: 0.5;
  cursor: default;
}
@media (max-width: 599px) {
  .event-form__row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
