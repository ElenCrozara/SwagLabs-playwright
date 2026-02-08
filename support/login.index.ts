import { Page, expect } from '@playwright/test'
import { credentials, credentialsInvalid } from './fixtures'

export class LoginPage {

    readonly page: Page;
    constructor(page: Page) {
        this.page = page
    }

    async login() {
        await this.page.goto('/index.html')
        await this.page.locator('#user-name').waitFor({ state: 'visible' })
        await expect(await this.page.title()).toBe('Swag Labs')
        await this.page.locator('#user-name').fill(credentials.username)
        await this.page.locator('#password').fill(credentials.password)
        await this.page.locator('#login-button').click()
        await this.page.getByText('Products').first().waitFor({ state: 'visible', timeout: 15000 })
    }

    async loginError() {
        await this.page.goto('/index.html')
        await expect(await this.page.title()).toBe('Swag Labs')
        await this.page.locator('#user-name').fill(credentialsInvalid.username)
        await this.page.locator('#password').fill(credentialsInvalid.password)
        await this.page.locator('#login-button').click()
    }

    async logout() {
        await this.page.getByRole('button', { name: 'Open Menu' }).click()
        await this.page.getByRole('link', { name: 'Logout' }).click()
        await expect(this.page.url()).toMatch(/\/index\.html|saucedemo\.com\/?$/)
    }

    async gotoLogin() {
        await this.page.goto('/index.html')
        await expect(await this.page.title()).toBe('Swag Labs')
    }

    async openPasswordRecovery() {
        const link = this.page.getByText('Forgot your password?')
        if (await link.isVisible()) {
            await link.click()
        }
    }
}