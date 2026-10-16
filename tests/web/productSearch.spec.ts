/**
 * Test Case: Product search flow
 *
 * Tags: @master @sanity @regression @web
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search flow @master @sanity @regression @web', async ({ homePage }) => {
    const product = Helper.getProductDetails();

    await test.step('1) Search for a known catalog product', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        const resultsPage = await homePage.searchForProduct(product.productName);
        expect(await resultsPage.isSearchResultsPageExists()).toBeTruthy();
        expect(await resultsPage.isProductListed(product.productName)).toBeTruthy();
    });

    console.log('✅ Product search flow completed successfully.');
});
