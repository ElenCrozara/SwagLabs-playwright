# Especificação: Refatorar Page Objects para Usar baseURL e Fixtures

## Nome da Funcionalidade

Refatorar os page objects e a configuração dos testes E2E para usar **baseURL** (URL base configurável em um único ponto) e **fixtures** (dados de teste reutilizáveis), em vez de URLs e credenciais hardcoded espalhados pelo código.

## Descrição

Hoje a suíte de testes E2E do Swag Labs utiliza URLs completas e dados de teste (credenciais, dados de checkout) fixos dentro dos page objects. Esta funcionalidade visa:

1. **baseURL:** Definir a URL base da aplicação sob teste em um único lugar (ex.: configuração do Playwright ou variável de ambiente), e fazer os page objects e testes usarem rotas relativas a essa base. Assim, trocar de ambiente (ex.: v1, staging, local) exige alteração em um só ponto.

2. **Fixtures:** Centralizar dados de teste reutilizáveis (credenciais de login válido e inválido, dados de checkout como nome, sobrenome e CEP) em uma camada de fixtures (ex.: arquivo de fixtures, ou `test.extend()` do Playwright), em vez de repeti-los em cada page object. Isso facilita manutenção e futura troca por variáveis de ambiente ou arquivos por ambiente.

O foco é em **valor para quem mantém os testes**: menos duplicação, mudança de ambiente ou dados em um único lugar, e comportamento dos testes preservado.

## Problema/Necessidade

- **Situação atual:** URLs como `https://www.saucedemo.com/v1/index.html` e rotas completas estão repetidas em LoginPage, ProductsPage e CartPage. Credenciais (`standard_user`, `secret_sauce`) e dados de checkout (nome, sobrenome, CEP) estão hardcoded nos métodos dos page objects.
- **Consequências:** Para rodar contra outro ambiente ou alterar credenciais/dados, é necessário editar vários arquivos; risco de inconsistência e erro humano.
- **Necessidade:** Poder configurar URL base e dados de teste em um único ponto (ou poucos pontos), mantendo a suíte estável e os testes passando.

## Referência ao Legado

Esta especificação referencia o estado atual do sistema para garantir consistência:

### Tipo de Especificação

- [ ] Funcionalidade completa nova (não existe no legado)
- [x] Atualização/incremento sobre funcionalidade existente
- [ ] Combinação (nova funcionalidade que integra com existente)

### Funcionalidades Relacionadas Existentes (se aplicável)

- **support/login.index.ts** – LoginPage: goto com URL completa, credenciais hardcoded em `login()` e `loginError()`.
- **support/products.index.ts** – ProductsPage: método `login()` com URL e credenciais hardcoded.
- **support/cart.index.ts** – CartPage: método `login()` com URL e credenciais; dados de checkout (nome, sobrenome, CEP) hardcoded em `checkout()` e `novoCheckout()`.
- **playwright.config.ts** – baseURL comentada; não há uso de variáveis de ambiente para URL ou dados.
- **tests/** – specs que instanciam page objects e dependem do comportamento atual (login, produtos, carrinho).

### Impacto nas Partes Existentes (se aplicável)

- **playwright.config.ts:** passará a definir `baseURL` (valor padrão ou a partir de variável de ambiente).
- **support/login.index.ts, support/products.index.ts, support/cart.index.ts:** passarão a usar navegação relativa à baseURL (ex.: `page.goto('/')` ou `page.goto('/index.html')`) e a receber credenciais/dados via parâmetros ou fixtures, em vez de valores fixos no código.
- **tests/** (login, products, cart): poderão usar fixtures para injetar dados nos page objects ou continuar instanciando os page objects com a página; a suíte deve continuar passando após a refatoração.

### Integração com Legado

- Manter **Page Object Model (POM):** ações continuam nos page objects; apenas a origem da URL e dos dados muda.
- Manter convenções de arquivos (`*.index.ts`, `*.spec.ts`) e de nomenclatura (camelCase, sufixo Page).
- A refatoração não deve alterar o comportamento observável dos testes: mesmos fluxos (login, listagem, carrinho, checkout, logout, recuperação), com mesma cobertura.

## Cenários de Usuário e Testes

### Quem mantém os testes (dev/QA)

| Cenário | Pré-condição | Ação | Resultado esperado |
|--------|----------------|------|--------------------|
| Trocar ambiente (URL base) | Projeto com baseURL configurada | Alterar baseURL na config (ou variável de ambiente) para outro ambiente (ex.: staging) | Todos os testes que dependem da URL base rodam contra o novo ambiente sem editar page objects |
| Trocar credenciais ou dados de checkout | Projeto com fixtures para credenciais e dados de checkout | Alterar valores nas fixtures (ou arquivo/env) | Testes que usam esses dados passam a usar os novos valores sem editar métodos dos page objects |
| Rodar suíte após refatoração | Refatoração concluída | Executar a suíte completa (login, products, cart) | Todos os testes passam como antes; nenhum fluxo quebrado |

### Critérios de aceitação (testáveis)

- A suíte atual (login, products, cart e quaisquer specs existentes) continua passando após a refatoração.
- A URL base da aplicação sob teste é definida em um único ponto (config ou env).
- Credenciais de login e dados de checkout (nome, sobrenome, CEP) vêm de um único ponto (fixtures ou config), não hardcoded em cada page object.

## Requisitos Funcionais

- **RF1 – baseURL:** Existir um único ponto de configuração para a URL base da aplicação (ex.: `baseURL` no `playwright.config.ts` ou variável de ambiente). Page objects e testes devem usar essa base para navegação (rotas relativas ou construção de URL a partir da base).
- **RF2 – Navegação relativa:** Os page objects (LoginPage, ProductsPage, CartPage) não devem mais conter URLs completas hardcoded para a aplicação sob teste; devem usar a base configurada (ex.: `page.goto('/')`, `page.goto('/index.html')`, ou equivalente).
- **RF3 – Fixtures para dados de teste:** Credenciais de login (usuário e senha válidos e inválidos) e dados de checkout (nome, sobrenome, CEP) devem ser fornecidos por uma camada de fixtures (ex.: `test.extend()` com fixtures, ou arquivo de dados importado), consumida pelos page objects ou pelos testes, em vez de valores fixos dentro dos métodos.
- **RF4 – Comportamento preservado:** Após a refatoração, todos os testes E2E existentes devem continuar passando, sem alteração de cenários ou critérios de aceitação funcionais.

Todos os requisitos são testáveis: execução da suíte e inspeção de que não há URLs completas nem dados repetidos nos page objects.

## Critérios de Sucesso

- A URL base é configurável em um único ponto; alterá-la não exige editar múltiplos arquivos.
- Credenciais e dados de checkout são configuráveis em um único ponto (fixtures ou equivalente); alterá-los não exige editar cada page object.
- A suíte E2E completa executa e todos os testes passam após a refatoração.
- Não há regressão funcional: os mesmos fluxos (login, logout, produtos, carrinho, checkout, recuperação) permanecem cobertos e passando.

## Entidades Principais

- **Configuração da URL base:** valor único que define o host/path base da aplicação sob teste (ex.: `https://www.saucedemo.com/v1`).
- **Fixtures de dados:** conjunto reutilizável de dados de teste (credenciais de login válido/inválido, dados de checkout) consumido pelos page objects ou pelos specs.
- **Page objects:** continuam representando páginas/fluxos; passam a depender da baseURL (do contexto do teste ou da config) e das fixtures (ou parâmetros) para dados.

## Suposições

- A aplicação sob teste (Sauce Demo) continua acessível pela mesma estrutura de rotas (index, inventory, cart, checkout); apenas a origem da URL base muda (config/env).
- As fixtures podem ser implementadas com o mecanismo de fixtures do Playwright (`test.extend()`) ou com um módulo/arquivo de dados importado pelos page objects ou pelos testes; a escolha técnica fica para o plano.
- Não é obrigatório suportar múltiplos ambientes em paralelo na mesma execução; basta que trocar a configuração (baseURL e/ou fixtures) permita rodar contra outro ambiente sem editar vários arquivos.

## Restrições

- Não alterar o comportamento da aplicação sob teste; apenas a forma como os testes obtêm URL e dados.
- Manter compatibilidade com a execução atual (local e CI); a suíte deve continuar executável com `npm run test` (ou equivalente).
- Não expor dados sensíveis reais; fixtures ou env devem usar dados de teste (ex.: credenciais de demonstração já utilizadas).

---

## Checklist de Validação

### Qualidade do Conteúdo

- [x] Especificação focada em valor (manutenção, configuração em um ponto) e em requisitos testáveis, sem detalhes de implementação (código, estrutura de arquivos específica).
- [x] Linguagem acessível a partes interessadas; detalhes técnicos restritos ao necessário para integração com o legado.

### Completude dos Requisitos

- [x] Requisitos funcionais testáveis (RF1–RF4); cenários descritos com pré-condição, ação e resultado esperado.
- [x] Critérios de sucesso mensuráveis (configuração única, suíte passando, sem regressão).

### Prontidão da Funcionalidade

- [x] Requisitos com critérios de aceitação claros (baseURL em um ponto, fixtures para dados, testes passando).
- [x] Referência ao legado preenchida (tipo de spec, funcionalidades relacionadas, impacto, integração).
