import { defineStore } from "pinia";
import axios from "axios";

const api = axios.create({
  timeout: 0,
  headers: {
    "Content-Type": "application/json",
  },
});

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;
const MAX_REFINEMENT_ROUNDS = 2;
const SUPPORT_URL =
  "https://newaccount1620866477944.freshdesk.com/support/tickets/new";
const STREAM_ENDPOINT = "/rag/drunagor/rules";
const FEEDBACK_ENDPOINT = "/history/feedback";
const SATISFACTION_ENDPOINT = "/rag/satisfaction";
const MAX_CHUNKS = 5;

const CATEGORY_LABELS: Record<string, any> = {
  game_rules: { label: "Rules", color: "#3b82f6" },
  atraso_entrega: { label: "Delay", color: "#ef4444" },
  reembolso: { label: "Refund", color: "#f59e0b" },
  status_pedido: { label: "Status", color: "#8b5cf6" },
  dano_defeito: { label: "Defect", color: "#ec4899" },
  outro: { label: "Other", color: "#6b7280" },
};

const ESCALATION_MESSAGES: Record<string, string> = {
  pt: `Infelizmente não consegui resolver sua dúvida desta vez. Por favor, abra um chamado com nossa equipe de suporte e entraremos em contato o mais breve possível:\n\n[Abrir chamado de suporte](${SUPPORT_URL})`,
  en: `I wasn't able to fully resolve your question this time. Please open a support ticket and our team will get back to you as soon as possible:\n\n[Open a support ticket](${SUPPORT_URL})`,
  es: `No pude resolver tu consulta esta vez. Por favor, abre un ticket de soporte y nuestro equipo te contactará a la brevedad:\n\n[Abrir ticket de soporte](${SUPPORT_URL})`,
  de: `Leider konnte ich Ihre Frage diesmal nicht lösen. Bitte öffnen Sie ein Support-Ticket und unser Team wird sich so schnell wie möglich bei Ihnen melden:\n\n[Support-Ticket öffnen](${SUPPORT_URL})`,
  fr: `Je n'ai pas pu résoudre votre question cette fois. Veuillez ouvrir un ticket de support et notre équipe vous répondra dès que possible:\n\n[Ouvrir un ticket de support](${SUPPORT_URL})`,
  it: `Non sono riuscito a risolvere la tua domanda questa volta. Apri un ticket di supporto e il nostro team ti risponderà il prima possibile:\n\n[Apri un ticket di supporto](${SUPPORT_URL})`,
};

function generateSessionId() {
  return "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEscalationMessage(language: string) {
  return ESCALATION_MESSAGES[language] || ESCALATION_MESSAGES["en"];
}

export const useRagStore = defineStore("rag", {
  state: () => ({
    loading: false,
    streaming: false,
    retryCount: 0,
    sessionId: generateSessionId(),
    detectedLanguage: null as string | null,

    categoryLabels: CATEGORY_LABELS,
    messages: [] as any[],
    lastResponse: null as any,

    refinement: {
      active: false,
      round: 0,
      parentMessageId: null as string | null,
      originalQuestion: null as string | null,
      originalAnswer: null as string | null,
    },
  }),

  actions: {
    setBaseUrl(url: string) {
      api.defaults.baseURL = url;
    },

    buildChatHistory() {
      return this.messages
        .filter((m) => m.content && m.content.trim())
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));
    },

    async ask(question: string) {
      const q = (question || "").trim();
      if (!q) return;

      const userMsgId = Date.now();
      this.messages.push({
        id: userMsgId,
        role: "user",
        content: q,
        timestamp: new Date(),
      });

      this.loading = true;
      this.streaming = false;
      this.retryCount = 0;

      const currentRound = this.refinement.active ? this.refinement.round : 0;

      const assistantMsg: any = {
        id: userMsgId + 1,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        meta: {
          sources: null,
          model: null,
          category: null,
          chatId: null,
          needInfo: false,
          refinementRound: currentRound,
        },
        _feedback: null as string | null,
        _satisfaction: null as boolean | null,
      };
      this.messages.push(assistantMsg);
      const assistantMsgIndex = this.messages.length - 1;

      const payload: any = {
        question: q,
        max_chunks: MAX_CHUNKS,
        session_id: this.sessionId,
        chat_history: this.buildChatHistory(),
      };

      if (this.detectedLanguage) {
        payload.language = this.detectedLanguage;
      }

      if (this.refinement.active) {
        payload.refinement_round = this.refinement.round;
        payload.parent_message_id = this.refinement.parentMessageId;
        payload.original_question = this.refinement.originalQuestion;
        payload.original_answer = this.refinement.originalAnswer;
      }

      let attempt = 0;
      let success = false;

      while (attempt <= MAX_RETRIES && !success) {
        try {
          if (attempt > 0) {
            this.retryCount = attempt;
            await sleep(RETRY_DELAY_MS);
          }

          const baseUrl = api.defaults.baseURL || "";
          const response = await fetch(`${baseUrl}${STREAM_ENDPOINT}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          this.loading = false;
          this.streaming = true;

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6);

              try {
                const event = JSON.parse(jsonStr);

                if (event.type === "meta") {
                  assistantMsg.meta.sources = event.sources;
                  assistantMsg.meta.model = event.model;
                  assistantMsg.meta.category = event.category;
                  assistantMsg.meta.needInfo = event.need_info || false;

                  if (event.language && !this.detectedLanguage) {
                    this.detectedLanguage = event.language;
                  }
                }

                if (event.type === "token") {
                  this.messages[assistantMsgIndex].content += event.content;
                }

                if (event.type === "done") {
                  assistantMsg.meta.chatId = event.chat_id;
                  if (this.refinement.active) {
                    this.refinement.round++;
                    this.refinement.active = false;
                  }
                }

                if (event.type === "error") {
                  this.messages[assistantMsgIndex].content +=
                    `\n\nError: ${event.message}`;
                }
              } catch {
                console.error("Failed to parse event:", jsonStr);
              }
            }
          }

          success = true;
        } catch (err: any) {
          attempt++;
          if (attempt > MAX_RETRIES) {
            assistantMsg.content = `Failed to generate response: ${err.message}`;
          }
        }
      }

      this.loading = false;
      this.streaming = false;
      this.retryCount = 0;
    },

    async sendSatisfaction(msg: any, satisfied: boolean) {
      if (!msg.meta?.chatId) return;
      msg._satisfaction = satisfied;

      try {
        await api.post(SATISFACTION_ENDPOINT, {
          chat_id: msg.meta.chatId,
          satisfied,
        });
      } catch {
        console.error("Failed to send satisfaction");
      }

      if (satisfied) return;

      const nextRound = this.refinement.round + 1;
      if (nextRound > MAX_REFINEMENT_ROUNDS) {
        this._pushEscalationMessage();
        return;
      }

      this.refinement.active = true;
      this.refinement.round = nextRound;
      this.refinement.parentMessageId = msg.meta.chatId;
      this.refinement.originalQuestion = this._getOriginalQuestion(msg);
      this.refinement.originalAnswer = msg.content;
    },

    _pushEscalationMessage() {
      const language = this.detectedLanguage || "en";
      this.messages.push({
        id: Date.now(),
        role: "assistant",
        content: getEscalationMessage(language),
        timestamp: new Date(),
        meta: {
          sources: null,
          model: null,
          category: null,
          chatId: null,
          needInfo: false,
          refinementRound: null,
          isEscalation: true,
        },
        _feedback: null,
        _satisfaction: null,
      });
      this.refinement = {
        active: false,
        round: 0,
        parentMessageId: null,
        originalQuestion: null,
        originalAnswer: null,
      };
    },

    _getOriginalQuestion(assistantMsg: any) {
      const idx = this.messages.findIndex((m) => m.id === assistantMsg.id);
      if (idx > 0) {
        const prev = this.messages[idx - 1];
        if (prev?.role === "user") return prev.content;
      }
      return "";
    },

    cancelRefinement() {
      this.refinement = {
        active: false,
        round: 0,
        parentMessageId: null,
        originalQuestion: null,
        originalAnswer: null,
      };
    },

    async sendFeedback(msg: any, type: string) {
      if (!msg.meta?.chatId) return;
      msg._feedback = msg._feedback === type ? null : type;
      try {
        await api.put(`${FEEDBACK_ENDPOINT}/${msg.meta.chatId}`, {
          feedback: msg._feedback || "up",
        });
      } catch {
        console.error("Failed to send feedback");
      }
    },

    newChat() {
      this.sessionId = generateSessionId();
      this.messages = [];
      this.lastResponse = null;
      this.retryCount = 0;
      this.detectedLanguage = null;
      this.refinement = {
        active: false,
        round: 0,
        parentMessageId: null,
        originalQuestion: null,
        originalAnswer: null,
      };
    },
  },
});
