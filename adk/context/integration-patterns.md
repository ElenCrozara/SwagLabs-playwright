# Padrões de integração

## Integração com a aplicação sob teste

- **Sauce Demo (Swag Labs):** aplicação externa em `https://www.saucedemo.com/v1/`.
- Sem mock ou stub: testes rodam contra o site real; dependem de disponibilidade e estabilidade do ambiente externo.
- Sem `webServer` no Playwright: não há subida de servidor local; todos os `goto` usam URL completa nos page objects.

## Reporter e relatórios

- **Allure:** reporter principal (`reporter: "allure-playwright"`).
- Artefatos em `allure-results/`; relatório gerado com Allure CLI em `allure-report/` (ambos no `.gitignore`).
- Integração típica: após `npm run test`, executar Allure para gerar HTML a partir de `allure-results/`.

## CI (inferido)

- Uso de `process.env.CI` no `playwright.config.ts` para:
  - **retries:** 2 em CI, 0 local.
  - **workers:** 1 em CI, undefined (paralelismo padrão) local.
  - **forbidOnly:** true em CI.
- Não há arquivos de pipeline (GitHub Actions, GitLab CI, etc.) no repositório; padrões são compatíveis com CI que defina `CI` e execute `npm run test`.

## Dependências externas

- **npm:** instalação de dependências e execução de scripts.
- **Node.js:** runtime para Playwright e TypeScript.
- **Browser Chromium:** baixado pelo Playwright na primeira execução.
- Nenhuma API interna ou serviço próprio; integração é apenas com o browser e o site Sauce Demo.

## Possíveis extensões

- **baseURL** no config + rotas relativas nos page objects para facilitar troca de ambiente.
- **Variáveis de ambiente** para URL base e credenciais (substituindo hardcode).
- **webServer** opcional para uma versão local do app, se no futuro o código do Sauce Demo for hospedado no repo.
