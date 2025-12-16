// src/plugins/socket.ts
import type { App, InjectionKey } from "vue";
import type { Socket } from "socket.io-client";
import { connectSocket, getSocket, disconnectSocket } from "@/composables/useSocket";

export type SocketApi = {
  connect: (token: string, userId: number | string) => Socket;
  get: () => Socket | null;
  disconnect: () => void;
};

export const socketKey: InjectionKey<SocketApi> = Symbol("socket");

export function createSocketPlugin(options: { baseUrl: string; path: string }) {
  return {
    install(app: App) {
      const api: SocketApi = {
        connect: (token, userId) => connectSocket(token, userId, options.baseUrl, options.path),
        get: () => getSocket(),
        disconnect: () => disconnectSocket(),
      };

      // provide/inject (Composition API)
      app.provide(socketKey, api);

      // opcional: Options API: this.$socket
      app.config.globalProperties.$socket = api;
    },
  };
}
