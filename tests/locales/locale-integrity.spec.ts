/**
 * Integridade estática dos arquivos de tradução.
 *
 * Não usa a fixture `page`, então roda sem browser. É a rede de proteção principal
 * para mudanças em src/locales: pega YAML quebrado, chave duplicada, colisão entre
 * namespaces, id órfão e markup perdido antes de qualquer coisa chegar ao runtime.
 */
import { test, expect } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

// o projeto é "type": "module", então não há __dirname
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, "../..");
const LOCALES = path.join(RAIZ, "src/locales");
const SRC = path.join(RAIZ, "src");

/** Os 4 namespaces que src/language.ts importa e mescla. */
const ARQUIVOS = ["app", "campaign", "items", "keywords"] as const;

/** Ordem espelha src/language.ts:11-19. */
const IDIOMAS = ["en_US", "de_DE", "fr_FR", "es_ES", "it_IT", "pl_PL", "pt_BR"] as const;

/** Idiomas com tradução completa esperada. Os demais podem ter lacunas. */
const COMPLETOS = ["en_US", "pt_BR"] as const;

/**
 * Lacuna PRÉ-EXISTENTE, não introduzida por este trabalho: de_DE, fr_FR e pl_PL
 * foram copiados da versão antiga do app e nunca receberam o conteúdo novo.
 * O número trava a regressão — se a defasagem aumentar, o teste quebra.
 */
const DEFASAGEM_MAXIMA: Record<string, number> = {
  de_DE: 38,
  fr_FR: 38,
  pl_PL: 42,
};

type Dicionario = Record<string, unknown>;

function caminho(idioma: string, arquivo: string): string {
  return path.join(LOCALES, idioma, `${arquivo}.yaml`);
}

function carrega(idioma: string, arquivo: string): Dicionario | null {
  const bruto = fs.readFileSync(caminho(idioma, arquivo), "utf8");
  // js-yaml lança em chave duplicada, que é justamente o que queremos detectar.
  return (yaml.load(bruto) as Dicionario | null) ?? null;
}

/** Locale ainda não traduzido: arquivo com apenas `---`, que o YAML resolve para null. */
function ehEsboco(idioma: string, arquivo: string): boolean {
  return carrega(idioma, arquivo) === null;
}

/** Achata em caminhos folha, indexando arrays por posição. */
function achata(valor: unknown, prefixo = "", saida: Record<string, string> = {}) {
  if (valor === null || valor === undefined) return saida;
  if (Array.isArray(valor)) {
    valor.forEach((item, i) => achata(item, `${prefixo}[${i}]`, saida));
    return saida;
  }
  if (typeof valor === "object") {
    for (const chave of Object.keys(valor as Dicionario)) {
      const p = prefixo ? `${prefixo}.${chave}` : chave;
      achata((valor as Dicionario)[chave], p, saida);
    }
    return saida;
  }
  saida[prefixo] = String(valor);
  return saida;
}

/** Markup que precisa sobreviver à tradução intacto. */
const MARKUP = /\{[^}]+\}|<br\s*\/?>|<\/?b>|@:[\w.-]+|<img[^>]*>/g;

function marcas(texto: string): string {
  return (texto.match(MARKUP) ?? []).sort().join("|");
}

// ---------------------------------------------------------------------------
// Invariantes de TODOS os idiomas — protegem o que já está em produção.
// ---------------------------------------------------------------------------

for (const idioma of IDIOMAS) {
  test(`${idioma}: todo yaml existe e faz parse (sem chave duplicada)`, () => {
    for (const arquivo of ARQUIVOS) {
      const alvo = caminho(idioma, arquivo);
      expect(fs.existsSync(alvo), `${alvo} não existe`).toBe(true);
      expect(() => carrega(idioma, arquivo), `${idioma}/${arquivo}.yaml não faz parse`).not.toThrow();
    }
  });

  test(`${idioma}: namespaces de topo são disjuntos`, () => {
    // src/language.ts mescla os 4 arquivos com spread raso; uma chave de topo
    // repetida entre eles apagaria silenciosamente o namespace anterior.
    const dono = new Map<string, string>();
    for (const arquivo of ARQUIVOS) {
      const dados = carrega(idioma, arquivo);
      if (dados === null) continue;
      for (const chave of Object.keys(dados)) {
        const anterior = dono.get(chave);
        expect(
          anterior,
          `chave de topo "${chave}" aparece em ${arquivo}.yaml e em ${anterior}.yaml`,
        ).toBeUndefined();
        dono.set(chave, arquivo);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Invariantes estritos: en_US e pt_BR precisam estar em paridade.
// ---------------------------------------------------------------------------

for (const idioma of COMPLETOS) {
  if (idioma === "en_US") continue;

  test(`${idioma}: nenhum arquivo é esboço vazio`, () => {
    for (const arquivo of ARQUIVOS) {
      expect(ehEsboco(idioma, arquivo), `${idioma}/${arquivo}.yaml está vazio`).toBe(false);
    }
  });

  for (const arquivo of ["app", "campaign", "items"] as const) {
    test(`${idioma}/${arquivo}: paridade de chaves com en_US`, () => {
      const en = achata(carrega("en_US", arquivo));
      const alvo = achata(carrega(idioma, arquivo));
      const faltando = Object.keys(en).filter((k) => !(k in alvo));
      const sobrando = Object.keys(alvo).filter((k) => !(k in en));
      expect(faltando, `chaves ausentes em ${idioma}/${arquivo}`).toEqual([]);
      expect(sobrando, `chaves órfãs em ${idioma}/${arquivo}`).toEqual([]);
    });

    test(`${idioma}/${arquivo}: ids e markup preservados`, () => {
      const en = achata(carrega("en_US", arquivo));
      const alvo = achata(carrega(idioma, arquivo));
      const idsDivergentes = Object.keys(en).filter(
        (k) => k.endsWith(".id") && alvo[k] !== en[k],
      );
      // Os repositórios em src/data/repository fazem lookup por `id`; traduzir um id
      // quebra a busca silenciosamente.
      expect(idsDivergentes, `ids traduzidos em ${idioma}/${arquivo}`).toEqual([]);

      const markupDivergente = Object.keys(en).filter(
        (k) => marcas(en[k]) !== marcas(alvo[k] ?? ""),
      );
      expect(markupDivergente, `markup divergente em ${idioma}/${arquivo}`).toEqual([]);
    });
  }

  test(`${idioma}/keywords: mesmo conjunto de ids, ícones e markup`, () => {
    const en = (carrega("en_US", "keywords") as { keyword: any[] }).keyword;
    const alvo = (carrega(idioma, "keywords") as { keyword: any[] }).keyword;

    const idsEn = en.map((k) => String(k.id));
    const idsAlvo = alvo.map((k) => String(k.id));
    expect(
      idsEn.filter((id) => !idsAlvo.includes(id)),
      `keywords ausentes em ${idioma}`,
    ).toEqual([]);
    expect(
      idsAlvo.filter((id) => !idsEn.includes(id)),
      `keywords órfãos em ${idioma} (id renomeado ou removido no en_US)`,
    ).toEqual([]);

    const porId = new Map(alvo.map((k) => [String(k.id), k]));
    for (const entrada of en) {
      const traduzida = porId.get(String(entrada.id))!;
      // `icon` não é texto: precisa ser idêntico, senão o ícone some ao trocar de idioma.
      expect(traduzida.icon, `icon divergente em ${idioma} keyword "${entrada.id}"`).toEqual(
        entrada.icon,
      );
      expect(
        marcas(String(traduzida.description ?? "")),
        `markup divergente em ${idioma} keyword "${entrada.id}"`,
      ).toBe(marcas(String(entrada.description ?? "")));
    }
  });
}

// ---------------------------------------------------------------------------
// Defasagem conhecida dos idiomas parcialmente traduzidos.
// ---------------------------------------------------------------------------

for (const [idioma, maximo] of Object.entries(DEFASAGEM_MAXIMA)) {
  test(`${idioma}: defasagem de keywords não piorou`, () => {
    if (ehEsboco(idioma, "keywords")) return;
    const en = (carrega("en_US", "keywords") as { keyword: any[] }).keyword;
    const alvo = (carrega(idioma, "keywords") as { keyword: any[] }).keyword;
    const idsAlvo = new Set(alvo.map((k) => String(k.id)));
    const ausentes = en.filter((k) => !idsAlvo.has(String(k.id))).length;
    expect(
      ausentes,
      `${idioma} perdeu terreno: ${ausentes} keywords sem tradução (limite ${maximo})`,
    ).toBeLessThanOrEqual(maximo);
  });
}

// ---------------------------------------------------------------------------
// Código x locale: toda chave usada em t()/$t() precisa existir no en_US.
// ---------------------------------------------------------------------------

/** Formato de uma chave de tradução de verdade: "label.foo", "text.bar-baz". */
const FORMATO_CHAVE = /^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/;

/**
 * Padrão legado em que a própria frase em inglês é usada como chave — ex.:
 * t("Delete"), t("Warning"). Renderiza a frase, então funciona em inglês, mas é
 * intraduzível. Não corrigimos aqui; travamos o número para não se espalhar.
 */
const FRASES_COMO_CHAVE_MAXIMO = 33;

function arquivosFonte(dir: string, acc: string[] = []): string[] {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name !== "node_modules") arquivosFonte(p, acc);
    } else if (
      (entrada.name.endsWith(".vue") || entrada.name.endsWith(".ts")) &&
      // artefatos compilados commitados ao lado dos componentes; espelham o .vue
      !entrada.name.endsWith(".vue.js")
    ) {
      acc.push(p);
    }
  }
  return acc;
}

function mensagensEn(): Dicionario {
  const todas: Dicionario = {};
  for (const arquivo of ARQUIVOS) Object.assign(todas, carrega("en_US", arquivo));
  return todas;
}

function coletaChaves(): { chaves: Map<string, Set<string>>; frases: Set<string> } {
  const padrao = /(?:\$t|\bt)\(\s*["'`]([^"'`\n]+)["'`]/g;
  const chaves = new Map<string, Set<string>>();
  const frases = new Set<string>();
  for (const arquivo of arquivosFonte(SRC)) {
    const conteudo = fs.readFileSync(arquivo, "utf8");
    const rel = path.relative(RAIZ, arquivo).split(path.sep).join("/");
    let m: RegExpExecArray | null;
    while ((m = padrao.exec(conteudo))) {
      const chave = m[1];
      if (!FORMATO_CHAVE.test(chave)) {
        frases.add(chave);
        continue;
      }
      if (!chaves.has(chave)) chaves.set(chave, new Set());
      chaves.get(chave)!.add(rel);
    }
  }
  return { chaves, frases };
}

test("toda chave t()/$t() do código existe no en_US", () => {
  const mensagens = mensagensEn();
  const existe = (chave: string) =>
    chave.split(".").reduce<unknown>((a, k) => (a == null ? a : (a as Dicionario)[k]), mensagens) !==
    undefined;

  const { chaves } = coletaChaves();
  const ausentes = [...chaves.entries()]
    .filter(([chave]) => !existe(chave))
    .map(([chave, arquivos]) => `${chave} (${[...arquivos].join(", ")})`);

  expect(ausentes, "chaves referenciadas no código mas ausentes do en_US").toEqual([]);
});

test("o padrão legado de frase-como-chave não se espalhou", () => {
  const { frases } = coletaChaves();
  expect(
    frases.size,
    `use uma chave de tradução ("label.x") em vez da frase em inglês. Encontradas: ${[...frases]
      .sort()
      .join(" | ")}`,
  ).toBeLessThanOrEqual(FRASES_COMO_CHAVE_MAXIMO);
});
