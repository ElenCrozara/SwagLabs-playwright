# Plano técnico: Refatorar Page Objects para baseURL e Fixtures

## 1. Decisões Técnicas e Pesquisa

### D1 – Onde definir a baseURL

- **Decisão:** Definir `baseURL` em `playwright.config.ts` dentro de `use`, com valor padrão `https://www.saucedemo.com/v1`. Opcionalmente permitir sobrescrita via variável de ambiente (ex.: `process.env.BASE_URL || 'https://www.saucedemo.com/v1'`) para facilitar troca de ambiente sem editar o arquivo.
- **Racional:** O Playwright usa `use.baseURL` para resolver navegações relativas (`page.goto('/path')`); um único ponto no config atende ao RF1. Variável de ambiente permite CI ou ambientes alternativos sem alterar código.
- **Alternativas consideradas:** Apenas variável de ambiente (obrigaria a definir em todo ambiente); apenas valor fixo no config (troca exige editar o arquivo).

### D2 – Formato das rotas nos page objects

- **Decisão:** Usar rotas relativas à base: `/index.html`, `/inventory.html`, `/cart.html`, `/checkout-step-one.html`, `/checkout-step-two.html`, `/checkout-complete.html`, `/inventory-item.html?id=X`. Em todos os `page.goto()` e `page.waitForURL()` substituir URLs completas por essas rotas (ou por `new URL(path, baseURL)` se for necessário construir URL em código; o Playwright resolve `page.goto('/index.html')` com a baseURL do config).
- **Racional:** Com `baseURL` definido no config, `page.goto('/index.html')` já resolve para a URL completa; não é necessário passar baseURL para os page objects, pois a `page` já está associada ao contexto do teste que herdou o baseURL.
- **Alternativas consideradas:** Passar baseURL no construtor dos page objects (redundante se o config já fornece); manter URLs completas e só trocar via env (não atende “navegação relativa”).

### D3 – Implementação das fixtures de dados

- **Decisão:** Criar um módulo de dados de teste (ex.: `support/fixtures.ts` ou `support/test-data.ts`) que exporta objetos com credenciais e dados de checkout. Valores padrão: credenciais atuais (`standard_user`, `secret_sauce`, senha inválida `pwd`) e dados de checkout atuais (nome, sobrenome, CEP). Os page objects importam esse módulo e usam os valores nos métodos em vez de literais. Não usar `test.extend()` para injetar dados nos page objects nesta etapa, para evitar alterar a assinatura de todos os testes; o foco é centralizar dados em um único arquivo.
- **Racional:** Um único arquivo (`support/fixtures.ts`) atende ao RF3 (um único ponto para credenciais e checkout); os page objects continuam recebendo apenas `Page` no construtor; specs não precisam ser alterados para passar fixtures. Futura evolução pode ler de `process.env` ou de arquivo por ambiente.
- **Alternativas consideradas:** `test.extend()` com fixtures e passar credenciais/checkout para cada método (mais idiomático Playwright, mas exige alterar todas as chamadas nos specs e nos beforeAll); arquivo JSON (exige carregamento assíncrono ou require).

### D4 – Ordem da refatoração

- **Decisão:** (1) Ativar baseURL no config e criar o módulo de fixtures com valores atuais; (2) Refatorar LoginPage (goto e credenciais); (3) Refatorar ProductsPage (login com rotas e fixtures); (4) Refatorar CartPage (login, rotas em todos os métodos, dados de checkout das fixtures); (5) Executar a suíte e corrigir falhas. Assim, cada passo pode ser validado (login.spec primeiro, depois products, depois cart).
- **Racional:** LoginPage é a base (usado por todos); Products e Cart dependem de login; Cart tem mais pontos de URL e dados de checkout. Refatorar em ordem de dependência reduz risco.

### D5 – Assertions de URL nos page objects

- **Decisão:** Onde hoje há `expect(this.page.url()).toMatch('https://...')` ou `waitForURL('https://...')`, substituir por `waitForURL(/\/inventory\.html/)` ou `expect(this.page.url()).toMatch(/\/cart\.html/)` (padrão que funciona com qualquer baseURL). Assim, os page objects não dependem do host na assertion.
- **Racional:** Mantém a validação de “estamos na rota correta” sem acoplar ao domínio; trocar baseURL não quebra assertions.

---

## 2. Base Técnica do Legado (Referência)

Contexto extraído de `adk/context/` (análise 2025-02-08).

### Stack

- **Runtime:** Node.js | **Linguagem:** TypeScript | **Testes:** @playwright/test (Chromium) | **Qualidade:** ESLint, Prettier | **Relatório:** allure-playwright

### Arquitetura

- **Estrutura:** `support/*.index.ts` (page objects), `tests/*.spec.ts` (specs). **Padrão:** POM; cada classe recebe `Page` no construtor. **App sob teste:** Sauce Demo (URLs hoje hardcoded nos page objects).

### Convenções

- Arquivos `*.index.ts` e `*.spec.ts`; métodos em camelCase; sufixo `Page`; `readonly page: Page`; preferência por getByRole/getByText quando aplicável.

### O que será reutilizado

- Estrutura de pastas, POM, convenções de nomenclatura, padrões de locators e assertions (exceto URLs e dados literais).

### O que será modificado

- **playwright.config.ts:** definir `use.baseURL` (e opcionalmente `process.env.BASE_URL`).
- **support/login.index.ts:** `goto` e `gotoLogin` com rotas relativas; credenciais a partir do módulo de fixtures.
- **support/products.index.ts:** `login()` com rota relativa e credenciais do módulo de fixtures.
- **support/cart.index.ts:** todas as URLs (goto e waitForURL) em rotas relativas; credenciais e dados de checkout do módulo de fixtures.

### O que será adicionado

- **support/fixtures.ts** (ou **support/test-data.ts**): módulo que exporta `credentials` (válido e inválido) e `checkoutData` (firstName, lastName, postalCode).

---

## 3. Modelo de Dados (Fixtures)

Estrutura do módulo de dados de teste (sem persistência; apenas valores em memória consumidos pelos page objects).

| Entidade / Export | Campos | Uso |
|-------------------|--------|-----|
| **credentials** (ou `credentialsValid`) | `username: string`, `password: string` | Login com sucesso em LoginPage, ProductsPage, CartPage. |
| **credentialsInvalid** (ou cenário em credentials) | `username: string`, `password: string` | Login com erro em LoginPage (`loginError()`). |
| **checkoutData** | `firstName: string`, `lastName: string`, `postalCode: string` | Checkout em CartPage (`checkout()`, `novoCheckout()`). |

Valores padrão (atuais no código):

- **credentials (válido):** `username: 'standard_user'`, `password: 'secret_sauce'`.
- **credentials (inválido):** `username: 'standard_user'`, `password: 'pwd'`.
- **checkoutData:** `firstName: 'Elen'`, `lastName: 'Crozara'`, `postalCode: '38400644'`.

Não há banco nem API; o módulo é importado pelos page objects e pode ser evoluído depois para ler de env ou arquivo.

---

## 4. Contratos de API / Fluxos UI

Não há APIs REST no projeto. Os “contratos” são o comportamento dos fluxos E2E, que deve permanecer o mesmo após a refatoração:

- **Login:** navegação para rota de login, preenchimento e submit; espera rota de inventário (ou mensagem de erro).
- **Logout:** menu → Logout; espera rota de login.
- **Produtos:** login (reuso) e validações na listagem.
- **Carrinho/Checkout:** login, seleção de produto, carrinho, preenchimento de checkout com firstName/lastName/postalCode, pagamento e conclusão.

Nenhum contrato formal além da suíte E2E existente; a refatoração não altera esses fluxos, apenas a origem da URL e dos dados.

---

## 5. Estratégia de Testes

- **Objetivo:** Garantir que a refatoração não introduz regressão. Não há novos cenários de teste; a suíte atual (login, products, cart) serve como critério de sucesso.
- **Abordagem:** Após cada etapa de refatoração (config + fixtures, LoginPage, ProductsPage, CartPage), executar a suíte completa (`npm run test` ou `npx playwright test`). Se algum teste falhar, corrigir antes de prosseguir.
- **Ordem sugerida de validação:** (1) Config e fixtures criados + LoginPage refatorado → rodar `tests/login.spec.ts`; (2) ProductsPage refatorado → rodar `tests/products.spec.ts`; (3) CartPage refatorado → rodar `tests/cart.checkout.spec.ts`; (4) Rodar suíte completa.
- **TDD no contexto de refatoração:** “Testes” = suíte existente (Red = quebrou, Green = todos passando após a mudança). Não é necessário escrever testes novos; manter os atuais verdes é o critério.

---

## 6. Cenários de Teste (Validação)

Cenários para validar que a refatoração atende aos requisitos:

| ID | Cenário | Pré-condição | Ação | Resultado esperado |
|----|---------|--------------|------|--------------------|
| V1 | Suíte passa após refatoração | Refatoração completa (baseURL + fixtures + todos os page objects) | Executar `npm run test` | Todos os testes E2E (login, products, cart) passam. |
| V2 | baseURL é o único ponto de URL base | Projeto refatorado | Inspeção: não deve haver strings com `https://www.saucedemo.com` (ou domínio completo) nos page objects | Apenas o config (e eventualmente o módulo de fixtures se documentar URL) contém a URL base; page objects usam rotas relativas. |
| V3 | Dados de teste em um único ponto | Projeto refatorado | Inspeção: credenciais e dados de checkout não devem estar hardcoded em login.index.ts, products.index.ts, cart.index.ts | Credenciais e checkout vêm do módulo de fixtures (ou equivalente). |

Implementação: V1 via execução da suíte; V2 e V3 via revisão de código (ou checklist no adk-tasks).

---

## 7. Resumo de Implementação

| Item | Decisão |
|------|---------|
| **baseURL** | `playwright.config.ts` → `use.baseURL` com valor padrão `https://www.saucedemo.com/v1`; opcional `process.env.BASE_URL`. |
| **Rotas nos page objects** | Substituir todas as URLs completas por rotas relativas (`/index.html`, `/inventory.html`, etc.) em `goto` e `waitForURL`; assertions de URL com regex (ex.: `/\/cart\.html/`). |
| **Fixtures** | Novo arquivo `support/fixtures.ts` (ou `support/test-data.ts`) exportando `credentials` (válido/inválido) e `checkoutData`; page objects importam e usam. |
| **Ordem** | Config + fixtures → LoginPage → ProductsPage → CartPage; rodar suíte após cada etapa. |
| **Testes** | Nenhum teste novo; validação pela suíte E2E existente. |
