// Dev-only choice of API environment. A local dev server talks to the test
// backend by default and only uses prod when explicitly switched to it from
// /dev-preview. Builds ignore this and keep the env passed in main.ts.
const KEY = "dev_api_env";
const SESSION_KEY = "dev_session_env";

export type ApiEnv = "prod" | "test";

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("app_user");
};

export const resolveApiEnv = (buildEnv: string): string => {
  if (!import.meta.env.DEV) return buildEnv;
  try {
    const env = localStorage.getItem(KEY) || "test";
    // Sessions belong to one backend: drop one saved against the other API.
    if (localStorage.getItem(SESSION_KEY) !== env) {
      clearSession();
      localStorage.setItem(SESSION_KEY, env);
    }
    return env;
  } catch {
    return "test";
  }
};

export const switchApiEnv = (env: ApiEnv) => {
  localStorage.setItem(KEY, env);
  window.location.reload();
};
