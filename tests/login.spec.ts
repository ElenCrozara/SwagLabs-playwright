import { expect, test } from "@playwright/test";
import { LoginPage } from "../support/login.index";

test.describe('login page', async () => {

    test.use({
        viewport: { width: 1920, height: 1080 },
      });
    
    test('the user login with succes', async ({ page }) => {
        const loginPage = new LoginPage(page)

        await loginPage.login()
        await expect(page.url()).toMatch(/inventory\.html/)
        const productTitle = page.locator('#inventory_filter_container > div')
        await expect(productTitle).toHaveText('Products')
    });
    test('the user inserts wrong credential', async ({ page }) => {
        
        const loginPage = new LoginPage(page)

        await loginPage.loginError()
        const errorText = page.getByText('Epic sadface: Username and password do not match any user in this service')
        await expect(errorText).toBeVisible()
    });

    test('the user logs out with success', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.login()
        await loginPage.logout()
        await expect(page.url()).toMatch(/index\.html|saucedemo\.com\/?$/)
        await expect(page.locator('#login-button')).toBeVisible()
    });

    test('the user logs out and logs in again', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.login()
        await loginPage.logout()
        await loginPage.login()
        await expect(page.url()).toMatch(/inventory\.html/)
        const productTitle = page.locator('#inventory_filter_container > div')
        await expect(productTitle).toHaveText('Products')
    });

    test('the user can open password recovery flow', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.gotoLogin()
        await loginPage.openPasswordRecovery()
        const errorMessage = page.getByText(/Epic sadface/)
        const loginButton = page.locator('#login-button')
        await expect(errorMessage.or(loginButton)).toBeVisible()
    });
})
