import { expect, test } from "@playwright/test";

test.describe('cart test', async () => { //carrinho
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
            // Localiza o primeiro elemento com a classe '.inventory_item_name' e clica nele
            await page.locator('.inventory_item_name').nth(0).click();
            await expect(page.url()).toMatch('https://www.saucedemo.com/v1/inventory-item.html?id=4');
            // valida o texto do nome do produto
            await page.locator('//*[contains(text(),"Sauce Labs Backpac")]').isVisible();
            const addToCartButton = await page.locator('.btn_primary.btn_inventory:has-text("ADD TO CART")').click();
        });
        
    });
})