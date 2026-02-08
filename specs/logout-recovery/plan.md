# Plano técnico: Testes de Logout e Recuperação de Senha

## 1. Decisões Técnicas e Pesquisa

### D1 – Localização do logout na Sauce Demo (v1)

- **Decisão:** Usar o menu lateral (hamburger) da aplicação para acionar logout. Na Sauce Demo v1, o botão de menu (ícone “três linhas”) abre um drawer com a opção “Logout”; o teste deve clicar no botão do menu, aguardar o drawer e clicar em “Logout”.
- **Racional:** Comportamento padrão da aplicação sob teste; não há botão de logout na barra principal sem abrir o menu.
- **Alternativas consideradas:** Buscar por botão/link fixo de logout na página (não existe na UI atual); usar teclado (não é o fluxo do usuário).

### D2 – Seletores para logout

- **Decisão:** Preferir `getByRole('button', { name: ... })` para o botão do menu e `getByRole('link', { name: 'Logout' })` ou `getByText('Logout')` para o item de logout, conforme o DOM real. Se a aplicação usar IDs/classes estáveis, documentar no page object.
- **Racional:** Alinhado a `adk/context/api-patterns.md` (uso de getByRole/getByText); reduz acoplamento a classes CSS.
- **Alternativas consideradas:** Seletores apenas por ID/classe (mais frágeis se a aplicação mudar estrutura).

### D3 – Ponto de partida do fluxo de logout

- **Decisão:** Executar logout a partir da página de inventário (`inventory.html`), após login. Reutilizar `LoginPage.login()` para chegar ao estado autenticado e, em seguida, acionar o menu e logout.
- **Racional:** Consistente com o fluxo real do usuário e com os testes atuais (login já leva ao inventory); evita depender de outras páginas (carrinho, etc.).

### D4 – Recuperação de senha na Sauce Demo (v1)

- **Decisão:** Na implementação, validar na tela de login a presença do link “Forgot your password?” (ou texto equivalente). O teste deve: (1) ir à tela de login; (2) clicar no link de recuperação; (3) validar que a aplicação responde (ex.: mensagem de erro de usuário bloqueado, ou tela/mensagem específica). O comportamento exato (mensagem, URL) será definido conforme o que a aplicação exibir.
- **Racional:** A spec (RF3/RF4) exige que o teste reflita o comportamento real; a Sauce Demo pode exibir mensagem fixa em vez de fluxo completo de recuperação.
- **Alternativas consideradas:** Assumir fluxo completo de “esqueci senha” com e-mail (pode não existir na demo); ignorar recuperação (contraria a spec).

### D5 – Onde colocar métodos de logout e recuperação

- **Decisão:** Estender `LoginPage` em `support/login.index.ts` com métodos `logout()` (ou `openMenuAndLogout()`) e `clickRecoveryLink()` (ou `openPasswordRecovery()`). O método de logout pode receber a página já autenticada (fluxo: login → inventário → logout); para isso, o método pode ser chamado a partir da página de inventário, então pode ser mais coerente ter um método no LoginPage que “faz logout a partir da página atual” (que deve estar autenticada).
- **Racional:** Logout e recuperação são fluxos ligados à autenticação; LoginPage já concentra login e loginError; manter um único page object para “autenticação” evita novo arquivo sem necessidade.
- **Alternativas consideradas:** Criar `support/logout.index.ts` (nova classe só para logout) – rejeitado para manter simplicidade; manter apenas em specs sem page object – rejeitado pois quebra POM.

### D6 – Organização dos arquivos de spec

- **Decisão:** Incluir os novos testes em `tests/login.spec.ts` dentro do describe existente “login page”, ou em um novo describe no mesmo arquivo (ex.: “logout” e “password recovery”). Não criar `logout.spec.ts` nem `login.recovery.spec.ts` por enquanto, para evitar proliferação de arquivos e manter login/logout/recuperação no mesmo contexto.
- **Racional:** Spec atual já agrupa cenários de login; logout e recuperação são extensão natural. Caso o arquivo fique grande no futuro, pode-se separar em `login.logout.spec.ts` e `login.recovery.spec.ts` seguindo o padrão `cart.checkout.spec.ts`.
- **Alternativas consideradas:** Um arquivo por fluxo (logout.spec.ts, recovery.spec.ts) – aceitável, mas preferência por agrupar em login.spec.ts inicialmente.

---

## 2. Base Técnica do Legado (Referência)

Contexto extraído de `adk/context/` (análise de 2025-02-08).

### Stack

- **Runtime:** Node.js  
- **Linguagem:** TypeScript (^5.4.5)  
- **Testes:** @playwright/test (^1.36.1), Chromium  
- **Qualidade:** ESLint (typescript-eslint, eslint-plugin-playwright), Prettier  
- **Relatório:** allure-playwright  

### Arquitetura

- **Estrutura:** `support/*.index.ts` (page objects), `tests/*.spec.ts` (specs).  
- **Padrão:** Page Object Model (POM); cada classe recebe `Page` no construtor e expõe métodos async.  
- **Aplicação sob teste:** Sauce Demo (https://www.saucedemo.com/v1/), externa; URLs hardcoded nos page objects.  

### Convenções

- **Arquivos:** `*.index.ts` (support), `*.spec.ts` (tests); métodos em camelCase; classes com sufixo `Page`.  
- **Código:** `readonly page: Page`; construtor `(page: Page)`; preferência por getByRole/getByText quando aplicável; `test.use({ viewport: { width: 1920, height: 1080 } })`.  
- **ESLint:** no-multi-spaces, no-multiple-empty-lines; `// eslint-disable-next-line playwright/expect-expect` quando o teste não tiver expect explícito.  

### O que será reutilizado

- `support/login.index.ts` e `tests/login.spec.ts` (estendidos, não substituídos).  
- Credenciais e URLs atuais (standard_user, secret_sauce, https://www.saucedemo.com/v1/).  
- Padrões de locators, ações (click, fill, waitForURL) e assertions (expect url, expect visible).  

### O que será modificado

- **LoginPage:** adição de métodos para logout e para acionar recuperação de senha.  
- **login.spec.ts:** adição de casos de teste para logout (com sucesso, logout + novo login) e recuperação de senha.  

### O que será adicionado

- Novos métodos no LoginPage; novos testes no describe de login (ou sub-describes). Nenhum novo arquivo de support ou de spec obrigatório.

---

## 3. Modelo de Dados

O escopo é apenas testes E2E de UI; não há persistência nem API própria. Os “dados” relevantes são o estado da sessão e as credenciais já usadas no projeto.

| Entidade / Conceito | Uso no plano |
|--------------------|--------------|
| **Sessão autenticada** | Estado após `login()`: URL inventory, menu visível; ao acionar logout, sessão encerrada e URL volta para index (login). |
| **Credenciais** | Reutilizar `standard_user` / `secret_sauce` para login e “logout + novo login”; nenhum dado novo. |
| **Tela de login** | Estado inicial para recuperação de senha; estado final após logout. Identificação por URL `index.html` e presença de `#user-name`, `#password`, `#login-button`. |

Sem modelo de dados persistido; sem contratos de API REST (a aplicação sob teste é externa).

---

## 4. Contratos de API / Fluxos UI

Não há APIs REST no projeto; os “contratos” são os comportamentos esperados da UI da Sauce Demo, validados pelos testes.

### Fluxo: Logout

1. **Pré-condição:** Usuário na página de inventário (autenticado).  
2. **Ação:** Clicar no botão do menu (hamburger); clicar em “Logout” no menu.  
3. **Pós-condição:** URL corresponde à tela de login (`index.html` ou equivalente); elementos da tela de login visíveis (ex.: campo user-name ou botão de login).

### Fluxo: Logout + novo login

1. **Pré-condição:** Usuário fez logout (está na tela de login).  
2. **Ação:** Preencher user/password com credenciais válidas e submeter.  
3. **Pós-condição:** URL corresponde à área autenticada (ex.: inventory); elemento característico visível (ex.: “Products”).

### Fluxo: Recuperação de senha

1. **Pré-condição:** Usuário na tela de login.  
2. **Ação:** Clicar no link “Forgot your password?” (ou texto equivalente).  
3. **Pós-condição:** A aplicação responde de forma verificável (mensagem, nova tela ou estado); sem erro não tratado na UI. O assertion exato será definido na implementação conforme o comportamento real da Sauce Demo.

---

## 5. Estratégia de Testes

Alinhada a `adk/context/test-strategy.md`: apenas testes E2E de UI; TDD (testes antes da implementação).

### Abordagem

- **Testes primeiro (TDD):** Escrever ou esboçar os casos de teste em `login.spec.ts` (podem falhar inicialmente por falta de métodos no LoginPage); em seguida implementar os métodos em `support/login.index.ts` até os testes passarem.  
- **Framework:** @playwright/test; runner e reporter atuais (Allure) mantidos.  
- **Page Object:** Toda ação e assertion reutilizável ficam em LoginPage; specs apenas instanciam e chamam métodos.  
- **Compartilhamento de estado:** Para “logout” e “logout + novo login”, usar a `page` injetada por teste (como nos testes de login atuais), sem beforeAll: cada teste faz login → logout (ou logout → login) na mesma página.  
- **Recuperação de senha:** Um teste que vai à tela de login, clica no link de recuperação e valida a resposta da aplicação (mensagem ou estado).  
- **Viewport:** Manter `test.use({ viewport: { width: 1920, height: 1080 } })` no describe (ou no arquivo), conforme convenção.  
- **Cobertura:** Nenhum teste unitário de serviço/API (não aplicável); cobertura por fluxos E2E descritos na spec (RF1–RF4).  
- **Dados:** Sem fixtures novas; credenciais e URLs já existentes nos page objects.  
- **Ambiente:** Mesmo ambiente (Sauce Demo v1) e mesma config (playwright.config.ts).  

### Ordem de implementação (TDD)

1. **Red:** Adicionar testes em `login.spec.ts` para logout com sucesso, logout + novo login e recuperação de senha (podem falhar).  
2. **Green:** Implementar em `LoginPage` os métodos necessários (ex.: abrir menu e logout; clicar em recuperação de senha) e ajustar assertions até os testes passarem.  
3. **Refactor:** Extrair duplicações, melhorar nomes e comentários; manter expect nos page objects ou nos specs conforme convenção do projeto.  

---

## 6. Cenários de Teste

Cenários mapeados da spec para implementação.

### Logout

| ID   | Cenário              | Pré-condição              | Ações (alto nível)                          | Resultado esperado (assertion)                    |
|------|----------------------|---------------------------|---------------------------------------------|---------------------------------------------------|
| T1   | Logout com sucesso   | Página de inventário (após login) | Login → abrir menu → clicar Logout          | URL de login; elemento da tela de login visível  |
| T2   | Logout e novo login  | Após logout (tela de login) | Preencher credenciais válidas e submeter    | URL de inventário; “Products” (ou equivalente) visível |

### Recuperação de senha

| ID   | Cenário                    | Pré-condição   | Ações (alto nível)              | Resultado esperado (assertion)                    |
|------|----------------------------|----------------|---------------------------------|---------------------------------------------------|
| T3   | Acesso ao fluxo recuperação| Tela de login  | Ir à login → clicar “Forgot your password?” | Resposta da aplicação verificável (mensagem/tela/estado); sem erro não tratado |

Implementação deve alinhar os assertions de T3 ao comportamento real da Sauce Demo (ex.: mensagem de usuário bloqueado ou texto fixo).

---

## 7. Resumo de Implementação

| Item | Decisão |
|------|---------|
| **Arquivos a alterar** | `support/login.index.ts`, `tests/login.spec.ts` |
| **Novos métodos (LoginPage)** | Método para logout (abrir menu + clicar Logout); método para clicar no link de recuperação de senha. |
| **Novos testes** | Pelo menos 3: logout com sucesso (T1), logout + novo login (T2), recuperação de senha (T3). |
| **Seletores** | Preferir getByRole/getByText; menu e “Logout” conforme DOM da Sauce Demo v1. |
| **TDD** | Testes primeiro; depois implementação no LoginPage até passar. |
