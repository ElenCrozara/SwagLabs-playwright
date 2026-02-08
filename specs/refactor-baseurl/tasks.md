# Tarefas: Refatorar Page Objects para baseURL e Fixtures

## Visão Geral

Refatorar a configuração e os page objects para usar **baseURL** (um único ponto de configuração da URL base) e **fixtures** (dados de teste centralizados), mantendo a suíte E2E passando. Desenvolvimento por etapas: config e fixtures → LoginPage → ProductsPage → CartPage → validação final.

**Objetivos:** RF1 baseURL em um ponto; RF2 navegação relativa nos page objects; RF3 credenciais e checkout via fixtures; RF4 suíte passando sem regressão.

## Estratégia de Implementação

- **Ordem:** Configuração (baseURL + fixtures) primeiro; em seguida refatorar page objects na ordem LoginPage → ProductsPage → CartPage (dependência de uso).
- **Validação:** Após cada refatoração, rodar os testes afetados (login.spec, products.spec, cart.checkout.spec) e, ao final, a suíte completa. Nenhum teste novo; critério de sucesso é a suíte existente verde.
- **Dependências:** LoginPage não depende de outros page objects; Products e Cart usam fluxo de login, então refatorar LoginPage primeiro.

---

## Fase 1: Configuração

Objetivo: Definir baseURL e criar o módulo de fixtures com os valores atuais (comportamento preservado).

- [x] T001 [P] Criar /home/elen/SwagLabs-playwright/support/fixtures.ts exportando credenciais (válido: standard_user, secret_sauce; inválido: standard_user, pwd) e checkoutData (firstName: Elen, lastName: Crozara, postalCode: 38400644), conforme plan.md (Modelo de Dados).

- [x] T002 Definir baseURL em /home/elen/SwagLabs-playwright/playwright.config.ts: em `use`, adicionar `baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/v1'` (ou equivalente), removendo ou substituindo o comentário atual de baseURL.

---

## Fase 2: Refatorar LoginPage (US1)

Objetivo: LoginPage usa rotas relativas e credenciais do módulo de fixtures; testes de login continuam passando.

- [x] T003 [US1] Refatorar /home/elen/SwagLabs-playwright/support/login.index.ts: substituir todas as URLs completas por rotas relativas (ex.: `/index.html` em goto e gotoLogin); importar credenciais de /home/elen/SwagLabs-playwright/support/fixtures.ts e usar em login() e loginError(); substituir assertions de URL por regex (ex.: toMatch(/\/index\.html|saucedemo\.com\/?$/)) conforme plan.md (D5).

- [x] T004 [US1] Rodar tests de login em /home/elen/SwagLabs-playwright: `npx playwright test tests/login.spec.ts`; corrigir falhas até todos passarem.

---

## Fase 3: Refatorar ProductsPage (US2)

Objetivo: ProductsPage usa rotas relativas e credenciais das fixtures no método login(); testes de produtos continuam passando.

- [x] T005 [US2] Refatorar /home/elen/SwagLabs-playwright/support/products.index.ts: em login(), usar page.goto('/index.html') (ou rota relativa equivalente) e credenciais importadas de /home/elen/SwagLabs-playwright/support/fixtures.ts; remover URLs completas e literais de usuário/senha.

- [x] T006 [US2] Rodar tests de produtos em /home/elen/SwagLabs-playwright: `npx playwright test tests/products.spec.ts`; corrigir falhas até passarem.

---

## Fase 4: Refatorar CartPage (US3)

Objetivo: CartPage usa rotas relativas em todos os métodos, credenciais e checkoutData das fixtures; testes de carrinho/checkout continuam passando.

- [x] T007 [US3] Refatorar /home/elen/SwagLabs-playwright/support/cart.index.ts: substituir todas as URLs completas (goto e waitForURL) por rotas relativas (ex.: /index.html, /inventory.html, /cart.html, /checkout-step-one.html, /checkout-step-two.html, /checkout-complete.html, /inventory-item.html?id=4 etc.); usar credenciais e checkoutData de /home/elen/SwagLabs-playwright/support/fixtures.ts em login(), checkout() e novoCheckout(); assertions de URL com regex conforme plan.md (D5).

- [x] T008 [US3] Rodar tests de carrinho em /home/elen/SwagLabs-playwright: `npx playwright test tests/cart.checkout.spec.ts`; corrigir falhas até passarem.

---

## Fase 5: Validação e Polimento

Objetivo: Suíte completa verde e confirmação de que baseURL e dados estão em um único ponto.

- [x] T009 Executar suíte completa em /home/elen/SwagLabs-playwright: `npm run test`; garantir que todos os testes (login, products, cart) passam (cenário V1).

- [x] T010 Inspeção em /home/elen/SwagLabs-playwright/support/: confirmar que login.index.ts, products.index.ts e cart.index.ts não contêm URLs completas (https://www.saucedemo.com) nem credenciais/dados de checkout hardcoded; apenas rotas relativas e import de fixtures (cenários V2 e V3).

---

## Dependências entre fases

```
Fase 1 (Config: baseURL + fixtures)
    ↓
Fase 2 (LoginPage)  →  T003 → T004
    ↓
Fase 3 (ProductsPage)  →  T005 → T006
    ↓
Fase 4 (CartPage)  →  T007 → T008
    ↓
Fase 5 (Validação)  →  T009 → T010
```

**Ordem de conclusão:** Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5.

---

## Execução paralela

- **T001** e **T002** (Fase 1) podem ser feitas em paralelo (fixtures e config são independentes).
- Dentro de cada fase, implementação (T003, T005, T007) deve ser concluída antes da validação (T004, T006, T008).

---

## Resumo

| Métrica | Valor |
|--------|--------|
| Total de tarefas | 10 |
| Por fase | Config: 2; LoginPage: 2; ProductsPage: 2; CartPage: 2; Validação: 2 |
| Tarefas paralelizáveis | T001 [P], T002 (T001 e T002 entre si na Fase 1) |
| Critérios de sucesso | Suíte passa (V1); baseURL única (V2); dados em fixtures (V3) |
| Escopo MVP | T001–T010 concluídos: baseURL ativa, fixtures criadas, todos os page objects refatorados, suíte verde |

**Validação de formato:** Todas as tarefas seguem o checklist `- [ ] [TaskID] [P?] [Story?] Descrição com caminho do arquivo`.
