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

            // valida se a lista de produtos esta visivel na página
            const list = await page.locator('#contents_wrapper')
            const count = await list.count();
            const isVisible = await list.isVisible();

            // Localiza a classe do primeiro produto da lista e clica
            await page.locator('.inventory_item_name').nth(0).click();
            await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory-item.html?id=4')
            await page.locator('//*[contains(text(),"Sauce Labs Backpac")]').isVisible();
            await expect(page.getByText('29.99')).toBeVisible();
            await page.getByRole('button', { name: 'ADD TO CART' }).click();

        });
        await test.step('access cart', async () => {

            // clica no elemento do carrinho
            const link = await page.locator('#shopping_cart_container > a').click()
            await expect(page.url()).toMatch('https://www.saucedemo.com/v1/cart.html');
            await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
            await expect(page.getByText('29.99')).toBeVisible();
            await page.dispatchEvent('a.btn_action.checkout_button', 'click');
            await page.waitForURL('https://www.saucedemo.com/v1/checkout-step-one.html');

            // await page.waitForSelector('a.btn_action.checkout_button');
            // await page.click('a.btn_action.checkout_button');
            // await page.getByRole('button', { name: 'CHECKOUT ' }).click();
            // const addToCartButton = await page.locator('.btn_primary.btn_inventory:has-text("ADD TO CART")').click();

            
        })
        // criar step para testar página checkout
    });



    // criar arquivo para testar cart.continue quando o usuário insere o produto no carrinho e 
    // retorna para comprar mais
})