# Arquitetura e estrutura

## Estrutura de diretórios

```
SwagLabs-playwright/
├── adk/
│   └── context/          # Artefatos de contexto ADK (gerado por adk-analyze)
├── support/              # Page Objects e suporte aos testes
│   ├── cart.index.ts     # CartPage – carrinho e checkout
│   ├── login.index.ts    # LoginPage – login e login com erro
│   └── products.index.ts # ProductsPage – listagem e validação de produtos
├── tests/                # Especificações de teste (specs)
│   ├── cart.checkout.spec.ts
│   ├── login.spec.ts
│   └── products.spec.ts
├── .eslintrc
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── README.md
```

## Padrão arquitetural: Page Object Model (POM)

- **support/** contém classes que representam “páginas” ou fluxos da aplicação:
  - **LoginPage** – tela de login (URL index, campos user/password, botão login).
  - **ProductsPage** – listagem de produtos (verificação de nomes, inventário).
  - **CartPage** – carrinho, checkout (dados pessoais, pagamento, conclusão).
- Cada classe recebe `Page` do Playwright no construtor e expõe métodos assíncronos que encapsulam ações e, quando aplicável, assertions.
- Os **tests/** importam essas classes de `../support/*.index` e instanciam com `page` do teste.

## Fluxo de execução

1. **Playwright** carrega os projetos definidos em `playwright.config.ts` (por padrão apenas Chromium).
2. Os arquivos em **tests/** são reconhecidos como specs (`testDir: './tests'`).
3. Cada spec importa o(s) page object(s) necessário(s), cria instância com `page` e chama métodos (ex.: `login()`, `selectProduct()`, `checkout()`).
4. Alguns describes usam **test.beforeAll** para compartilhar um mesmo browser context e página (cart, products); outros usam a `page` injetada por teste (login).

## Dependências entre módulos

- **tests/*.spec.ts** → **support/*.index.ts** (dependem dos page objects).
- **support/** não depende de **tests/**; pode haver pequena duplicação de fluxo (ex.: `login()` em LoginPage, ProductsPage e CartPage) para independência dos fluxos.

## Aplicação sob teste

- **Sauce Demo** (https://www.saucedemo.com/v1/) – aplicação externa; URLs e seletores estão nos page objects (hardcoded).
- Não há mock de API ou servidor local no repositório; todos os testes são E2E contra o site real.
