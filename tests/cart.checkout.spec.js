import { expect, test } from "@playwright/test";

test.describe('cart test', async () => { //testando o carrinho de compras
    test('add cart product', async ({ page }) => {
        await test.step('login', async () => {
            await page.goto('https://www.saucedemo.com/v1/index.html')
            await expect(await page.title()).toBe('Swag Labs')
            await page.locator('#user-name').fill('standard_user')
            await page.locator('#password').fill('secret_sauce')
            await page.locator('#login-button').click()
            await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
        })
        await test.step('select product', async () => {
            // Localiza a classe '.inventory_item_name' do primeiro produto da lista e clica
            await page.locator('.inventory_item_name').nth(0).click();
            // valida o texto do nome do produto
            await page.locator('//*[contains(text(),"Sauce Labs Backpac")]').isVisible();
            // adicionando produto no carrinho clicando no botão ADD TO CART
            const addToCartButton = await page.locator('.btn_primary.btn_inventory:has-text("ADD TO CART")').click();
        });
        await test.step('access cart', async () => { // acessa o carrinho depois de selecionar o produto
            // localizou o elemento do carrinho na página do produto e clicou
            const link = await page.locator('#shopping_cart_container > a').click()
            await expect(page.url()).toMatch('https://www.saucedemo.com/v1/cart.html');
            // validando se existe o nome do produto na página do carrinho
            await page.locator('a#item_4_title_link').textContent('Sauce Labs Backpack')
            // validando se existe o preço
            await page.locator('.item_pricebar').textContent('29.99')
            // clica no botão checkout
            await page.locator('a.btn_action.checkout_button').click()
        })
        // criar step para testar página checkout
    });



    // criar arquivo para testar cart.continue quando o usuário insere o produto no carrinho e 
    // retorna para comprar mais
})