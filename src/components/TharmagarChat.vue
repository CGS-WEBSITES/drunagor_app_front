<template>
  <section class="chat vn-mode">
    <div class="vn-character-layer">
      <img
        src="@/assets/jaheen/tharmagar.png"
        class="vn-sprite tharmagar-sprite"
      />
    </div>

    <div class="chat-ui-layer">
      <div ref="scrollEl" class="messages">
        <div v-if="rag.messages.length === 0" class="empty-state">
          <div class="vn-initial-msg">
            <div class="assistant-header">
              <span class="assistant-name jaheen-name">Tharmagar</span>
            </div>
            <div class="answer-text">
              <p v-for="(line, idx) in currentTharmagarGreeting" :key="idx">
                {{ line }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-for="(m, idx) in rag.messages"
          :key="m.id"
          class="msg"
          :class="m.role"
          :style="{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }"
        >
          <div v-if="m.role === 'user'" class="bubble user-bubble">
            <div class="content">{{ m.content }}</div>
            <span class="timestamp">{{ formatTime(m.timestamp) }}</span>
          </div>

          <div
            v-else
            class="bubble assistant-bubble"
            :class="{
              'is-refinement': m.meta?.refinementRound > 0,
              'is-escalation': m.meta?.isEscalation,
            }"
          >
            <div class="assistant-header">
              <img
                src="@/assets/jaheen/tharmagar.png"
                alt="Tharmagar"
                class="avatar jaheen-avatar"
              />
              <span class="assistant-name jaheen-name">Tharmagar</span>
              <span
                v-if="m.meta?.refinementRound > 0 && !m.meta?.isEscalation"
                class="refinement-badge"
              >
                Attempt {{ m.meta.refinementRound + 1 }}
              </span>
              <span class="timestamp">{{ formatTime(m.timestamp) }}</span>
            </div>

            <div class="answer-text">
              <template v-if="m.content">
                <div
                  v-if="rag.streaming && idx === rag.messages.length - 1"
                  class="streaming-text"
                >
                  {{ m.content }}
                </div>
                <div v-else v-html="renderMarkdown(m.content)"></div>
              </template>
              <template
                v-else-if="rag.loading && idx === rag.messages.length - 1"
              >
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </template>
            </div>
            <span
              v-if="rag.streaming && idx === rag.messages.length - 1"
              class="cursor"
              >▊</span
            >

            <!-- Manual image carousel -->
            <div
              v-if="!rag.streaming && hasManualImages(m)"
              class="manual-carousel-area"
            >
              <div class="manual-carousel">
                <img
                  v-for="(img, imgIdx) in getManualImages(m)"
                  :key="imgIdx"
                  :src="img.url"
                  :alt="img.label"
                  class="carousel-img"
                  @click="openLightbox(getManualImages(m), imgIdx)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="composer">
        <textarea
          v-model="question"
          class="textarea"
          rows="1"
          placeholder="Ask Tharmagar..."
          @keydown.enter.exact.prevent="send()"
          @input="autoResize"
          ref="inputEl"
        />
        <button
          class="send-btn"
          :disabled="rag.loading || rag.streaming || !question.trim()"
          @click="send()"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </footer>
    </div>

    <!-- Lightbox -->
    <teleport to="body">
      <div
        v-if="lightbox.open"
        class="lightbox"
        @click="lightbox.open = false"
        @keydown="lbKeydown"
        tabindex="0"
        @touchstart.passive="lbTouchStart"
        @touchend.passive="lbTouchEnd"
        @touchmove="lbTouchMove"
      >
        <div class="lightbox-inner" @click.stop>
          <button class="lightbox-close" @click="lightbox.open = false">
            ✕
          </button>
          <button
            v-if="lightbox.images.length > 1"
            class="lightbox-nav prev"
            @click.stop="lbPrev"
          >
            ‹
          </button>
          <img
            :src="lightbox.url"
            :alt="lightbox.label"
            class="lightbox-img"
            :style="{ transform: `scale(${lbZoom})` }"
            @dblclick.stop="lbDoubleTap"
          />
          <button
            v-if="lightbox.images.length > 1"
            class="lightbox-nav next"
            @click.stop="lbNext"
          >
            ›
          </button>
          <div v-if="lightbox.images.length > 1" class="lightbox-footer">
            <span class="lightbox-counter"
              >{{ lightbox.index + 1 }} / {{ lightbox.images.length }}</span
            >
          </div>
          <div v-if="lightbox.images.length > 1" class="lightbox-dots">
            <span
              v-for="(img, i) in lightbox.images"
              :key="i"
              class="lightbox-dot"
              :class="{ active: i === lightbox.index }"
              @click.stop="openLightbox(lightbox.images, i)"
            ></span>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useRagStore } from "@/store/ragStore";

const S3_BASE = "https://s3.us-east-2.amazonaws.com/assets.drunagor.app";

const tharmagarGreetings = [
  [
    "Greetings, my friend. I am Tharmagar.",
    "A scholar's mind is always open to new inquiries! Tell me, what knowledge do you seek today?",
  ],
  [
    "Ah, my dear fellow. You find me amidst some delicate alchemical calculations.",
    "They require precision, much like the answers I shall provide you. How can this old professor assist?",
  ],
  [
    "Greetings! I was just reviewing ancient records of Drunagor.",
    "We must learn from the past, even the parts that weigh heavily upon us. What mystery shall we solve together?",
  ],
  [
    "Welcome! One is never too old to lead or to learn.",
    "I've gathered much over the years, and I'm eager to share it with you. What is on your mind, my friend?",
  ],
  [
    "My dear, you've come at a perfect time.",
    "The reagents are simmering, and my mind is vigorous! Ask away, and let us find the wisdom we need for the journey ahead.",
  ],
];
const randomGreetingIdx = ref(
  Math.floor(Math.random() * tharmagarGreetings.length),
);
const currentTharmagarGreeting = computed(
  () => tharmagarGreetings[randomGreetingIdx.value],
);

const rag = useRagStore();

const question = ref("");
const scrollEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLTextAreaElement | null>(null);

const renderer = new marked.Renderer();
renderer.link = ({ href, title, text }: any) => {
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};
marked.setOptions({ breaks: true, gfm: true, renderer });

function renderMarkdown(text: string) {
  if (!text) return "";
  return DOMPurify.sanitize(marked.parse(text) as string, {
    ADD_ATTR: ["target", "rel"],
  });
}

function formatTime(ts: any) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function autoResize() {
  const el = inputEl.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

async function send() {
  const q = (question.value || "").trim();
  if (!q) return;
  question.value = "";
  if (inputEl.value) inputEl.value.style.height = "auto";
  await rag.ask(q);
}

function scrollToBottom() {
  const el = scrollEl.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

watch(
  () => rag.messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  },
);
watch(
  () => rag.messages[rag.messages.length - 1]?.content,
  async () => {
    await nextTick();
    scrollToBottom();
  },
);

// ── Manual images ─────────────────────────────────────────
function hasManualImages(message: any) {
  const manual = message.meta?.sources?.manual;
  if (!manual?.length) return false;
  return manual.some((s: any) => s.image_path);
}

function getManualImages(message: any) {
  const manual = message.meta?.sources?.manual || [];
  const text = message.content || "";

  // Extract cited page numbers from response text
  const citedPages = new Set<string>();
  const pageMatches = [
    ...text.matchAll(/p[áa]ginas?\s+([\d]+(?:[\s,e]+[\d]+)*)/gi),
  ];
  for (const m of pageMatches) {
    for (const n of m[1].matchAll(/\d+/g)) citedPages.add((n as any)[0]);
  }

  const images: { url: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const src of manual) {
    if (!src.image_path) continue;
    if (citedPages.size > 0 && src.page_number != null) {
      if (!citedPages.has(String(src.page_number))) continue;
    }
    const paths = src.image_path
      .split(",")
      .map((p: string) => p.trim())
      .filter(Boolean);
    for (const p of paths) {
      const url = S3_BASE + p;
      if (!seen.has(url)) {
        seen.add(url);
        images.push({ url, label: p.split("/").pop() || "" });
      }
    }
  }
  return images;
}

// ── Lightbox ──────────────────────────────────────────────
const lightbox = ref({
  open: false,
  url: "",
  label: "",
  index: 0,
  images: [] as any[],
});
const lbZoom = ref(1);
let lbTouchStartX = 0;
let lbTouchStartDist = 0;

function openLightbox(images: any[], index: number) {
  lightbox.value = {
    open: true,
    url: images[index].url,
    label: images[index].label,
    index,
    images,
  };
  lbZoom.value = 1;
  nextTick(() => document.querySelector<HTMLElement>(".lightbox")?.focus());
}

function lbPrev() {
  const lb = lightbox.value;
  if (lb.images.length <= 1) return;
  const i = (lb.index - 1 + lb.images.length) % lb.images.length;
  lightbox.value = {
    ...lb,
    index: i,
    url: lb.images[i].url,
    label: lb.images[i].label,
  };
  lbZoom.value = 1;
}

function lbNext() {
  const lb = lightbox.value;
  if (lb.images.length <= 1) return;
  const i = (lb.index + 1) % lb.images.length;
  lightbox.value = {
    ...lb,
    index: i,
    url: lb.images[i].url,
    label: lb.images[i].label,
  };
  lbZoom.value = 1;
}

function lbKeydown(e: KeyboardEvent) {
  if (!lightbox.value.open) return;
  if (e.key === "ArrowLeft") lbPrev();
  else if (e.key === "ArrowRight") lbNext();
  else if (e.key === "Escape") lightbox.value.open = false;
}

function lbTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) lbTouchStartX = e.touches[0].clientX;
  else if (e.touches.length === 2) {
    lbTouchStartDist = Math.hypot(
      e.touches[1].clientX - e.touches[0].clientX,
      e.touches[1].clientY - e.touches[0].clientY,
    );
  }
}

function lbTouchEnd(e: TouchEvent) {
  if (e.changedTouches.length === 1 && lbZoom.value === 1) {
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? lbNext() : lbPrev();
  }
}

function lbTouchMove(e: TouchEvent) {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dist = Math.hypot(
      e.touches[1].clientX - e.touches[0].clientX,
      e.touches[1].clientY - e.touches[0].clientY,
    );
    if (lbTouchStartDist > 0) {
      lbZoom.value = Math.min(
        4,
        Math.max(1, lbZoom.value * (dist / lbTouchStartDist)),
      );
      lbTouchStartDist = dist;
    }
  }
}

function lbDoubleTap() {
  lbZoom.value = lbZoom.value > 1 ? 1 : 2;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");

.chat {
  font-family: "DM Sans", sans-serif;
  overflow: hidden;
  position: relative;
  height: 100%;
  width: 100%;
  background: url("@/assets/jaheen/back1.png") no-repeat center center;
  background-size: cover;
  display: flex;
}

.vn-character-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
  z-index: 1;
}

.chat-ui-layer {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.tharmagar-sprite {
  height: 85vh;
  object-fit: contain;
  animation: breathe 6s ease-in-out infinite;
  transform-origin: bottom center;
  filter: drop-shadow(0 0 40px rgba(0, 0, 0, 0.6));
}

@keyframes breathe {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.015);
  }
}

.chat.vn-mode .messages {
  flex: 1 1 auto;
  background: transparent;
  border-top: none;
  margin: 0;
  padding: 40px 15% 0;
  border-radius: 0;
  overflow-y: auto;
  box-shadow: none;
  display: flex;
  flex-direction: column;
}

@media (max-width: 800px) {
  .chat.vn-mode .messages {
    padding: 40px 5% 0;
  }
  .chat.vn-mode .composer {
    padding: 10px 5% 16px !important;
  }
}

@media (max-height: 500px) {
  .vn-character-layer {
    justify-content: flex-end;
    width: 40%;
  }
  .tharmagar-sprite {
    height: 105vh;
    transform-origin: bottom right;
    object-position: right bottom;
  }
  .chat-ui-layer {
    margin-left: auto;
    width: 60%;
  }
  .chat.vn-mode .messages {
    padding: 20px 5% 0;
  }
}

.chat.vn-mode .composer {
  flex-shrink: 0;
  background: transparent;
  padding: 10px 15% 16px;
  border-top: none;
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat.vn-mode .bubble {
  max-width: 100% !important;
}

.chat.vn-mode .user-bubble {
  background: rgba(30, 58, 138, 0.85) !important;
  border: 1px solid rgba(96, 165, 250, 0.3) !important;
  border-radius: 16px !important;
  padding: 12px 16px !important;
  margin-bottom: 24px !important;
  position: relative;
  align-self: flex-end;
  max-width: 80% !important;
  margin-left: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
}
.chat.vn-mode .user-bubble::before {
  content: "Hero";
  position: absolute;
  top: -14px;
  right: 24px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  padding: 2px 14px;
  border-radius: 6px;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.chat.vn-mode .user-bubble::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 40px;
  border-width: 10px;
  border-style: solid;
  border-color: rgba(30, 58, 138, 0.85) transparent transparent transparent;
}
.chat.vn-mode .user-bubble .content {
  font-size: 16px;
  color: #fff;
  font-style: italic;
  opacity: 0.95;
}

.chat.vn-mode .assistant-bubble {
  background: rgba(15, 15, 20, 0.95) !important;
  border: 1px solid rgba(217, 119, 6, 0.4) !important;
  border-radius: 16px !important;
  padding: 20px 16px 16px 16px !important;
  margin-bottom: 24px !important;
  margin-top: 16px !important;
  position: relative;
  max-width: 100% !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
}
.chat.vn-mode .assistant-header {
  position: absolute;
  top: -20px;
  left: 20px;
  background: linear-gradient(135deg, #f59e0b, #b45309);
  padding: 6px 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  margin: 0;
  z-index: 2;
}
.chat.vn-mode .assistant-header .avatar {
  display: none !important;
}
.chat.vn-mode .jaheen-name {
  color: #fff !important;
  font-size: 15px !important;
  font-weight: 900 !important;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
}
.chat.vn-mode .assistant-bubble::after {
  display: none !important;
}
.chat.vn-mode .answer-text :deep(ol) {
  padding-left: 1.5em;
  margin: 8px 0;
}

.chat.vn-mode .answer-text :deep(ul) {
  padding-left: 1.5em;
  margin: 8px 0;
}

.chat.vn-mode .answer-text :deep(li) {
  margin-bottom: 6px;
  padding-left: 4px;
}

.chat.vn-mode .answer-text :deep(p) {
  margin-bottom: 8px;
}
.chat.vn-mode .answer-text {
  font-size: 16px !important;
  line-height: 1.65;
  color: #fff !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 1) !important;
  font-weight: 500;
  letter-spacing: 0.3px;
}
.chat.vn-mode .timestamp {
  display: none !important;
}

/* Manual image carousel */
.manual-carousel-area {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.manual-carousel {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x mandatory;
}
.manual-carousel::-webkit-scrollbar {
  height: 4px;
}
.manual-carousel::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.4);
  border-radius: 2px;
}
.carousel-img {
  height: 100px;
  min-width: 120px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid rgba(245, 158, 11, 0.3);
  scroll-snap-align: start;
  transition:
    border-color 0.15s,
    transform 0.15s;
  flex-shrink: 0;
}
.carousel-img:hover {
  border-color: #f59e0b;
  transform: scale(1.03);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(6px);
}
.lightbox-inner {
  position: relative;
  max-width: min(92vw, 900px);
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.lightbox-close {
  position: absolute;
  top: -44px;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.25);
}
.lightbox-img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  touch-action: none;
  cursor: zoom-in;
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
  transform-origin: center center;
}
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  z-index: 10;
  backdrop-filter: blur(4px);
}
.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.75);
}
.lightbox-nav.prev {
  left: 10px;
}
.lightbox-nav.next {
  right: 10px;
}
.lightbox-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}
.lightbox-counter {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 99px;
}
.lightbox-dots {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  justify-content: center;
}
.lightbox-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.15s;
}
.lightbox-dot.active {
  background: #fff;
  transform: scale(1.3);
}

@media (max-width: 768px) {
  .lightbox {
    align-items: stretch;
    justify-content: stretch;
    padding: 0;
  }
  .lightbox-inner {
    max-width: 100vw;
    max-height: 100dvh;
    width: 100vw;
    height: 100dvh;
    border-radius: 0;
    justify-content: center;
    gap: 0;
  }
  .lightbox-img {
    max-height: calc(100dvh - 80px);
    max-width: 100vw;
    border-radius: 0;
  }
  .lightbox-close {
    position: fixed;
    top: 12px;
    right: 12px;
    z-index: 10001;
    background: rgba(0, 0, 0, 0.7);
  }
  .lightbox-nav {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }
  .lightbox-nav.prev {
    left: 8px;
  }
  .lightbox-nav.next {
    right: 8px;
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 10px 0;
}
.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  display: inline-block;
  animation: typing 1.4s infinite ease-in-out both;
}
.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}
@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  margin-top: auto;
}

.chat.vn-mode .vn-initial-msg {
  background: rgba(15, 15, 20, 0.9) !important;
  padding: 16px 20px !important;
  border-radius: 16px !important;
  border: 1px solid rgba(217, 119, 6, 0.4) !important;
  margin-bottom: 8px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
}
.chat.vn-mode .vn-initial-msg .assistant-header {
  position: static;
  background: transparent;
  box-shadow: none;
  border: none;
  margin-bottom: 16px;
}
.chat.vn-mode .vn-initial-msg .jaheen-name {
  font-size: 20px !important;
  color: #f59e0b !important;
}
.chat.vn-mode .vn-initial-msg .answer-text {
  font-size: 16px !important;
  color: #fff !important;
  font-weight: 500;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8) !important;
}

.chat.vn-mode .textarea {
  background: rgba(15, 15, 20, 0.95) !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
  flex: 1;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 15px;
  line-height: 1.5;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
}
.chat.vn-mode .textarea:focus {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  outline: none !important;
}
.chat.vn-mode .textarea::placeholder {
  color: rgba(255, 255, 255, 0.45) !important;
  opacity: 1 !important;
}

.chat.vn-mode .send-btn {
  background: #f59e0b !important;
  opacity: 1 !important;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.chat.vn-mode .send-btn:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed;
}
</style>
