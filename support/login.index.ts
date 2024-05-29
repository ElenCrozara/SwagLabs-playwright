import { Page, expect } from '@playwright/test'

export class LoginPage {

    readonly page: Page;
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
    async loginError() {
        await this.page.goto('https://www.saucedemo.com/v1/index.html')
        await expect(await this.page.title()).toBe('Swag Labs')
        await this.page.locator('#user-name').fill('standard_user')
        await this.page.locator('#password').fill('pwd')
        await this.page.locator('#login-button').click()
    }
}