<template>
  <v-dialog v-model="model" :fullscreen="smAndDown" max-width="960" scrollable>
    <v-card v-if="product" class="box-detail" color="surface">
      <div class="box-detail__layout">
        <!-- Desktop side panel: box, collection actions and files -->
        <aside class="box-detail__side" :style="{ backgroundColor: boxColor }">
          <img :src="product.image" alt="" class="box-detail__box" />
          <div class="box-detail__side-actions">
            <button class="box-detail__action box-detail__action--wish" @click="emit('toggle-wishlist')">
              <v-icon size="20">{{ product.wish ? "mdi-star" : "mdi-star-outline" }}</v-icon>
              {{ product.wish ? "In wishlist" : "Add to wishlist" }}
            </button>
            <button class="box-detail__action box-detail__action--owned" @click="emit('toggle-owned')">
              <v-icon size="20">{{ product.owned ? "mdi-check-circle" : "mdi-plus-circle" }}</v-icon>
              {{ product.owned ? "Owned" : "Mark as owned" }}
            </button>
          </div>
          <button class="box-detail__files" @click="downloadsOpen = true">
            <v-icon size="20">mdi-file-pdf-box</v-icon> Digital files
          </button>
        </aside>

        <div class="box-detail__main">
          <header class="box-detail__header" :style="{ backgroundImage: `url(${product.cardbg})` }">
            <div class="box-detail__heading">
              <h2>{{ product.name }}</h2>
              <span>Game content box</span>
            </div>
            <v-btn icon variant="text" size="small" class="box-detail__close" @click="model = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <img :src="product.image" alt="" class="box-detail__header-box" />
          </header>

          <div class="box-detail__body">
            <template v-if="contents">
              <div v-if="summary.length" class="box-detail__summary">
                <span v-for="item in summary" :key="item.label">{{ item.value }} {{ item.label }}</span>
              </div>

              <div class="box-detail__sections">
                <section v-for="section in sections" :key="section.label">
                  <h3>{{ section.label }}</h3>
                  <p v-for="name in section.items" :key="name">{{ name }}</p>
                </section>
              </div>

              <section v-if="contents.doors.length" class="box-detail__doors">
                <h3>Doors</h3>
                <p v-for="door in contents.doors" :key="doorLabel(door)">{{ doorLabel(door) }}</p>
              </section>
            </template>
            <p v-else class="box-detail__empty">The component list for this box is not available yet.</p>

            <button class="box-detail__files box-detail__files--mobile" @click="downloadsOpen = true">
              <v-icon size="20">mdi-file-pdf-box</v-icon> Digital files
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile collection actions -->
      <div class="box-detail__footer">
        <button class="box-detail__action box-detail__action--wish" @click="emit('toggle-wishlist')">
          <v-icon size="20">{{ product.wish ? "mdi-star" : "mdi-star-outline" }}</v-icon>
          {{ product.wish ? "In wishlist" : "Add to wishlist" }}
        </button>
        <button class="box-detail__action box-detail__action--owned" @click="emit('toggle-owned')">
          <v-icon size="20">{{ product.owned ? "mdi-check-circle" : "mdi-plus-circle" }}</v-icon>
          {{ product.owned ? "Owned" : "Mark as owned" }}
        </button>
      </div>
    </v-card>

    <LibraryDownloadsDialog v-if="product" v-model="downloadsOpen" :box-name="product.name" />
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import LibraryDownloadsDialog from "@/components/Library/LibraryDownloadsDialog.vue";
import { boxContents, COMPONENT_TYPES, doorLabel } from "@/data/library";

export type LibraryProduct = {
  id: number;
  name: string;
  image: string;
  color: string;
  cardbg: string;
  owned: boolean | null;
  wish: boolean | null;
};

const props = defineProps<{ product: LibraryProduct | null }>();
const emit = defineEmits<{ (e: "toggle-wishlist"): void; (e: "toggle-owned"): void }>();
const model = defineModel<boolean>({ default: false });

const { smAndDown } = useDisplay();
const downloadsOpen = ref(false);

// Some SKU colors come from the API without the leading '#'.
const boxColor = computed(() => {
  const color = props.product?.color ?? "";
  return /^[0-9a-f]{6}$/i.test(color) ? `#${color}` : color;
});

const contents = computed(() => (props.product ? boxContents(props.product.name) : null));

const sections = computed(() =>
  COMPONENT_TYPES.map((type) => ({ label: type.label, items: contents.value?.[type.key] ?? [] })).filter(
    (section) => section.items.length,
  ),
);

const summary = computed(() =>
  Object.entries(contents.value?.summary ?? {})
    .filter(([label]) => !/^box$/i.test(label))
    .map(([label, value]) => ({ label, value })),
);
</script>

<style scoped>
.box-detail {
  font-family: "Poppins", sans-serif;
  color: rgb(var(--v-theme-on-surface));
}
.box-detail__layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 0;
  overflow: hidden;
}
.box-detail__side {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0 0;
}
.box-detail__box {
  width: 100%;
  padding: 0 20px;
  object-fit: contain;
}
.box-detail__side-actions {
  display: flex;
  flex-direction: column;
}
.box-detail__action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  transition: filter 0.2s ease;
}
.box-detail__action:hover {
  filter: brightness(1.1);
}
.box-detail__action--wish {
  background: rgb(var(--v-theme-accent));
}
.box-detail__action--owned {
  background: rgb(var(--v-theme-playbutton));
}
.box-detail__files {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  margin-top: auto;
  background: rgba(var(--v-theme-background), 0.85);
  font-weight: 700;
  text-transform: uppercase;
}
.box-detail__files--mobile {
  display: none;
}
.box-detail__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-height: min(88vh, 760px);
  overflow-y: auto;
  background: rgb(var(--v-theme-background));
}
.box-detail__header {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 170px;
  padding: 18px 16px 18px 20px;
  background-size: cover;
  background-position: center;
}
.box-detail__header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(var(--v-theme-background), 1) 100%);
}
.box-detail__heading,
.box-detail__close {
  position: relative;
}
.box-detail__heading h2 {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.1;
  text-transform: uppercase;
}
.box-detail__heading span {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.85;
}
.box-detail__header-box {
  display: none;
}
.box-detail__body {
  padding: 8px 20px 24px;
}
.box-detail__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}
.box-detail__summary span {
  padding: 2px 10px;
  background: rgb(var(--v-theme-primary));
  border-radius: 999px;
  font-size: 0.72rem;
}
.box-detail__sections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px 20px;
}
.box-detail__body h3 {
  margin-bottom: 4px;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
}
.box-detail__body p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
}
.box-detail__doors {
  margin-top: 20px;
}
.box-detail__empty {
  opacity: 0.7;
}
.box-detail__footer {
  display: none;
}

@media (max-width: 959px) {
  .box-detail__layout {
    grid-template-columns: 1fr;
    flex: 1;
  }
  .box-detail__side {
    display: none;
  }
  .box-detail__main {
    max-height: none;
  }
  .box-detail__header {
    min-height: 300px;
  }
  .box-detail__header-box {
    position: absolute;
    left: 50%;
    bottom: 12px;
    display: block;
    width: 62%;
    max-width: 280px;
    transform: translateX(-50%);
  }
  .box-detail__files--mobile {
    display: flex;
    width: 100%;
    margin-top: 20px;
    background: rgb(var(--v-theme-primary));
    border-radius: 8px;
  }
  .box-detail__footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex-shrink: 0;
  }
  .box-detail__action {
    font-size: 0.8rem;
  }
}
</style>
