import { expect } from "@playwright/test";
import { Page } from "@playwright/test";
import { credentials, checkoutData } from "./fixtures";

export class CartPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async login() {
    await this.page.goto("/index.html");
    await expect(await this.page.title()).toBe("Swag Labs");
    await this.page.locator("#user-name").fill(credentials.username);
    await this.page.locator("#password").fill(credentials.password);
    await this.page.locator("#login-button").click();
    await this.page.waitForURL(/\/inventory\.html/);
  }

  async selectProduct() {
    const list = this.page.locator("#contents_wrapper");
    await expect(list).toBeVisible();

    // Localiza a classe do primeiro produto da lista e clica
    this.page.locator(".inventory_item_name").nth(0);
    await this.page.dispatchEvent(".inventory_item_name", "click");
    await this.page.waitForURL(/\/inventory-item\.html\?id=4/);
    await this.page
      .locator('//*[contains(text(),"Sauce Labs Backpac")]')
      .isVisible();
    this.page.getByText("$29.99", { exact: true });
    // clicando no botão ADD TO CART para adicionar um produto no carrinho
    await this.page.dispatchEvent(".btn_primary.btn_inventory", "click");
  }

  async accessingCart() {
    await this.page.waitForSelector("#shopping_cart_container > a");
    await this.page.click("#shopping_cart_container > a");
    await expect(this.page.url()).toMatch(/\/cart\.html/);
    await expect(this.page.getByText("Sauce Labs Backpack")).toBeVisible();
    this.page.getByText("$29.99", { exact: true });
    await this.page.waitForSelector("a.btn_action.checkout_button");
    await this.page.click("a.btn_action.checkout_button");
    await this.page.waitForURL(/\/checkout-step-one\.html/);
  }

  async checkout() {
    await expect(this.page.url()).toMatch(/\/checkout-step-one\.html/);
    await this.page.locator("#first-name").fill(checkoutData.firstName);
    await this.page.locator("#last-name").fill(checkoutData.lastName);
    await this.page.locator("#postal-code").fill(checkoutData.postalCode);
    await this.page.locator(".btn_primary.cart_button").click();
  }

  async payments() {
    await expect(this.page.url()).toMatch(/\/checkout-step-two\.html/);
    await expect(this.page.getByText("Sauce Labs Backpack")).toBeVisible();
    this.page.getByText("$29.99", { exact: true });
    await expect(this.page.getByText("SauceCard #31337")).toBeVisible();
    await expect(this.page.getByText("32.39")).toBeVisible();
    await this.page.getByRole("link", { name: "FINISH" }).click();
    await expect(this.page.url()).toMatch(/\/checkout-complete\.html/);
  }

  async continueShopping() {
    // clica no carrinho
    await this.page.waitForSelector("#shopping_cart_container > a");
    await this.page.click("#shopping_cart_container > a");
    await expect(this.page.url()).toMatch(/\/cart\.html/);

    // clicando no botão CONTINUE SHOPPING
    await this.page.waitForSelector("a.btn_secondary");
    await this.page.click("a.btn_secondary");
    await expect(this.page.url()).toMatch(/\/inventory\.html/);
    await this.page
      .getByRole("link", { name: "Sauce Labs Fleece Jacket" })
      .click();

    // acessa a página do novo produto
    await expect(this.page.url()).toMatch(/\/inventory-item\.html\?id=5/);
    await this.page
      .locator('//*[contains(text(),"Sauce Labs Fleece Jacket")]')
      .isVisible();
    this.page.getByText("$49.99", { exact: true });

    // clicando no botão ADD TO CART para adicionar um produto no carrinho
    await this.page.dispatchEvent(".btn_primary.btn_inventory", "click");
  }

  async removeProductCart() {
    // clica no carrinho
    await this.page.waitForSelector("#shopping_cart_container > a");
    await this.page.click("#shopping_cart_container > a");
    await expect(this.page.url()).toMatch(/\/cart\.html/);
    await this.page.waitForSelector(".inventory_item_name");

    // Obter os 2 elementos correspondentes ao locator
    const items = await this.page.$$(".inventory_item_name");
    expect(items).toBeTruthy();
    await expect(this.page.getByText("Sauce Labs Backpack")).toBeVisible();
    // encontra o primeiro botão REMOVE e clica
    this.page.locator("button.btn_secondary.cart_button").first();
    await this.page.click("button.btn_secondary.cart_button");
    await expect(this.page.getByText("Sauce Labs Fleece Jacket")).toBeVisible();
    await this.page.click("a.btn_action.checkout_button");
    await this.page.waitForURL(/\/checkout-step-one\.html/);
  }

  async novoCheckout() {
    await expect(this.page.url()).toMatch(/\/checkout-step-one\.html/);
    await this.page.locator("#first-name").fill(checkoutData.firstName);
    await this.page.locator("#last-name").fill(checkoutData.lastName);
    await this.page.locator("#postal-code").fill(checkoutData.postalCode);
    await this.page.getByRole("button", { name: "CONTINUE" }).click();
    await expect(this.page.url()).toMatch(/\/checkout-step-two\.html/);
  }

  async novoPayments() {
    await expect(this.page.getByText("Sauce Labs Fleece Jacket")).toBeVisible();
    this.page.getByText("$49.99", { exact: true });
    await expect(this.page.getByText("SauceCard #31337")).toBeVisible();
    await expect(this.page.getByText("53.99")).toBeVisible();
    await this.page.getByRole("link", { name: "FINISH" }).click();
    await expect(this.page.url()).toMatch(/\/checkout-complete\.html/);
  }
}
