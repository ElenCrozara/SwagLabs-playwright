# Tarefas: Testes de Logout e Recuperação de Senha

## Visão Geral

Implementar testes E2E para os fluxos de **logout** (RF1, RF2) e **recuperação de senha** (RF3, RF4) na aplicação Sauce Demo, estendendo `LoginPage` e `tests/login.spec.ts`. Desenvolvimento segue **TDD**: testes escritos primeiro (Red), implementação no page object em seguida (Green), refatoração quando necessário (Refactor).

**Objetivos:** Cobrir cenários T1 (logout com sucesso), T2 (logout e novo login) e T3 (acesso ao fluxo de recuperação de senha); manter padrões POM e convenções do projeto.

## Estratégia de Implementação

- **MVP:** Três testes E2E passando (T1, T2, T3) com métodos correspondentes no `LoginPage`.
- **Entrega incremental:** Uma história de usuário por vez (US1 → US2 → US3), cada uma em ciclo TDD.
- **Dependências:** US1 (logout) é pré-requisito para US2 (logout + novo login). US3 (recuperação) é independente e pode ser feita em paralelo após a Fase 2.

---

## Fase 1: Configuração

Objetivo: Garantir que o ambiente e a suíte atual estão estáveis antes de alterar código.

- [x] T001 [P] Verificar que a suíte atual passa: executar `npm run test` em /home/elen/SwagLabs-playwright e confirmar que tests/login.spec.ts, products e cart passam (ou documentar falhas conhecidas).

---

## Fase 2: Fundamental

Sem tarefas bloqueadoras (não há novos modelos, serviços ou dependências). Os page objects e specs existentes são a base.

---

## Fase 3: História US1 – Logout com sucesso (T1, RF1)

**Objetivo:** Usuário autenticado consegue encerrar a sessão e voltar à tela de login.

**Critérios de teste:** Após login, acionar menu e Logout; URL deve ser a de login; elemento da tela de login visível.

### TDD – Red (testes primeiro)

- [x] T002 [US1] Escrever teste E2E "the user logs out with success" em /home/elen/SwagLabs-playwright/tests/login.spec.ts: instanciar LoginPage(page), chamar login(), chamar método de logout (a implementar), fazer expect da URL de login e da visibilidade de um elemento da tela de login (ex.: #user-name ou #login-button). O teste deve falhar até existir o método no LoginPage.

### TDD – Green (implementação)

- [x] T003 [US1] Implementar método logout() em /home/elen/SwagLabs-playwright/support/login.index.ts: assumir página já na inventory; clicar no botão do menu (hamburger), aguardar drawer, clicar em "Logout"; opcionalmente fazer expect da URL de login. Usar getByRole/getByText conforme plan.md (D2). Fazer o teste T002 passar.

### TDD – Refactor (se necessário)

- [x] T004 [US1] Refatorar /home/elen/SwagLabs-playwright/support/login.index.ts e /home/elen/SwagLabs-playwright/tests/login.spec.ts se houver duplicação ou nomes pouco claros; manter testes verdes.

---

## Fase 4: História US2 – Logout e novo login (T2, RF2)

**Objetivo:** Após logout, usuário consegue fazer login novamente com credenciais válidas.

**Critérios de teste:** Logout (reutilizar US1) → login() → URL de inventário e elemento "Products" (ou equivalente) visível.

### TDD – Red (testes primeiro)

- [x] T005 [US2] Escrever teste E2E "the user logs out and logs in again" em /home/elen/SwagLabs-playwright/tests/login.spec.ts: login() → logout() → login(); expect URL inventory e expect visibilidade de "Products" (ou #inventory_filter_container > div). O teste deve passar após T003 (logout já implementado) ou falhar apenas por ajuste de fluxo.

### TDD – Green (implementação)

- [x] T006 [US2] Ajustar /home/elen/SwagLabs-playwright/tests/login.spec.ts ou /home/elen/SwagLabs-playwright/support/login.index.ts se o teste T005 falhar (ex.: garantir que login() após logout não depende de estado residual). Nenhuma alteração nova obrigatória se o fluxo já estiver correto.

### TDD – Refactor (opcional)

- [x] T007 [US2] Refatorar apenas se houver duplicação entre testes de logout; manter testes verdes.

---

## Fase 5: História US3 – Recuperação de senha (T3, RF3/RF4)

**Objetivo:** Na tela de login, a opção de recuperação de senha é acionável e a aplicação responde de forma verificável.

**Critérios de teste:** Ir à tela de login → clicar no link "Forgot your password?" (ou equivalente) → validar resposta da aplicação (mensagem, tela ou estado) conforme comportamento real da Sauce Demo.

### TDD – Red (testes primeiro)

- [x] T008 [US3] Escrever teste E2E "the user can open password recovery flow" em /home/elen/SwagLabs-playwright/tests/login.spec.ts: ir à tela de login (goto index ou usar LoginPage sem submeter), chamar método de recuperação (a implementar), validar resposta (ex.: mensagem visível ou URL/tela alterada). O teste deve falhar até existir o método no LoginPage.

### TDD – Green (implementação)

- [x] T009 [US3] Implementar método openPasswordRecovery() (ou clickRecoveryLink()) em /home/elen/SwagLabs-playwright/support/login.index.ts: assumir página na tela de login; clicar no link "Forgot your password?" (getByRole ou getByText); opcionalmente fazer expect da resposta (mensagem/tela) conforme plan.md (D4). Fazer o teste T008 passar.

### TDD – Refactor (opcional)

- [x] T010 [US3] Refatorar nomes ou assertions em /home/elen/SwagLabs-playwright/support/login.index.ts e /home/elen/SwagLabs-playwright/tests/login.spec.ts se necessário; manter testes verdes.

---

## Fase 6: Polimento

- [x] T011 Executar suíte completa em /home/elen/SwagLabs-playwright: `npm run test`; garantir que todos os testes (login, products, cart e os novos de logout/recuperação) passam.

- [x] T012 Verificar ESLint em /home/elen/SwagLabs-playwright/support/login.index.ts e /home/elen/SwagLabs-playwright/tests/login.spec.ts: corrigir erros ou warnings (ex.: playwright/expect-expect se algum teste não tiver expect explícito).

- [x] T013 [P] Opcional: adicionar tipagem explícita ao construtor de LoginPage em /home/elen/SwagLabs-playwright/support/login.index.ts (constructor(page: Page)) para alinhar às convenções do legado.

---

## Dependências entre histórias

```
Fase 1 (Config)
    ↓
Fase 2 (Fundamental) — sem tarefas
    ↓
Fase 3 (US1 Logout)  →  T002 (Red) → T003 (Green) → T004 (Refactor)
    ↓
Fase 4 (US2 Logout + login)  →  T005 (Red) → T006 (Green) → T007 (Refactor)
    ↓
Fase 5 (US3 Recovery)  →  T008 (Red) → T009 (Green) → T010 (Refactor)
    ↓
Fase 6 (Polimento)  →  T011, T012, T013
```

**Ordem de conclusão sugerida:** US1 → US2 → US3 (US2 depende de US1; US3 independente de US2).

---

## Execução paralela

- **T001** (Fase 1): pode ser executada em paralelo com qualquer outra tarefa de configuração.
- **T008 / T009 / T010** (US3): após Fase 2, a história US3 pode ser desenvolvida em paralelo a US2, desde que US1 já esteja concluída, se duas pessoas trabalharem (uma em US2, outra em US3).
- **T011, T012, T013** (Fase 6): T012 e T013 podem ser feitas em paralelo; T011 deve ser executada após todas as implementações.

---

## Resumo

| Métrica | Valor |
|--------|--------|
| Total de tarefas | 13 |
| Por história | US1: 3, US2: 3, US3: 3; Config: 1; Polimento: 3 |
| Tarefas paralelizáveis | T001 [P], T013 [P]; US3 em paralelo a US2 (após US1) |
| Critérios de teste | T1, T2, T3 independentes; RF1–RF4 cobertos |
| Escopo MVP | T001–T011 concluídos: 3 novos testes E2E passando (logout, logout+login, recuperação) |

**Validação de formato:** Todas as tarefas seguem o checklist `- [ ] [TaskID] [P?] [Story?] Descrição com caminho do arquivo`.
