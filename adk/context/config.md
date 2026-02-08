# Configurações e infraestrutura

## Playwright (`playwright.config.ts`)

- **testDir:** `./tests`
- **fullyParallel:** `true`
- **forbidOnly:** `!!process.env.CI` (falha no CI se houver `test.only`)
- **retries:** `process.env.CI ? 2 : 0`
- **workers:** `process.env.CI ? 1 : undefined` (um worker no CI)
- **reporter:** `"allure-playwright"`
- **use:**  
  - **headless:** `true`  
  - **actionTimeout:** `0`  
  - **launchOptions.slowMo:** `1000`  
  - **video:** `'off'`  
  - **screenshot:** `'only-on-failure'`  
  - **trace:** `'on-first-retry'`  
  - **viewport:** `{ width: 1920, height: 1080 }`
- **projects:** apenas `chromium` (Desktop Chrome) ativo; Firefox, WebKit e mobile comentados.
- **baseURL:** comentado (URLs usadas diretamente nos page objects).
- **webServer:** comentado (não sobe servidor local; testes contra Sauce Demo).

## Variáveis de ambiente

- **CI:** usada para retries, workers e forbidOnly; não há uso de `dotenv` ativo (comentado no config).

## ESLint (`.eslintrc`)

- **parser:** `@typescript-eslint/parser`
- **parserOptions.ecmaVersion:** 2021
- **plugins:** `@typescript-eslint`
- **env:** `es6: true`
- **extends:** `plugin:playwright/playwright-test`, `eslint:recommended`, `plugin:@typescript-eslint/recommended`
- **rules ativas:** `no-multi-spaces`, `no-multiple-empty-lines` (max 1)

## Git (`.gitignore`)

- `node_modules/`
- `test-results/`
- `playwright-report/`
- `playwright/.cache/`
- `allure-results/`
- `allure-report/`

## Scripts (package.json)

- **test:** `npx playwright test`
- **ui:** `npx playwright test --ui`
- **debug:** `npx playwright test --debug`

## Infraestrutura

- Não há Docker, Kubernetes ou pipelines no repositório; CI é inferido apenas por `process.env.CI`.
- Não há arquivo de ambiente (`.env`) versionado; credenciais de teste estão hardcoded nos page objects.
