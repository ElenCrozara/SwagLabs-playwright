import { expect, test } from "@playwright/test";
import { LoginPage } from "../support/login.index";

test.describe('login page', async () => {

    test.use({
        viewport: { width: 1920, height: 1080 },
      });
    
    test('the user login with succes', async ({ page }) => {
        const loginPage = new LoginPage(page)

        await loginPage.login()
        await expect(page.url()).toBe('https://www.saucedemo.com/v1/inventory.html')
       
        const productTitle = page.locator('#inventory_filter_container > div')
        await expect(productTitle).toHaveText('Products')
    });
    test('the user inserts wrong credential', async ({ page }) => {
        
        const loginPage = new LoginPage(page)

        await loginPage.loginError()
        const errorText = page.getByText('Epic sadface: Username and password do not match any user in this service')
        await expect(errorText).toBeVisible()
    });
})
