# Padrões de dados

## Credenciais e dados de teste

- **Login válido:** usuário `standard_user`, senha `secret_sauce` (hardcoded nos page objects).
- **Login inválido:** usuário `standard_user`, senha `pwd` (em `loginError()`).
- **Checkout:** nome `Elen`, sobrenome `Crozara`, CEP `38400644` (hardcoded em `checkout()` e `novoCheckout()`).

Não há uso de variáveis de ambiente ou arquivos de fixtures para credenciais; dados são fixos no código.

## Dados de produto e preços

- **Produtos:** nomes e preços usados nas assertions vêm da aplicação (ex.: “Sauce Labs Backpack”, “$29.99”, “Sauce Labs Fleece Jacket”, “$49.99”).
- **Pagamento:** texto esperado “SauceCard #31337”; totais “32.39” e “53.99” em cenários específicos.
- IDs de produto na URL: ex.: `inventory-item.html?id=4`, `id=5` (valores fixos nos fluxos atuais).

## Fixtures e reuso

- Não há diretório `fixtures/` nem uso de `test.extend()` com dados compartilhados.
- Dados repetidos (credenciais, dados de checkout) estão nos métodos dos page objects.
- Compartilhamento de estado entre testes via **test.beforeAll** (browser context e página) em alguns describes, não via fixtures de dados.

## Validações baseadas em dados

- **Listagem:** quantidade de produtos (ex.: 6) e prefixo dos nomes (“Sauce Labs”) via `allTextContents()` e loop com `expect(item.startsWith("Sauce Labs")).toBe(true)`.
- **URLs:** comparação exata ou `toMatch` com trechos da URL para garantir página correta.

## Resumo

- Dados de teste são **hardcoded** nos page objects.
- Não há camada de fixtures ou config externa para dados; padrão atual é adequado para suíte pequena e app de demonstração.
