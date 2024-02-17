import { expect, test } from "@playwright/test";

test('all product names begin with "Sauce Labs"', async ({ page }) => {
    test.fail()
    await test.step('login', async () => {
        await page.goto('https://www.saucedemo.com/v1/index.html')
        await expect(await page.title()).toBe('Swag Labs')
        await page.locator('#user-name').fill('standard_user')
        await page.locator('#password').fill('secret_sauce')
        await page.locator('#login-button').click()

    })
    await test.step('product title verification', async () => {
        const titleListLocator = await page.locator('.inventory_item_name')
        const productTitleList = await titleListLocator.allTextContents()

        for (const item of productTitleList)
            await expect(item.slice(0, 10)).toBe('Sauce Labs')
        // await page.pause()

    })

});