import { test } from "@playwright/test";
import { CartPage } from "../support/cart.index";


test.describe('testing cart', async () => {


    test('complete cart flow', async ({ page }) => {
        const cartPage = new CartPage(page)

        await cartPage.login()
        await page.waitForURL('https://www.saucedemo.com/v1/inventory.html')
        await cartPage.selectProduct()
        await cartPage.accessingCart()
        await cartPage.checkout()
        await cartPage.payments()

    });

    test.only('adding and remove products', async ({ page }) => {
        const cartPage = new CartPage(page)

        await cartPage.login()
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