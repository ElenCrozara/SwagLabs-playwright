# Especificação: Testes de Logout e Recuperação de Senha

## Nome da Funcionalidade

Adicionar testes E2E para os fluxos de **logout** e **recuperação de senha** na aplicação Sauce Demo (Swag Labs), garantindo cobertura automatizada dessas jornadas do usuário.

## Descrição

Estender a suíte de testes E2E existente para cobrir:

1. **Logout:** o usuário autenticado consegue encerrar a sessão e voltar à tela de login de forma consistente (menu, botão ou link de logout).
2. **Recuperação de senha:** o usuário na tela de login consegue acionar a opção de recuperação de senha e receber feedback adequado (mensagem, tela ou redirecionamento conforme o comportamento da aplicação).

O foco é em **valor de negócio**: garantir que essas funcionalidades da aplicação sob teste continuem funcionando após mudanças, através de testes automatizados.

## Problema/Necessidade

- **Cobertura atual:** os testes cobrem login com sucesso, login com erro de credencial, listagem de produtos e fluxos de carrinho/checkout. Não há testes para logout nem para recuperação de senha.
- **Risco:** regressões nesses fluxos passam despercebidas.
- **Necessidade:** incluir logout e recuperação de senha na suíte E2E para aumentar confiança e documentar o comportamento esperado dessas jornadas.

## Referência ao Legado

Esta especificação referencia o estado atual do sistema para garantir consistência:

### Tipo de Especificação

- [ ] Funcionalidade completa nova (não existe no legado)
- [x] Atualização/incremento sobre funcionalidade existente
- [ ] Combinação (nova funcionalidade que integra com existente)

### Funcionalidades Relacionadas Existentes (se aplicável)

- **Login:** `support/login.index.ts` (LoginPage), `tests/login.spec.ts` – login com sucesso e login com credenciais inválidas.
- **Autenticação:** credenciais e fluxo de login já utilizados em ProductsPage e CartPage (método `login()`).

### Impacto nas Partes Existentes (se aplicável)

- **LoginPage:** pode ganhar novos métodos ou extensões para logout e para acessar o fluxo de recuperação de senha a partir da tela de login.
- **login.spec.ts (ou novo spec):** novos casos de teste; organização pode permanecer em `login.spec.ts` ou ser separada conforme convenção do projeto (ex.: `logout.spec.ts`, `login.recovery.spec.ts`).
- Nenhuma alteração obrigatória em produtos ou carrinho; logout é acionado após login/inventário.

### Integração com Legado

- Seguir **Page Object Model (POM):** ações e assertions em classes em `support/*.index.ts`, specs enxutos.
- Manter convenções: arquivos `*.index.ts` para page objects, `*.spec.ts` para specs; métodos em camelCase; viewport 1920x1080 quando usado no projeto.
- Reutilizar padrões de locators e assertions (IDs, getByRole/getByText, expect de URL e visibilidade) conforme `adk/context/api-patterns.md`.
- Logout: fluxo típico login → inventário (ou outra área autenticada) → acionar logout → validar retorno à tela de login (URL e/ou elementos visíveis).
- Recuperação de senha: fluxo a partir da tela de login (link/botão “Forgot password” ou equivalente) → validar comportamento da aplicação (mensagem, nova tela ou estado).

## Cenários de Usuário e Testes

### Logout

| Cenário | Pré-condição | Ação | Resultado esperado |
|--------|----------------|------|--------------------|
| Logout com sucesso | Usuário autenticado na aplicação (ex.: na listagem de produtos) | Usuário aciona a opção de logout (menu, botão ou link) | Usuário é redirecionado para a tela de login; sessão encerrada (não é possível acessar áreas restritas sem novo login) |
| Logout e novo login | Usuário fez logout | Usuário faz login novamente com credenciais válidas | Login é bem-sucedido e usuário acessa a área autenticada |

### Recuperação de senha

| Cenário | Pré-condição | Ação | Resultado esperado |
|--------|----------------|------|--------------------|
| Acesso ao fluxo de recuperação | Usuário na tela de login | Usuário aciona o link/opção de recuperação de senha (ex.: “Forgot your password?”) | A aplicação exibe o fluxo de recuperação (mensagem, tela ou redirecionamento conforme implementação da Sauce Demo) |
| Comportamento após acionar recuperação | Usuário acionou recuperação | — | O resultado é verificável (ex.: mensagem de confirmação, campo de e-mail, ou retorno à login com mensagem); sem erro não tratado na UI |

*Nota:* O comportamento exato da recuperação de senha na Sauce Demo (mensagem fixa, tela própria ou link externo) será validado na implementação; os testes devem refletir o comportamento real da aplicação.

## Requisitos Funcionais

- **RF1 – Logout:** Existir teste(s) que validem que, a partir de um usuário autenticado, o acionamento do logout leva o usuário de volta à tela de login (URL e/ou elementos da tela de login visíveis).
- **RF2 – Logout e novo login:** Existir teste que valide que, após logout, um novo login com credenciais válidas é bem-sucedido.
- **RF3 – Recuperação de senha:** Existir teste(s) que validem que, na tela de login, a opção de recuperação de senha é acionável e que a aplicação responde de forma adequada (mensagem, nova tela ou estado consistente, sem erro não tratado).
- **RF4 – Consistência com a aplicação:** Os testes devem refletir o comportamento atual da aplicação Sauce Demo (v1); se a aplicação não oferecer recuperação de senha funcional, o teste deve validar o que existir (ex.: presença do link e resposta ao clique).

Todos os requisitos devem ser testáveis via E2E (UI).

## Critérios de Sucesso

- Os fluxos de logout e de recuperação de senha estão cobertos por pelo menos um teste E2E cada, executável na suíte atual (Playwright).
- Os novos testes passam de forma estável contra a aplicação Sauce Demo (ambiente utilizado pelo projeto).
- Os testes seguem os padrões do projeto (POM, convenções de arquivos e de código).
- A documentação da suíte (ou do spec) deixa claro quais comportamentos estão sendo validados (logout e recuperação de senha).

## Entidades Principais

- **Usuário/Sessão:** usuário autenticado que pode realizar logout.
- **Credenciais:** usadas no login; recuperação de senha pode envolver identificação do usuário (e-mail ou usuário) conforme a aplicação.
- **Tela de login:** estado inicial para recuperação de senha e estado final após logout.

## Suposições

- A aplicação Sauce Demo (v1) oferece um meio visível de logout a partir da área autenticada (ex.: menu com opção “Logout”).
- A tela de login da Sauce Demo possui algum elemento ou link relacionado a “esqueci minha senha” ou equivalente; o comportamento exato (mensagem, tela, link externo) será alinhado ao que a aplicação realmente oferece.
- Os testes rodam contra o mesmo ambiente (https://www.saucedemo.com/v1/) e com as mesmas convenções de configuração (viewport, browser) já utilizadas no projeto.

## Restrições

- Não alterar o comportamento da aplicação sob teste; apenas automatizar e validar o que já existe.
- Manter compatibilidade com a suíte atual (execução local e CI com retries e workers configurados).
- Não incluir dados sensíveis reais; usar apenas credenciais de teste já utilizadas no projeto (ex.: standard_user / secret_sauce).

---

## Checklist de Validação

### Qualidade do Conteúdo

- [x] Especificação focada em valor do usuário e em comportamentos testáveis, sem detalhes de implementação (stack, código, estrutura de arquivos).
- [x] Linguagem acessível a partes interessadas de negócio; detalhes técnicos restritos ao que é necessário para integração com o legado.

### Completude dos Requisitos

- [x] Requisitos funcionais testáveis e não ambíguos (RF1–RF4).
- [x] Cenários de usuário descritos com pré-condição, ação e resultado esperado.
- [x] Critérios de sucesso mensuráveis e verificáveis.

### Prontidão da Funcionalidade

- [x] Requisitos com critérios de aceitação implícitos ou explícitos (cobertura E2E, estabilidade, aderência aos padrões).
- [x] Referência ao legado preenchida (tipo de spec, funcionalidades relacionadas, impacto, integração).
