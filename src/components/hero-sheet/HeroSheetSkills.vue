<template>
  <div class="skills">
    <div class="sheet-title-row">
      <h3 class="sheet-title">Skills</h3>
      <!-- Heroes with Drunagor Nights skill cards pick between both sets. -->
      <div v-if="hasNightsSkills" class="skills__mode">
        <button :class="{ active: mode === 'normal' }" @click="mode = 'normal'">Skills</button>
        <button :class="{ active: mode === 'nights' }" @click="mode = 'nights'">
          <img :src="s1Flag" alt="" class="skills__mode-flag" /> Drunagor Nights
        </button>
      </div>
    </div>

    <!-- Normal skills: two levels per type. -->
    <div v-if="mode === 'normal'" class="skills__grid">
      <div v-for="skill in SKILLS" :key="skill.id" class="skill-box">
        <span class="skill-box__title"><v-icon size="18" class="mr-1">{{ skill.icon }}</v-icon>{{ skill.label }}</span>
        <div class="skill-box__frame">
          <button
            v-for="level in 2"
            :key="level"
            class="skill-level"
            :class="{ on: has(`${skill.id}-${level}`) }"
            :style="{ '--skill-color': skill.color }"
            @click="toggle(`${skill.id}-${level}`)"
          >
            <span class="skill-level__gem"></span> Level {{ level }}
          </button>
        </div>
      </div>
    </div>

    <!-- Drunagor Nights: one skill card per type. -->
    <div v-else class="skills__cards">
      <div v-for="skill in SKILLS" :key="skill.id" class="skill-card-slot">
        <span class="skill-box__title">
          <v-icon size="18" class="mr-1">{{ skill.icon }}</v-icon>{{ skill.label }}
          <span class="skill-card-slot__dot" :style="{ background: skill.color }"></span>
        </span>
        <button v-if="nightsCard(skill.id)" class="skill-card" @click="viewing = nightsCard(skill.id)!">
          <img :src="nightsCard(skill.id)!.image" :alt="nightsCard(skill.id)!.name" />
        </button>
        <button v-else class="skill-card skill-card--empty" @click="picking = skill.id">
          <v-icon size="28">mdi-plus</v-icon>
          <span>Choose a card</span>
        </button>
      </div>
    </div>

    <!-- Dungeon role -->
    <div class="skill-box skill-box--role">
      <span class="skill-box__title"><v-icon size="18" class="mr-1">mdi-account-group</v-icon>Dungeon role</span>
      <div class="skill-box__frame">
        <button
          v-for="level in 2"
          :key="level"
          class="skill-level"
          :class="{ on: has(`dungeon-role-${level}`) }"
          :style="{ '--skill-color': roleColor(level) }"
          @click="toggleRole(level)"
        >
          <span class="skill-level__gem"></span> Level {{ level }}
        </button>
      </div>
    </div>

    <!-- Cube color for a dungeon role level -->
    <v-dialog v-model="roleDialog" max-width="360">
      <v-card color="surface" class="pa-4">
        <h3 class="sheet-title mb-3">Action cube color</h3>
        <div class="cube-grid">
          <button v-for="cube in CUBES" :key="cube.name" class="cube-option" @click="setRoleColor(cube.name)">
            <span class="skill-level__gem" :style="{ '--skill-color': cube.color }"></span>{{ cube.name }}
          </button>
        </div>
      </v-card>
    </v-dialog>

    <!-- Pick a Drunagor Nights card -->
    <v-dialog :model-value="!!picking" max-width="760" @update:model-value="picking = null">
      <v-card color="surface" class="pa-4">
        <h3 class="sheet-title mb-3">Choose a {{ picking }} card</h3>
        <div class="card-picker">
          <button v-for="card in pickerCards" :key="card.id" class="skill-card" @click="pickCard(card)">
            <img :src="card.image" :alt="card.name" />
          </button>
        </div>
      </v-card>
    </v-dialog>

    <!-- A chosen card -->
    <v-dialog :model-value="!!viewing" max-width="480" @update:model-value="viewing = null">
      <v-card v-if="viewing" color="surface" class="pa-4">
        <img :src="viewing.image" :alt="viewing.name" class="w-100 rounded" />
        <div class="d-flex justify-end ga-2 mt-3">
          <v-btn variant="text" @click="picking = viewing.skillType; viewing = null">Change</v-btn>
          <v-btn color="error" variant="tonal" @click="removeCard(viewing)">Remove</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Hero } from "@/store/Hero";
import { underkeepSkillCards, findSkillsFor, type SkillCard } from "@/data/repository/campaign/underkeep/underkeepSkillData";
import s1Flag from "@/assets/s1flag.png";

const props = defineProps<{ state: Hero }>();

type SkillType = "melee" | "ranged" | "agility" | "wisdom";
const SKILLS: { id: SkillType; label: string; icon: string; color: string }[] = [
  { id: "melee", label: "Melee", icon: "mdi-sword", color: "#f5b400" },
  { id: "agility", label: "Agility", icon: "mdi-run-fast", color: "#3fbf20" },
  { id: "ranged", label: "Ranged", icon: "mdi-bullseye-arrow", color: "#b0205f" },
  { id: "wisdom", label: "Wisdom", icon: "mdi-head-lightbulb", color: "#1f5de0" },
];
const CUBES = [
  { name: "Yellow", color: "#f5b400" },
  { name: "Red", color: "#b0205f" },
  { name: "Green", color: "#3fbf20" },
  { name: "Blue", color: "#1f5de0" },
];

if (!props.state.skillIds) props.state.skillIds = [];
if (!props.state.dungeonRoleSkillCubeColors) props.state.dungeonRoleSkillCubeColors = { rankOne: null, rankTwo: null };

const has = (id: string) => props.state.skillIds.includes(id);
const toggle = (id: string) => {
  const list = props.state.skillIds;
  const index = list.indexOf(id);
  if (index >= 0) list.splice(index, 1);
  else list.push(id);
};

// Dungeon role levels also record the action cube color.
const roleDialog = ref(false);
const roleLevel = ref(1);
const roleKey = (level: number) => (level === 1 ? "rankOne" : "rankTwo");
const roleColor = (level: number) =>
  CUBES.find((cube) => cube.name === props.state.dungeonRoleSkillCubeColors[roleKey(level)])?.color ?? "#9e9e9e";
function toggleRole(level: number) {
  const id = `dungeon-role-${level}`;
  if (has(id)) {
    toggle(id);
    props.state.dungeonRoleSkillCubeColors[roleKey(level)] = null;
    return;
  }
  toggle(id);
  roleLevel.value = level;
  roleDialog.value = true;
}
function setRoleColor(name: string) {
  props.state.dungeonRoleSkillCubeColors[roleKey(roleLevel.value)] = name;
  roleDialog.value = false;
}

// Drunagor Nights cards
const heroCards = computed(() => underkeepSkillCards.filter((card) => card.heroId === props.state.heroId));
const hasNightsSkills = computed(() => heroCards.value.length > 0);
const mode = ref<"normal" | "nights">(
  heroCards.value.some((card) => props.state.skillIds.includes(card.id)) ? "nights" : "normal",
);
const nightsCard = (type: SkillType) => heroCards.value.find((card) => card.skillType === type && has(card.id));

const picking = ref<SkillType | null>(null);
const viewing = ref<SkillCard | null>(null);
const pickerCards = computed(() => (picking.value ? findSkillsFor(props.state.heroId, picking.value) : []));

// One card per type.
function pickCard(card: SkillCard) {
  props.state.skillIds = props.state.skillIds.filter(
    (id) => !heroCards.value.some((other) => other.id === id && other.skillType === card.skillType),
  );
  props.state.skillIds.push(card.id);
  picking.value = null;
}
function removeCard(card: SkillCard) {
  props.state.skillIds = props.state.skillIds.filter((id) => id !== card.id);
  viewing.value = null;
}
</script>

<style scoped>
.skills__mode {
  display: flex;
  padding: 3px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
}
.skills__mode button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.65;
}
.skills__mode button.active {
  background: rgb(var(--v-theme-terciary));
  color: rgb(var(--v-theme-on-terciary));
  opacity: 1;
}
.skills__mode-flag {
  width: 10px;
}
.skills__grid,
.skills__cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 16px;
}
.skill-box__title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
}
/* Double-line frame, as on the hero board. */
.skill-box__frame {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 2px;
  outline: 1px solid rgba(255, 255, 255, 0.15);
  outline-offset: 3px;
}
.skill-box--role {
  max-width: 50%;
  margin: 20px auto 0;
}
.skill-level {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 4px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  transition: background 0.15s ease;
}
.skill-level:hover {
  background: rgba(255, 255, 255, 0.06);
}
.skill-level__gem {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: rgb(var(--v-theme-secondary));
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  transform: rotate(45deg);
  transition: background 0.15s ease;
}
.skill-level.on .skill-level__gem,
.cube-option .skill-level__gem {
  background: var(--skill-color);
  box-shadow: 0 0 6px var(--skill-color);
}
.skill-card-slot__dot {
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
}
.skill-card {
  display: block;
  width: 100%;
  aspect-ratio: 300 / 188;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.skill-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}
.skill-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.skill-card--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 2px dashed rgba(255, 255, 255, 0.25);
  font-size: 0.75rem;
  opacity: 0.75;
}
.card-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.cube-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.cube-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  font-weight: 700;
}
@media (max-width: 599px) {
  .skill-box--role {
    max-width: 100%;
  }
}
</style>
