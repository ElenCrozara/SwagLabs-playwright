import { expect, test, page } from "@playwright/test";
import { LoginPage } from "../support/login.index";


test.describe('login page', async () => {
    
    test('the user login with succes', async ({ page }) => {
        const loginPage = new LoginPage(page)

        await loginPage.login()
        await expect(await page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
       
        const productTitle = await page.locator('#inventory_filter_container > div')
        await expect(productTitle).toHaveText('Products')
    });
    test('the user inserts wrong credential', async ({ page }) => {
        const loginPage = new LoginPage(page)

        await loginPage.loginError()
        const errorText = await page.getByText('Epic sadface: Username and password do not match any user in this service')
        await expect(errorText).toBeVisible()
    });
})
