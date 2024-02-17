import { expect, test } from "@playwright/test";


test.describe('login page', async () => {

    test('the user login with succes', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/v1/index.html')
        await expect(await page.title()).toBe('Swag Labs')
        await page.locator('#user-name').fill('standard_user')
        await page.locator('#password').fill('secret_sauce')
        await page.locator('#login-button').click()
        await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
        const productTitle = await page.locator('#inventory_filter_container > div')
        await expect(productTitle).toHaveText('Products')
        await page.pause()
    });


    test('the user inserts wrong credential', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/v1/index.html')
        await page.locator('#user-name').fill('standard_user')
        await page.locator('#password').fill('pwd')
        await page.locator('#login-button').click()
        const errorText = await page.getByText('Epic sadface: Username and password do not match any user in this service')
        await expect(errorText).toBeVisible()
    });
})
