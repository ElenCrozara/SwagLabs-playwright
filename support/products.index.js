import { expect } from '@playwright/test'


exports.ProductsPage = class ProductsPage {

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

    async verificationProduct() {
        const titleListLocator = await this.page.locator('.inventory_item_name');
        // guarda o conteúdo dos textos dos produtos (allTextContents)
        const productTitleList = await titleListLocator.allTextContents();
        // loop para validar se todos os itens começam com "Sauce Labs"
        
        for (const item of productTitleList) {
            await expect(item.startsWith("Sauce Labs")).toBe(true);
        } 
    }

    async validatingInventory() {
            // localizou a class que referencia os 6 elementos da lista
            const inventory = await this.page.locator('.inventory_item_name')
            // guarda o conteúdo do texto na constante
            const inventoryListProducts = await inventory.allTextContents()
            // loop para verificar se o tamanho da lista corresponde a 6 produtos
            for (const item of inventoryListProducts)
                await expect(inventoryListProducts.length).toBe(6)
        }

    }
