import { expect, test } from "@playwright/test";
import { ProductsPage } from "../support/products.index";


test.describe('products test', async () => {
    
    test('all product names begin with "Sauce Labs"', async ({ page }) => {
        const productsPage = new ProductsPage(page)
        await productsPage.login()
        await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
        await productsPage.verificationProduct()

    });

    test('inventory products', async ({ page }) => {
        const productsPage = new ProductsPage(page)
        await productsPage.login()
        await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
        await productsPage.validatingInventory()
    })
    // criar mais testes para essa página
    //.cart_cancel_link.btn_secondary // CANCEL
})