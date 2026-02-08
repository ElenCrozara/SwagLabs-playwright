# Stack tecnológico

## Runtime e linguagem

- **Node.js** – ambiente de execução (versão implícita via `package.json` e lockfile)
- **TypeScript** – linguagem principal do código (^5.4.5)

## Testes e automação

- **@playwright/test** (^1.36.1) – framework de testes E2E e automação de browser
- **Playwright** – drivers para Chromium (ativo); Firefox e WebKit configuráveis no `playwright.config.ts`

## Qualidade de código

- **ESLint** – lint (^8.49.0)
  - **@typescript-eslint/parser** e **@typescript-eslint/eslint-plugin** (^6.7.0)
  - **eslint-plugin-playwright** (^0.16.0) – regras específicas para Playwright
- **Prettier** (^3.1.0) – formatação (configuração não explícita na raiz; pode estar em defaults)

## Relatórios

- **allure-playwright** (^3.2.0) – reporter Allure para Playwright
- **allure-commandline** (^2.32.2) – geração de relatórios Allure (dev)

## Tipagem e build

- **@types/node** (^18.18.1) – tipagem Node.js

## Observações

- Não há bundler (Webpack/Vite/etc.) no projeto: é um projeto de testes, não de build do app.
- Não há `tsconfig.json` na raiz; TypeScript é usado via configuração do Playwright e ESLint.
- A aplicação sob teste (Sauce Demo) é externa; não há servidor próprio no repositório.
