import { expect } from '@playwright/test'
import { Page } from '@playwright/test'
import { credentials } from './fixtures'

export class ProductsPage {

    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async login() {
        await this.page.goto('/index.html')
        await expect(await this.page.title()).toBe('Swag Labs')
        await this.page.locator('#user-name').fill(credentials.username)
        await this.page.locator('#password').fill(credentials.password)
        await this.page.locator('#login-button').click()
    }

    async verificationProduct() {
        const titleListLocator = this.page.locator('.inventory_item_name');
        // guarda o conteúdo dos textos dos produtos (allTextContents)
        const productTitleList = await titleListLocator.allTextContents();
        // loop para validar se todos os itens começam com "Sauce Labs"
        for (const item of productTitleList) {
            await expect(item.startsWith("Sauce Labs")).toBe(true);
        }
    }

    async validatingInventory() {
        // localizou a class que referencia os 6 elementos da lista
        const inventory = this.page.locator('.inventory_item_name')
        // guarda o conteúdo do texto na constante
        const inventoryListProducts = await inventory.allTextContents()
        // loop para verificar se o tamanho da lista corresponde a 6 produtos
        // for (const inventory of inventoryListProducts)
        await expect(inventoryListProducts.length).toBe(6)
    }

}
