import { expect, test } from "@playwright/test";
import { ProductsPage } from "../support/products.index";

let browserContext;
let page;
let productsPage;

test.describe('products test', () => {
    test.beforeAll(async ({ browser }) => {
        browserContext = await browser.newContext();
        page = await browserContext.newPage();
        productsPage = new ProductsPage(page);
        await productsPage.login();
       
    });

    test.use({
        viewport: { width: 1920, height: 1080 },
      });
      
    test('all product names begin with "Sauce Labs"', async ({ page }) => {
        test.fail()
        await expect(page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
        await productsPage.verificationProduct()

    });

    test('inventory products', async () => {
        await productsPage.validatingInventory()
    })
    // criar mais testes para essa página
    //.cart_cancel_link.btn_secondary // CANCEL
})