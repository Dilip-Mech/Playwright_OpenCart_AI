/**
 * Test Case: Complete customer shopping journey
 *
 * Tags: @master @sanity @regression @web @end-to-end
 *
 * Steps:
 * 1) Register a customer with unique details
 * 2) Verify registration, log out, and log back in
 * 3) Search for MacBook and open its details
 * 4) Add the product to the cart and validate the cart contents and total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Complete end-to-end shopping flow @master @sanity @regression @web @end-to-end', async ({
    page,
    homePage,
}) => {
    const product = Helper.getProductDetails();
    // Faker is ESM-only while the current Playwright runner loads tests as CommonJS.
    const { faker } = await import('@faker-js/faker');
    const customer = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `customer-${faker.string.uuid()}@example.com`,
        telephone: faker.string.numeric(10),
        password: faker.internet.password({ length: 12 }),
    };
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', message => {
        if (message.type() === 'error') {
            consoleErrors.push(message.text());
        }
    });
    const registerPage = await test.step('1) Open the store and register a unique customer', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();

        const registrationPage = await homePage.openRegistration();
        await registrationPage.completeRegistration(customer);
        expect(await registrationPage.isRegistrationSuccessful()).toBeTruthy();
        return registrationPage;
    });

    await test.step('2) Log out after registration', async () => {
        const accountPage = await registerPage.continueToAccount();
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
        await accountPage.logout();
        expect(await accountPage.isLogoutSuccessful()).toBeTruthy();
    });

    await test.step('3) Log in again with the registered credentials', async () => {
        const loginPage = await homePage.openLogin();
        const accountPage = await loginPage.login(customer.email, customer.password);
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
    });

    const productPage = await test.step('4) Search for MacBook and open its details', async () => {
        const resultsPage = await homePage.searchForProduct(product.productName);
        expect(await resultsPage.isSearchResultsPageExists()).toBeTruthy();

        const detailsPage = await resultsPage.openProduct(product.productName);
        expect(await detailsPage.isProductPageExists()).toBeTruthy();
        expect(await detailsPage.isProductPriceDisplayed(product.totalPrice)).toBeTruthy();
        return detailsPage;
    });

    await test.step('5) Add the product to the cart', async () => {
        await productPage.addToCart();
        await productPage.waitForCartSummary('1 item(s)');
        expect(await productPage.getCartSummary()).toContain('1 item(s)');
        expect(await productPage.getCartSummary()).toContain(product.totalPrice);
    });

    await test.step('6) Verify cart product, quantity, price, and total', async () => {
        const cartPage = await productPage.openCart();

        expect(await cartPage.isShoppingCartPageExists()).toBeTruthy();
        expect(await cartPage.isProductInCart(product.productName)).toBeTruthy();
        expect(await cartPage.getProductQuantity(product.productName)).toBe(product.productQuantity);
        expect(await cartPage.getProductUnitPrice(product.productName)).toBe(product.totalPrice);
        expect(await cartPage.getCartTotal()).toBe(product.totalPrice);
    });

    await test.step('7) Confirm the journey completed without browser errors', async () => {
        expect(pageErrors).toEqual([]);
        expect(consoleErrors).toEqual([]);
    });

    console.log('✅ Complete end-to-end shopping flow finished successfully.');
});
