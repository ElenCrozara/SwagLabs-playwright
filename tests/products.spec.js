import { expect, test } from "@playwright/test";

test.describe('products test', async () => {
    test('all product names begin with "Sauce Labs"', async ({ page }) => { 
        test.fail()
        // valida a lista de produto com nome Swag Labs
        await test.step('login', async () => {
            await page.goto('https://www.saucedemo.com/v1/index.html')
            await expect(await page.title()).toBe('Swag Labs')
            await page.locator('#user-name').fill('standard_user')
            await page.locator('#password').fill('secret_sauce')
            await page.locator('#login-button').click()
            await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')

        })
        await test.step('product title verification', async () => {
            const titleListLocator = await page.locator('.inventory_item_name')
            // guarda o conteúdo dos textos dos produtos (allTextContents)
            const productTitleList = await titleListLocator.allTextContents()
            // loop para validar do item 0 ao 10 da lista se é igual a Sauce Labs
            for (const item of productTitleList)
                await expect(item.slice(0, 10)).toBe('Sauce Labs')
            // slice é um metodo que verifica a posição de cada item em um array
        })
    });

    test('inventory products', async ({ page }) => {
        await test.step('login', async () => {
            await page.goto('https://www.saucedemo.com/v1/index.html')
            await expect(await page.title()).toBe('Swag Labs')
            await page.locator('#user-name').fill('standard_user')
            await page.locator('#password').fill('secret_sauce')
            await page.locator('#login-button').click()
            await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
        })

        await test.step('validating total products in the inventory', async () => {
            // localizou a class que referencia os 6 elementos da lista
            const inventory = await page.locator('.inventory_item_name')
            // guarda o conteúdo do texto na constante
            const inventoryListProducts = await inventory.allTextContents()
            // loop para verificar se o tamanho da lista corresponde a 6 produtos
            for (const item of inventoryListProducts)
                await expect(inventoryListProducts.length).toBe(6)
        })

    });
    // criar mais testes para essa página
    //.cart_cancel_link.btn_secondary // CANCEL
})
