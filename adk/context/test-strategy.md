# Estratégia de testes

## Objetivo

Testes E2E contra a aplicação Sauce Demo (Swag Labs), cobrindo login, listagem de produtos, carrinho e checkout, com foco em fluxos de usuário e regressão de UI.

## Organização dos specs

- **login.spec.ts:** login com sucesso e login com credenciais inválidas (dois testes; usam `page` injetada por teste).
- **products.spec.ts:** nomes dos produtos começando com “Sauce Labs” e quantidade de itens no inventário (6); usa **test.beforeAll** para um único context/página compartilhada.
- **cart.checkout.spec.ts:** fluxo completo do carrinho (adicionar, checkout, pagamento) e fluxo adicionar/remover produtos e novo checkout; usa **test.beforeAll** e **CartPage**.

## Padrões de escrita

- **Page Object Model:** ações e assertions encapsuladas em classes em `support/*.index.ts`; specs ficam enxutos (instanciar page object e chamar métodos).
- **Compartilhamento de estado:** onde o fluxo é longo (products, cart), um login é feito uma vez em `beforeAll` e a mesma `page` é reutilizada; login.spec usa uma `page` por teste.
- **Viewport:** `test.use({ viewport: { width: 1920, height: 1080 } })` em describes para consistência.
- **Expect:** assertions tanto nos page objects quanto nos specs; em fluxos sem assert explícito usa-se `// eslint-disable-next-line playwright/expect-expect`.

## Cobertura atual (fluxos)

- Login: sucesso e erro de credencial.
- Produtos: validação de nomes e quantidade.
- Carrinho: fluxo completo (produto → carrinho → checkout → pagamento → fim) e fluxo com “continue shopping”, remoção de item e segundo checkout.

## Framework e runtime

- **Runner:** @playwright/test.
- **Browser:** Chromium (configuração atual).
- **Relatório:** Allure (`allure-playwright`); resultados em `allure-results/`, relatório em `allure-report/` (gitignored).
- **CI:** retries 2, workers 1, forbidOnly ativo quando `CI` está definido.

## Observações

- **products.spec.ts** contém `test.fail()` em um dos testes (comportamento esperado de falha ou teste em ajuste).
- Não há testes unitários nem de integração de API no repositório; apenas E2E de UI.
