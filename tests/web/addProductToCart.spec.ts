/**
 * Test Case: Add a product to the shopping cart
 *
 * Tags: @master @sanity @regression @web
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add a product to the shopping cart @master @sanity @regression @web', async ({ homePage }) => {
    const product = Helper.getProductDetails();

    const resultsPage = await test.step('1) Search for the product', async () => {
        const page = await homePage.searchForProduct(product.productName);
        expect(await page.isSearchResultsPageExists()).toBeTruthy();
        expect(await page.isProductListed(product.productName)).toBeTruthy();
        return page;
    });

    const productPage = await test.step('2) Verify product details and add the requested quantity', async () => {
        const detailsPage = await resultsPage.openProduct(product.productName);
        expect(await detailsPage.isProductPageExists()).toBeTruthy();
        expect(await detailsPage.isProductPriceDisplayed(product.totalPrice)).toBeTruthy();
        await detailsPage.setQuantity(product.productQuantity);
        const confirmation = await detailsPage.addToCart();
        expect(confirmation).toContain(`You have added ${product.productName}`);
        return detailsPage;
    });

    await test.step('3) Verify the product and quantity in the cart', async () => {
        await productPage.waitForCartSummary(`${product.productQuantity} item(s)`);
        const cartPage = await productPage.openCart();
        expect(await cartPage.isShoppingCartPageExists()).toBeTruthy();
        expect(await cartPage.isProductInCart(product.productName)).toBeTruthy();
        expect(await cartPage.getProductQuantity(product.productName)).toBe(product.productQuantity);
    });

    console.log('✅ Add-to-cart flow completed successfully.');
});
