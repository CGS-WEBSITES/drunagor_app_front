import axios from "axios";

// True when the app talks to the test backend (teste.drunagor.app or a local dev server).
export const isTestApi = () => (axios.defaults.baseURL || "").includes("/test/");
