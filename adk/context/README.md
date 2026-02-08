# Contexto ADK – SwagLabs Playwright

**Data da análise:** 2025-02-08

## Visão geral

Este diretório contém artefatos de contexto gerados pelo `adk-analyze` para o projeto **SwagLabs-playwright**. O projeto é uma suíte de **testes E2E (end-to-end)** que automa a aplicação de demonstração [Sauce Demo](https://www.saucedemo.com) (e-commerce fictício "Swag Labs"), utilizando **Playwright** e **TypeScript**.

## Tipo de projeto

- **Testes E2E** em aplicação web externa (Sauce Demo)
- **Page Object Model (POM)** para organização do código
- **Um único “app” em teste**: front-end do e-commerce (login, produtos, carrinho, checkout)

## Artefatos disponíveis

| Artefato | Descrição |
|----------|-----------|
| [stack.md](./stack.md) | Stack tecnológico (runtime, linguagem, ferramentas) |
| [architecture.md](./architecture.md) | Estrutura de diretórios e arquitetura de testes |
| [conventions.md](./conventions.md) | Convenções de código e nomenclatura |
| [config.md](./config.md) | Configurações (Playwright, ESLint, ambiente) |
| [api-patterns.md](./api-patterns.md) | Padrões de interação com a aplicação (UI, URLs) |
| [data-patterns.md](./data-patterns.md) | Padrões de dados (credenciais, fixtures) |
| [test-strategy.md](./test-strategy.md) | Estratégia e organização de testes |
| [integration-patterns.md](./integration-patterns.md) | Padrões de integração (Allure, CI) |
| [summary.json](./summary.json) | Resumo estruturado da análise |

## Uso

Estes artefatos devem ser usados como referência pelos comandos **adk-specify** e **adk-plan** para manter novas funcionalidades e planos alinhados à arquitetura e aos padrões existentes.
