import { test } from "@playwright/test";
import { CartPage } from "../support/cart.index";


test.describe('cart test', async () => {

    test('adding product to cart', async ({ page }) => {
        const cartPage = new CartPage(page)
        await cartPage.login()
        await page.waitForURL('https://www.saucedemo.com/v1/inventory.html')
        await cartPage.selectProduct()
        await cartPage.accessingCart()
        await cartPage.checkout()
        await cartPage.payments()

    });

    test('adding new product', async ({ page }) => {
        const cartPage = new CartPage(page)
        await cartPage.login()
        await page.waitForURL('https://www.saucedemo.com/v1/inventory.html')
        await cartPage.selectProduct()
        await cartPage.accessingCart()
        await cartPage.continueShopping()


    })

    // criar arquivo para testar cart.continue quando o usuário insere o produto no carrinho e 
    // retorna para comprar mais
    // inserir dados fakes no checkout
})



// await page.getByRole('button', { name: 'CHECKOUT ' }).click();
// const addToCartButton = await page.locator('.btn_primary.btn_inventory:has-text("ADD TO CART")').click();
// await page.getByRole('btn', { name: 'CONTINUE ' }).click();
// await page.dispatchEvent('.btn_primary.cart_button').click()
// await page.dispatchEvent('#shopping_cart_container > a', 'click');
// const newPage1 = await context.waitForEvent('page');