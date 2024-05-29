import { test } from "@playwright/test";
import { CartPage } from "../support/cart.index";

let browserContext;
let page;
let cartPage;

test.describe("testing cart", async () => {
  test.beforeAll(async ({ browser }) => {
    browserContext = await browser.newContext();
    page = await browserContext.newPage();
    cartPage = new CartPage(page);
    await cartPage.login();
  });

  test.use({
    viewport: { width: 1920, height: 1080 },
  });

  test("complete cart flow", async () => {
    await cartPage.selectProduct();
    await cartPage.accessingCart();
    await cartPage.checkout();
    await cartPage.payments();
  });

  test("adding and remove products", async () => {
    await cartPage.selectProduct();
    await cartPage.accessingCart();
    await cartPage.continueShopping();
    await cartPage.removeProductCart();
    await cartPage.novoCheckout();
    await cartPage.novoPayments();
  });
  // inserir dados fakes no checkout
});
