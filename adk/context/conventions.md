# Convenções e padrões

## Nomenclatura de arquivos

- **Support (page objects):** `*.index.ts` – ex.: `login.index.ts`, `products.index.ts`, `cart.index.ts`.
- **Specs:** `*.spec.ts` – ex.: `login.spec.ts`, `products.spec.ts`, `cart.checkout.spec.ts`.
- Nomes descritivos por domínio: `cart.checkout` para fluxo de carrinho/checkout.

## Nomenclatura de classes e tipos

- **Page Objects:** sufixo `Page`, em PascalCase – `LoginPage`, `ProductsPage`, `CartPage`.
- **Métodos:** camelCase, verbos ou ações – `login()`, `loginError()`, `verificationProduct()`, `accessingCart()`, `checkout()`, `continueShopping()`, `removeProductCart()`.

## Estrutura de classes (Page Object)

- Propriedade `readonly page: Page` (tipo `Page` do `@playwright/test`).
- Construtor recebe `page: Page` (em `login.index.ts` o parâmetro está sem tipo explícito; demais com `Page`).
- Métodos são `async` e encapsulam sequências de ações (e, quando cabível, `expect`).

## Estilo de código (ESLint)

- **no-multi-spaces:** erro (evitar múltiplos espaços).
- **no-multiple-empty-lines:** máximo 1 linha vazia consecutiva.
- Parser TypeScript; extends: `plugin:playwright/playwright-test`, `eslint:recommended`, `plugin:@typescript-eslint/recommended`.
- Uso de `// eslint-disable-next-line playwright/expect-expect` onde o teste não usa `expect` explícito (ex.: fluxos que apenas executam ações).

## Imports

- De `@playwright/test`: `test`, `expect`, `Page` (e quando necessário `devices` no config).
- Page objects: caminho relativo a partir de specs, ex.: `from "../support/login.index"`, `from "../support/cart.index"`.

## Organização dos specs

- **test.describe** com nome descritivo em string ('login page', 'products test', 'testing cart').
- **test.use({ viewport: { width: 1920, height: 1080 } })** usado em vários describes para viewport fixo.
- Uso opcional de **test.beforeAll** para compartilhar browser context e página (products, cart); login usa a `page` injetada por teste.

## Comentários

- Comentários em português no código (ex.: “clicando no botão ADD TO CART”).
- Comentários explicativos em alguns métodos (ex.: “Localiza a classe do primeiro produto da lista e clica”).
