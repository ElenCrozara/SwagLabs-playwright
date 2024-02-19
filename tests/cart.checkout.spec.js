import { expect, test } from "@playwright/test";



test.describe('cart test', async () => {

    test('add cart product', async ({ page }) => {
        await test.step('login', async () => {
            await page.goto('https://www.saucedemo.com/v1/index.html')
            await expect(await page.title()).toBe('Swag Labs')
            await page.locator('#user-name').fill('standard_user')
            await page.locator('#password').fill('secret_sauce')
            await page.dispatchEvent('#login-button', 'click');
            await page.waitForURL('https://www.saucedemo.com/v1/inventory.html')

        })
        await test.step('select product', async () => {

            // valida se a lista de produtos esta visivel na página
            const list = await page.locator('#contents_wrapper')
            const count = await list.count();
            const isVisible = await list.isVisible();

            // Localiza a classe do primeiro produto da lista e clica
            await page.locator('.inventory_item_name').nth(0);
            await page.dispatchEvent('.inventory_item_name', 'click');
            await page.waitForURL('https://www.saucedemo.com/v1/inventory-item.html?id=4')
            await page.locator('//*[contains(text(),"Sauce Labs Backpac")]').isVisible();
            await page.getByText('$29.99', { exact: true });
            await page.dispatchEvent('.btn_primary.btn_inventory', 'click');

        });
        await test.step('access cart', async () => {

            // clica no elemento do carrinho
            await page.waitForSelector('#shopping_cart_container > a');
            await page.click('#shopping_cart_container > a');
            await expect(page.url()).toMatch('https://www.saucedemo.com/v1/cart.html');
            await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
            await page.getByText('$29.99', { exact: true })
            await page.waitForSelector('a.btn_action.checkout_button');
            await page.click('a.btn_action.checkout_button');
            // await page.dispatchEvent('a.btn_action.checkout_button', 'click');
            await page.waitForURL('https://www.saucedemo.com/v1/checkout-step-one.html');

        })
        await test.step('checkout', async () => {

            await expect(page.url()).toMatch('https://www.saucedemo.com/v1/checkout-step-one.html');
            await page.locator('#first-name').fill('Elen')
            await page.locator('#last-name').fill('Crozara')
            await page.locator('#postal-code').fill('38400644')
            await page.locator('.btn_primary.cart_button').click()

        })
        await test.step('payments', async () => {
            await expect(page.url()).toMatch('https://www.saucedemo.com/v1/checkout-step-two.html');
            await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
            await page.getByText('$29.99', { exact: true })
            await expect(page.getByText('SauceCard #31337')).toBeVisible();
            await expect(page.getByText('32.39')).toBeVisible();
            await page.getByRole('link', { name: 'FINISH' }).click()
            await expect(page.url()).toMatch('https://www.saucedemo.com/v1/checkout-complete.html');
            
            //.btn_action.cart_button // FINISH
        })
    });
    // criar arquivo para testar cart.continue quando o usuário insere o produto no carrinho e 
    // retorna para comprar mais
})



// await page.getByRole('button', { name: 'CHECKOUT ' }).click();
// const addToCartButton = await page.locator('.btn_primary.btn_inventory:has-text("ADD TO CART")').click();
// await page.getByRole('btn', { name: 'CONTINUE ' }).click();
// await page.dispatchEvent('.btn_primary.cart_button').click()
// await page.dispatchEvent('#shopping_cart_container > a', 'click');
// const newPage1 = await context.waitForEvent('page');