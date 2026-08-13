/**
 * Regressão de carregamento de idioma, ponta a ponta.
 *
 * Duas restrições moldam este arquivo:
 *
 * 1. A tela de configuração (/campaign-tracker/configuration) e /campaign-tracker/keyword
 *    têm `beforeEnter: requireAuth` e redirecionam para o login. A única superfície
 *    pública que passa por i18n é /shared-keywords.
 *
 * 2. Entrar em /shared-keywords por deep-link estoura — em TODOS os idiomas,
 *    inclusive en_US. É um bug de boot pré-existente e sem relação com tradução:
 *    src/main.ts:27 chama `registerPlugins(app, "prod")` sem `await` e monta o app
 *    em seguida, então componentes podem rodar seu setup antes de
 *    `loadLanguage()` registrar as mensagens. KeywordDataRepository.load lê
 *    `i18n.messages.value[locale].keyword` e encontra undefined.
 *    Por isso entramos pela raiz (que boota bem) e navegamos pelo router.
 *
 * O idioma é semeado no localStorage porque o bootstrap em src/plugins/index.ts lê
 * `ConfigurationStore.enabledLanguage`, um useStorage("LanguageStore.enabled").
 */
import { test, expect, type Page } from "@playwright/test";

const CHAVE_STORAGE = "LanguageStore.enabled";

/** Título do card em KeywordView.vue — vem de `menu.keyword`. */
const TITULO = {
  en_US: "Keyword",
  pt_BR: "Palavra-chave",
  de_DE: "Schlüsselwörter",
} as const;

/** Label do keyword `heal-x`, presente em todos os idiomas traduzidos. */
const HEAL = {
  en_US: "HEAL X",
  pt_BR: "CURAR X",
  de_DE: "HEILEN X",
} as const;

async function abreCatalogo(page: Page, idioma: string | null) {
  await page.addInitScript(
    ([chave, valor]) => {
      if (valor === null) window.localStorage.removeItem(chave);
      else window.localStorage.setItem(chave, valor);
    },
    [CHAVE_STORAGE, idioma] as [string, string | null],
  );

  await page.goto("/");
  // espera o bootstrap assíncrono registrar as mensagens antes de trocar de rota
  await page.waitForLoadState("networkidle");

  // não há link no app para /shared-keywords; navegamos pelo history, que é o que
  // o vue-router escuta, para não recarregar a página e cair no bug de deep-link
  await page.evaluate(() => {
    window.history.pushState({}, "", "/shared-keywords");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

/** O catálogo tem 223 entradas; filtrar deixa a asserção estável. */
async function buscaKeyword(page: Page, termo: string) {
  const busca = page.locator("#keyword-search").locator("input").first();
  await busca.waitFor({ state: "visible" });
  await busca.fill(termo);
}

test("pt_BR: catálogo de keywords renderiza em português", async ({ page }) => {
  await abreCatalogo(page, "pt_BR");

  await expect(page.getByText(TITULO.pt_BR, { exact: true }).first()).toBeVisible();

  // prova que o array pt_BR carregou e que o lookup por id funciona
  await buscaKeyword(page, "CURAR");
  await expect(page.getByText(HEAL.pt_BR, { exact: true }).first()).toBeVisible();
});

test("pt_BR: keyword novo do Underkeep está traduzido", async ({ page }) => {
  await abreCatalogo(page, "pt_BR");

  // DUAS MÃOS (two-handed) não existia na versão antiga do app
  await buscaKeyword(page, "DUAS");
  await expect(page.getByText("DUAS MÃOS", { exact: true }).first()).toBeVisible();
});

test("de_DE: idioma já em produção continua funcionando", async ({ page }) => {
  await abreCatalogo(page, "de_DE");

  await expect(page.getByText(TITULO.de_DE, { exact: true }).first()).toBeVisible();
  await buscaKeyword(page, "HEILEN");
  await expect(page.getByText(HEAL.de_DE, { exact: true }).first()).toBeVisible();
});

test("es_ES: locale ainda vazio cai para inglês sem quebrar", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));

  await abreCatalogo(page, "es_ES");

  // es_ES tem os 4 arquivos como esboço `---`; exercita o fallback de src/language.ts
  await expect(page.getByText(TITULO.en_US, { exact: true }).first()).toBeVisible();
  await buscaKeyword(page, "HEAL");
  await expect(page.getByText(HEAL.en_US, { exact: true }).first()).toBeVisible();

  expect(erros, "o fallback de idioma não deve lançar").toEqual([]);
});

test("sem preferência salva: usa inglês", async ({ page }) => {
  await abreCatalogo(page, null);

  await expect(page.getByText(TITULO.en_US, { exact: true }).first()).toBeVisible();
});
