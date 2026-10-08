// Short table codes ("KD-E9X") that players can type instead of scanning the
// table's QR code. The code is made from the event and table ids, so it needs
// no backend: the app decodes it and checks the table still exists.

// No I, O, 0 or 1, so the code reads aloud and types without confusion.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const BASE = ALPHABET.length;

// A small affine mix so consecutive tables don't get look-alike codes.
const EVENT_MIX = { a: 29, b: 7 };
const TABLE_MIX = { a: 31, b: 3 };

function encode(value: number): string {
  let out = "";
  do {
    out = ALPHABET[value % BASE] + out;
    value = Math.floor(value / BASE);
  } while (value > 0);
  return out.padStart(2, ALPHABET[0]);
}

function decode(text: string): number | null {
  let value = 0;
  for (const char of text) {
    const digit = ALPHABET.indexOf(char);
    if (digit < 0) return null;
    value = value * BASE + digit;
  }
  return value;
}

const checkChar = (eventPk: number, tablePk: number) => ALPHABET[(eventPk * 7 + tablePk * 13) % BASE];

export function lobbyCode(eventPk: number, tablePk: number): string {
  const event = encode(eventPk * EVENT_MIX.a + EVENT_MIX.b);
  const table = encode(tablePk * TABLE_MIX.a + TABLE_MIX.b);
  return `${event}-${table}${checkChar(eventPk, tablePk)}`;
}

/** The event and table a code points to, or null when it isn't a valid code. */
export function parseLobbyCode(input: string): { eventPk: number; tablePk: number } | null {
  const clean = input.toUpperCase().replace(/[\s_]/g, "");
  const match = /^([A-Z2-9]{2,})-([A-Z2-9]{3,})$/.exec(clean);
  if (!match) return null;
  const tableText = match[2].slice(0, -1);
  const check = match[2].slice(-1);
  const eventValue = decode(match[1]);
  const tableValue = decode(tableText);
  if (eventValue === null || tableValue === null) return null;
  if ((eventValue - EVENT_MIX.b) % EVENT_MIX.a !== 0 || (tableValue - TABLE_MIX.b) % TABLE_MIX.a !== 0) return null;
  const eventPk = (eventValue - EVENT_MIX.b) / EVENT_MIX.a;
  const tablePk = (tableValue - TABLE_MIX.b) / TABLE_MIX.a;
  if (eventPk <= 0 || tablePk <= 0 || checkChar(eventPk, tablePk) !== check) return null;
  return { eventPk, tablePk };
}
