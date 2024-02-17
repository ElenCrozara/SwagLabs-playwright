import { expect, test } from "@playwright/test";

test('all product names begin with "Sauce Labs"', async ({page}) => {
    await test.step('login', async () => {
        await page.goto('https://www.saucedemo.com/v1/index.html')
        await expect(await page.title()).toBe('Swag Labs')
        await page.locator('#user-name').fill('standard_user')
        await page.locator('#password').fill('secret_sauce')
        await page.locator('#login-button').click()
        
    })
    await test.step('product title verification', async () => {

    })
    
});