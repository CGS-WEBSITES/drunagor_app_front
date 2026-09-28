// Dev-only test data generator. Always talks to the TEST backend through its
// own axios instance, logged in as the shared "retailer tester" account, so it
// never depends on (or touches) the session or API the app is using.
import axios, { type AxiosInstance } from "axios";
import md5 from "js-md5";

export const TEST_API_URL = "https://api.drunagor.app/test/system/";

const CREDENTIALS_KEY = "dev_tester_credentials";

export type TesterCredentials = { login: string; password: string };
export type Scenery = { sceneries_pk: number; name: string };

export type GenerateOptions = {
  sceneryPk: number;
  sceneryName: string;
  seasonFk: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM, 24h
  tables: number;
  maxPlayers: number;
};

export type GeneratedEvent = {
  eventPk: number;
  storeName: string;
  tables: { tablePk: number; tableNumber: number; lobbyPath: string }[];
};

const TESTER_STORE = {
  name: "Drunagor Tester Store",
  address: "1 Test Street, Billings, MT, United States",
  zip_code: "59101",
  latitude: 45.7833,
  longitude: -108.5007,
};

export const loadCredentials = (): TesterCredentials => {
  try {
    return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "") as TesterCredentials;
  } catch {
    return { login: "", password: "" };
  }
};

export const saveCredentials = (credentials: TesterCredentials) => {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
};

// The Season follows the wing: Wings 1-2 are Season 1, Wings 3-4 Season 2.
export const seasonForScenery = (name: string) => (/wing\s*0?[34]/i.test(name) ? 3 : 2);

const to12h = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
};

export class TestDataGenerator {
  private api: AxiosInstance;
  private usersPk: number | null = null;

  constructor() {
    // Explicit adapter so the dev-preview mock on the shared axios never applies.
    this.api = axios.create({ baseURL: TEST_API_URL, adapter: "xhr" });
  }

  private errorMessage(error: any) {
    return error?.response?.data?.message || error?.response?.data?.msg || error?.message || "Unknown error";
  }

  async login({ login, password }: TesterCredentials) {
    try {
      const { data } = await this.api.post("users/login", { login, password: md5(password) });
      this.api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      this.usersPk = data.data.users_pk;
      if (data.data.roles_fk !== 3) {
        throw new Error("This test account is not a retailer (roles_fk 3).");
      }
      return data.data as { users_pk: number; user_name: string };
    } catch (error) {
      throw new Error(`Tester login failed: ${this.errorMessage(error)}`);
    }
  }

  async register({ login, password }: TesterCredentials) {
    const userName = login.split("@")[0].replace(/[^a-z0-9_]/gi, "") || "retailertester";
    try {
      await this.api.post("users/cadastro", {
        name: "Retailer Tester",
        user_name: userName,
        email: login,
        password: md5(password),
        roles_fk: 3,
        active: true,
        verified: true,
        agreement: true,
      });
    } catch (error) {
      throw new Error(`Could not create the tester account: ${this.errorMessage(error)}`);
    }
  }

  async listSceneries(): Promise<Scenery[]> {
    const { data } = await this.api.get("sceneries/search", { params: { active: true } });
    return (data.sceneries || []) as Scenery[];
  }

  private async ensureStore(): Promise<{ storesPk: number; name: string }> {
    // The API answers 404 (not an empty list) when the user has no store yet.
    const { data } = await this.api.get("stores/list", {
      params: { users_fk: this.usersPk },
      validateStatus: (status) => status === 200 || status === 404,
    });
    const existing = (data.stores || []).find((store: any) => store.active);
    if (existing) {
      if (!existing.verified) await this.api.get(`stores/${existing.stores_pk}/verify`);
      return { storesPk: existing.stores_pk, name: existing.name };
    }

    const { data: countries } = await this.api.get("countries/search", { params: { name: "United States" } });
    const countriesFk = countries.countries?.[0]?.countries_pk;
    const { data: created } = await this.api.post("stores/cadastro", {
      ...TESTER_STORE,
      countries_fk: countriesFk,
      users_fk: this.usersPk,
      verified: "true", // the API parses this field as a boolean string
    });
    const storesPk = created.store?.stores_pk || created.stores_pk;
    await this.api.get(`stores/${storesPk}/verify`);
    return { storesPk, name: TESTER_STORE.name };
  }

  async generateEvent(options: GenerateOptions, onStep: (message: string) => void): Promise<GeneratedEvent> {
    if (!this.usersPk) throw new Error("Log in as the tester first.");
    try {
      onStep("Checking the tester store...");
      const store = await this.ensureStore();

      onStep(`Creating a ${options.sceneryName} event...`);
      const { data: eventData } = await this.api.post("events/cadastro", null, {
        params: {
          seats_number: options.tables * options.maxPlayers,
          seasons_fk: options.seasonFk,
          sceneries_fk: options.sceneryPk,
          date: `${options.date}; ${to12h(options.time)}`,
          stores_fk: store.storesPk,
          users_fk: this.usersPk,
          active: true,
        },
      });
      const eventPk = eventData.event?.events_pk;
      if (!eventPk) throw new Error("The API did not return the new event id.");

      onStep(`Creating ${options.tables} table(s)...`);
      await this.api.post("event_tables/create_multiple", {
        events_fk: eventPk,
        quantity: options.tables,
        max_players: options.maxPlayers,
      });
      const { data: tableData } = await this.api.get(`event_tables/list/${eventPk}`);

      onStep("Done.");
      return {
        eventPk,
        storeName: store.name,
        tables: (tableData.tables || []).map((table: any) => ({
          tablePk: table.event_tables_pk,
          tableNumber: table.table_number,
          lobbyPath: `/lobby/${eventPk}?table_pk=${table.event_tables_pk}`,
        })),
      };
    } catch (error) {
      throw new Error(this.errorMessage(error));
    }
  }
}
