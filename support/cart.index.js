import { expect } from '@playwright/test'


exports.CartPage = class CartPage {

    /** @param {import('@playwright/test').Page} page */

    constructor(page) {
        this.page = page
    }

    async login() {
        await this.page.goto('https://www.saucedemo.com/v1/index.html')
        await expect(await this.page.title()).toBe('Swag Labs')
        await this.page.locator('#user-name').fill('standard_user')
        await this.page.locator('#password').fill('secret_sauce')
        await this.page.locator('#login-button').click()
    }

    async selectProduct() {
        // valida se a lista de produtos esta visivel na página
        const list = await this.page.locator('#contents_wrapper')
        const count = await list.count();
        const isVisible = await list.isVisible();

        // Localiza a classe do primeiro produto da lista e clica
        await this.page.locator('.inventory_item_name').nth(0);
        await this.page.dispatchEvent('.inventory_item_name', 'click');
        await this.page.waitForURL('https://www.saucedemo.com/v1/inventory-item.html?id=4')
        await this.page.locator('//*[contains(text(),"Sauce Labs Backpac")]').isVisible();
        await this.page.getByText('$29.99', { exact: true });
        await this.page.dispatchEvent('.btn_primary.btn_inventory', 'click');
    }

    async accessingCart() {
        await this.page.waitForSelector('#shopping_cart_container > a');
        await this.page.click('#shopping_cart_container > a');
        await expect(this.page.url()).toMatch('https://www.saucedemo.com/v1/cart.html');
        await expect(this.page.getByText('Sauce Labs Backpack')).toBeVisible();
        await this.page.getByText('$29.99', { exact: true });
        await this.page.waitForSelector('a.btn_action.checkout_button');
        await this.page.click('a.btn_action.checkout_button');
        // await page.dispatchEvent('a.btn_action.checkout_button', 'click');
        await this.page.waitForURL('https://www.saucedemo.com/v1/checkout-step-one.html');
    }

    async checkout() {
        await expect(this.page.url()).toMatch('https://www.saucedemo.com/v1/checkout-step-one.html');
        await this.page.locator('#first-name').fill('Elen')
        await this.page.locator('#last-name').fill('Crozara')
        await this.page.locator('#postal-code').fill('38400644')
        await this.page.locator('.btn_primary.cart_button').click()
    }
    
    async payments() {
        await expect(this.page.url()).toMatch('https://www.saucedemo.com/v1/checkout-step-two.html');
        await expect(this.page.getByText('Sauce Labs Backpack')).toBeVisible();
        await this.page.getByText('$29.99', { exact: true });
        await expect(this.page.getByText('SauceCard #31337')).toBeVisible();
        await expect(this.page.getByText('32.39')).toBeVisible();
        await this.page.getByRole('link', { name: 'FINISH' }).click()
        await expect(this.page.url()).toMatch('https://www.saucedemo.com/v1/checkout-complete.html');
    }
}