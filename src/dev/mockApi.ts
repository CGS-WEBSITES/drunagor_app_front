// Dev-only fake API for /dev-preview. While enabled, every request made
// through the shared axios instance is answered locally, so previews never
// reach (or write to) the real backend.
import axios, { type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";

export const DEV_USER_PK = 900001;
export const DEV_EVENT_PK = 900001;
export const DEV_TABLE_PK = 1;
export const DEV_CAMPAIGN_ID = "900001";

const encodeHero = (heroId: string) => btoa(JSON.stringify({ heroId }));

export const DEV_EVENT = {
  events_pk: DEV_EVENT_PK,
  store_name: "CGS Store",
  scenario: "Wing 1 Tutorial",
  seasons_fk: 2,
  event_date: new Date(Date.now() + 86400000).toISOString(),
  address: "Billings, MT, USA",
  seats_number: 8,
  latitude: 45.7833,
  longitude: -108.5007,
  picture_hash: null,
};

const inDays = (days: number, hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

// Event list shown on the player's Events page.
const LIST_EVENTS = [
  DEV_EVENT,
  { ...DEV_EVENT, events_pk: 900011, store_name: "Barbarian Boardgame Store", address: "Springfield, MO, USA", scenario: "Wing 2 Advanced", seasons_fk: 2, event_date: inDays(3, 18), latitude: 37.209, longitude: -93.2923 },
  { ...DEV_EVENT, events_pk: 900012, store_name: "Racchunk's Boardgame Mega Store", address: "Santa Monica, CA, USA", scenario: "Wing 3", seasons_fk: 3, event_date: inDays(6, 15), latitude: 34.0195, longitude: -118.4912 },
  { ...DEV_EVENT, events_pk: 900013, store_name: "Boardgames da Gabi", address: "Lowrey Ave, Honolulu, HI, USA", scenario: "Wing 1 Tutorial", seasons_fk: 2, event_date: inDays(10, 19), latitude: 21.3069, longitude: -157.8583 },
  { ...DEV_EVENT, events_pk: 900014, store_name: "Fize Boardgame Mega Store", address: "Kansas City, MO, USA", scenario: "Wing 4", seasons_fk: 3, event_date: inDays(14, 17), latitude: 39.0997, longitude: -94.5786 },
];

const REWARDS = [
  { name: "Tutorial Completed", description: "Complete the Wing 1 Tutorial.", picture_hash: "badges%26achievements/Tutorial%20Complete.png" },
  { name: "Drunagor APP Badges", description: "Check in at the event and get an exclusive event badge to show in your profile.", picture_hash: "badges%26achievements/Tutorial%20Complete.png" },
];

const campaignHash = (campaign: string, wing: string, door: string, daysAgo: number, heroes: (string | Record<string, unknown>)[] = []) =>
  btoa(JSON.stringify({ campaignData: { campaign, wing, door }, heroes: heroes.map((hero) => (typeof hero === "string" ? { heroId: hero } : hero)), savedAt: inDays(-daysAgo, 20) }));

// A played Core party, to see heroes with items and effects.
const OLD_GUARD_HEROES = [
  {
    heroId: "elros",
    equipment: { weaponId: "amiran-halberd", offHandId: "deadly-backstabber", armorId: "cloth-armor", trinketId: "amulet-of-power", bagOneId: "cosmic-gemstone-chest", bagTwoId: "" },
    stashedCardIds: ["crossbow", "breastplate"],
    skillIds: ["melee-1", "agility-1", "dungeon-role-1"],
    classAbilityCount: 3,
    statusIds: ["a-cooperative-approach"],
    outcomeIds: [],
  },
  "lorelai",
];

const DASH_CAMPAIGNS = [
  { campaigns_fk: 900101, party_name: "Creative Games Studio Party", box: 1, tracker_hash: campaignHash("apocalypse", "", "", 1, ["vorn", "maya", "jaheen"]) },
  { campaigns_fk: 900102, party_name: "Friday Night Heroes", box: 38, tracker_hash: campaignHash("underkeep", "Wing 1 Tutorial", "DUNGEON FOYER", 3) },
  { campaigns_fk: 900103, party_name: "The Dawnbreakers", box: 39, tracker_hash: campaignHash("underkeep2", "Wing 3", "FIRST SETUP", 6) },
  { campaigns_fk: 900104, party_name: "Old Guard", box: 1, tracker_hash: campaignHash("core", "", "", 20, OLD_GUARD_HEROES) },
];

// A player with many campaigns, to see the list and its loading.
const EXTRA_CAMPAIGNS = Array.from({ length: 14 }, (_, i) => {
  const kind = ["underkeep", "core", "underkeep2", "awakenings", "underkeep", "apocalypse", "underkeep2"][i % 7];
  const box = kind === "underkeep2" ? 39 : kind === "underkeep" ? 38 : 1;
  const heroes = kind.startsWith("underkeep") ? [] : [["vorn", "maya", "elros", "lorelai"], ["jaheen", "maya"], ["elros", "vorn", "jaheen"]][i % 3];
  const wing = kind === "underkeep" ? "Wing 1 Advanced" : kind === "underkeep2" ? "Wing 4" : "";
  return { campaigns_fk: 900200 + i, party_name: `Party ${i + 1}`, box, tracker_hash: campaignHash(kind, wing, "", 8 + i, heroes) };
});

type State = {
  nextHeroPk: number;
  myHeroes: { playable_heroes_pk: number; hero_hash: string; creation_date: string }[];
  myHeroPk: number | null;
};

let state: State;

const resetState = () => {
  state = {
    nextHeroPk: 200,
    // Heroes the fake player already owns ("Choose your Hero" tab).
    myHeroes: [
      { playable_heroes_pk: 101, hero_hash: encodeHero("vorn"), creation_date: "2026-09-01" },
      { playable_heroes_pk: 102, hero_hash: encodeHero("maya"), creation_date: "2026-09-01" },
    ],
    myHeroPk: null,
  };
};

// Other players sitting at the preview table.
const OTHER_PLAYERS = [
  { users_pk: 900002, user_name: "Ana", picture_hash: null, playable_heroes_fk: 501, event_status: "Granted Passage" },
  { users_pk: 900003, user_name: "Bruno", picture_hash: null, playable_heroes_fk: null, event_status: "Granted Passage" },
];
const OTHER_HEROES: Record<number, string> = { 501: "lorelai" };

const tablePlayers = () => [
  {
    users_pk: DEV_USER_PK,
    user_name: "You",
    picture_hash: null,
    playable_heroes_fk: state.myHeroPk,
    event_status: "Granted Passage",
    status_date: DEV_EVENT.event_date,
  },
  ...OTHER_PLAYERS,
];

type Route = [method: string, path: RegExp, handler: (config: InternalAxiosRequestConfig, match: RegExpMatchArray) => unknown];

const body = (config: InternalAxiosRequestConfig) => {
  if (!config.data) return {};
  try {
    return typeof config.data === "string" ? JSON.parse(config.data) : config.data;
  } catch {
    return {};
  }
};

const routes: Route[] = [
  // Events
  ["get", /^events\/search$/, () => ({ events: [DEV_EVENT] })],
  ["get", /^events\/\d+$/, () => DEV_EVENT],
  ["get", /^event_status\/search$/, () => ({
    event_status: [
      { event_status_pk: 1, name: "Granted Passage" },
      { event_status_pk: 2, name: "Turned Away" },
      { event_status_pk: 4, name: "Joined the Quest" },
    ],
  })],
  ["get", /^event_tables\/list\/\d+$/, () => ({
    tables: [
      { event_tables_pk: DEV_TABLE_PK, table_number: 1, max_players: 4, players_count: 3, available_seats: 1, is_full: false },
      { event_tables_pk: 2, table_number: 2, max_players: 4, players_count: 0, available_seats: 4, is_full: false },
    ],
  })],
  ["get", /^rl_events_users\/table_players\/\d+\/(\d+)$/, (_c, m) => ({
    players: Number(m[1]) === DEV_TABLE_PK ? tablePlayers() : [],
  })],
  ["get", /^rl_events_users\/table_players$/, () => ({ players: tablePlayers() })],
  ["get", /^rl_events_users\/list_players$/, () => ({ players: tablePlayers(), last_page: 1 })],
  ["get", /^rl_events_users\/check-duplicate$/, () => ({ exists: false })],
  ["post", /^rl_events_users\/cadastro$/, (config) => {
    const heroPk = config.params?.playable_heroes_fk ?? body(config).playable_heroes_fk;
    if (heroPk !== undefined) state.myHeroPk = heroPk ? Number(heroPk) : null;
    return { message: "ok" };
  }],
  ["get", /^rl_events_rewards\/list_rewards$/, () => ({ rewards: REWARDS })],
  ["get", /^events\/list_events$/, () => ({ events: LIST_EVENTS })],
  ["get", /^events\/my_events\/player$/, () => ({ events: [{ ...LIST_EVENTS[1], status: "Granted Passage" }] })],
  ["get", /^events\/my_events\/retailer$/, () => ({ events: [DEV_EVENT] })],

  ["get", /^stores\/list$/, () => ({ stores: [] })],
  ["get", /^sceneries\/search$/, () => ({ sceneries: [] })],

  // Heroes
  ["get", /^playable_heroes\/search$/, () => ({ playable_heroes: state.myHeroes })],
  ["get", /^playable_heroes\/(\d+)$/, (_c, m) => {
    const pk = Number(m[1]);
    const mine = state.myHeroes.find((h) => h.playable_heroes_pk === pk);
    if (mine) return mine;
    return { playable_heroes_pk: pk, hero_hash: encodeHero(OTHER_HEROES[pk] ?? "vorn") };
  }],
  ["post", /^playable_heroes\/cadastro$/, (config) => {
    const hero = {
      playable_heroes_pk: state.nextHeroPk++,
      hero_hash: body(config).hero_hash,
      creation_date: new Date().toISOString(),
    };
    state.myHeroes.push(hero);
    return { playable_hero: hero };
  }],

  // Campaigns
  // Dashboard campaigns; searches scoped to an event (Lobby) get none.
  ["get", /^rl_campaigns_users\/search$/, (config) => {
    if (config.params?.events_fk) return { campaigns: [] };
    const all = [...DASH_CAMPAIGNS, ...EXTRA_CAMPAIGNS];
    // One campaign when opening it, every campaign for the list.
    if (config.params?.campaigns_fk) return { campaigns: all.filter((c) => String(c.campaigns_fk) === String(config.params.campaigns_fk)) };
    return { campaigns: all.filter((c) => (c.box === 39) === (String(config.params?.show_season2) === "true")) };
  }],
  // Players with linked heroes only in Drunagor Nights; legacy parties keep their own heroes.
  ["get", /^rl_campaigns_users\/list_players$/, (config) => ({
    Users: config.params?.campaigns_fk && [38, 39].includes([...DASH_CAMPAIGNS, ...EXTRA_CAMPAIGNS].find((c) => String(c.campaigns_fk) === String(config.params.campaigns_fk))?.box ?? 38)
      ? [
          { user_name: "You", playable_heroes_fk: 101 },
          { user_name: "Ana", playable_heroes_fk: 501 },
          { user_name: "Bruno", playable_heroes_fk: null },
        ]
      : [],
  })],
  ["get", /^rl_campaigns_users\/search_players$/, () => ({ Users: [] })],
  ["get", /^campaigns\/\d+$/, () => ({})],
  ["get", /^doors\/search$/, () => ({ doors: [] })],
  ["get", /^rl_campaigns_doors\/search$/, () => ({ campaign_doors: [] })],
  ["get", /^rl_users_rewards\/list_rewards$/, () => ({ rewards: [] })],
];

const mockAdapter: AxiosAdapter = async (config) => {
  const method = (config.method || "get").toLowerCase();
  const path = (config.url || "").replace(/^https?:\/\/[^/]+/, "").replace(/^\/+|\/+$/g, "").split("?")[0];

  let data: unknown = { message: "ok" };
  const route = routes.find(([m, re]) => m === method && re.test(path));
  if (route) {
    data = route[2](config, path.match(route[1])!);
  } else if (method === "get") {
    console.warn(`[mock api] unhandled GET /${path}`, config.params ?? "");
    data = {};
  }

  // Small delay so loading states are visible, like the real API.
  await new Promise((resolve) => setTimeout(resolve, 150));
  return { data: JSON.parse(JSON.stringify(data)), status: 200, statusText: "OK", headers: {}, config };
};

let enabled = false;
let originalAdapter: InternalAxiosRequestConfig["adapter"];

export const enableMockApi = () => {
  if (enabled) return;
  resetState();
  originalAdapter = axios.defaults.adapter;
  axios.defaults.adapter = mockAdapter;
  enabled = true;
};

export const disableMockApi = () => {
  if (!enabled) return;
  axios.defaults.adapter = originalAdapter;
  enabled = false;
};
