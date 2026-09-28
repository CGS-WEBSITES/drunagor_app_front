// Dev-only override of the API environment ("prod" or "test"), so a local
// server can talk to the test backend without editing main.ts.
const KEY = "dev_api_env";

export type ApiEnv = "prod" | "test";

export const resolveApiEnv = (fallback: string): string => {
  if (!import.meta.env.DEV) return fallback;
  try {
    return localStorage.getItem(KEY) || fallback;
  } catch {
    return fallback;
  }
};

// Sessions are per backend, so switching logs out and reloads the app.
export const switchApiEnv = (env: ApiEnv) => {
  localStorage.setItem(KEY, env);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("app_user");
  window.location.reload();
};
