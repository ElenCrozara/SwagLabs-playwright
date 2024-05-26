import { test } from "@playwright/test";
import { CartPage } from "../support/cart.index";


let browserContext;
let page;
let cartPage;

test.describe('testing cart', async () => {
    
    test.beforeAll(async ({ browser }) => {
        browserContext = await browser.newContext();
        page = await browserContext.newPage();
        cartPage = new CartPage(page);
        await cartPage.login();
        
    });

    test('complete cart flow', async ({ page }) => {
        await cartPage.selectProduct()
        await cartPage.accessingCart()
        await cartPage.checkout()
        await cartPage.payments()

    });

    test('adding and remove products', async ({ page }) => {
        await cartPage.selectProduct()
        await cartPage.accessingCart()
        await cartPage.continueShopping()
        await cartPage.removeProductCart()
        await cartPage.novoCheckout()
        await cartPage.novoPayments()

    })

    
    // inserir dados fakes no checkout
})



// await page.getByRole('button', { name: 'CHECKOUT ' }).click();
// const addToCartButton = await page.locator('.btn_primary.btn_inventory:has-text("ADD TO CART")').click();
// await page.getByRole('btn', { name: 'CONTINUE ' }).click();
// await page.dispatchEvent('.btn_primary.cart_button').click()
// await page.dispatchEvent('#shopping_cart_container > a', 'click');
// const newPage1 = await context.waitForEvent('page');