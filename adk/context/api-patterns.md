# Padrões de “API” (interação com a aplicação)

Este projeto não expõe APIs REST próprias; os padrões referem-se à **interação com a UI** e às **URLs** da aplicação sob teste (Sauce Demo).

## URLs base e rotas

- **Base:** `https://www.saucedemo.com/v1/`
- **Rotas usadas:**
  - `index.html` – login
  - `inventory.html` – listagem de produtos
  - `inventory-item.html?id=<id>` – detalhe do produto
  - `cart.html` – carrinho
  - `checkout-step-one.html` – dados do checkout (nome, sobrenome, CEP)
  - `checkout-step-two.html` – revisão e pagamento
  - `checkout-complete.html` – conclusão

URLs estão **hardcoded** nos page objects (não há `baseURL` ativa no config para uso em `page.goto('/')`).

## Padrões de localização (locators)

- **IDs:** `#user-name`, `#password`, `#login-button`, `#first-name`, `#last-name`, `#postal-code`, `#shopping_cart_container`, `#inventory_filter_container`, etc.
- **Classes CSS:** `.inventory_item_name`, `.btn_primary.btn_inventory`, `.btn_secondary.cart_button`, `a.btn_action.checkout_button`, `a.btn_secondary`, `button.btn_secondary.cart_button`.
- **Texto e roles:** `page.getByText(...)`, `page.getByRole('link', { name: 'FINISH' })`, `page.getByRole('button', { name: 'CONTINUE' })`.
- **XPath:** usado pontualmente – ex.: `'//*[contains(text(),"Sauce Labs Backpac")]'`.
- **Seletores compostos:** `#shopping_cart_container > a`, `a.btn_action.checkout_button`.

Padrão geral: preferência por IDs e classes; uso de `getByRole`/`getByText` em pontos específicos; XPath como exceção.

## Padrões de ação

- **Navegação:** `page.goto(url)` no início dos fluxos (ex.: login).
- **Preenchimento:** `page.locator(seletor).fill(valor)` para inputs.
- **Clique:** `page.click(seletor)` ou `page.dispatchEvent(seletor, 'click')`; em alguns casos `getByRole(..., { name }).click()`.
- **Espera:** `page.waitForURL(...)`, `page.waitForSelector(...)` para sincronização com a aplicação.

## Assertions

- **expect** de `@playwright/test`: `expect(page.url()).toBe(...)`, `expect(...).toMatch(...)`, `expect(element).toBeVisible()`, `expect(element).toHaveText(...)`, `expect(items.length).toBe(6)`.
- Assertions ficam nos page objects em vários métodos (ex.: verificação de título, URL, visibilidade de texto).

## Autenticação (login)

- Credenciais fixas nos page objects: usuário `standard_user`, senha `secret_sauce`; cenário de erro usa senha `pwd`.
- Fluxo: goto index → fill user/password → click login → (opcional) waitForURL inventory.
