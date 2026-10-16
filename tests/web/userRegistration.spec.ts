/**
 * Test Case: Customer registration flow
 *
 * Tags: @master @sanity @regression @web
 */

import { test, expect } from '../../fixtures/pageFixtures';

test('Customer registration flow @master @sanity @regression @web', async ({ homePage }) => {
    const { faker } = await import('@faker-js/faker');
    const customer = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `customer-${faker.string.uuid()}@example.com`,
        telephone: faker.string.numeric(10),
        password: faker.internet.password({ length: 12 })
    };

    await test.step('1) Open the store and navigate to registration', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    const registrationPage = await test.step('2) Complete registration with unique customer details', async () => {
        const page = await homePage.openRegistration();
        expect(await page.isRegistrationPageExists()).toBeTruthy();
        await page.completeRegistration(customer);
        expect(await page.isRegistrationSuccessful()).toBeTruthy();
        return page;
    });

    await test.step('3) Verify the new account is available in account navigation', async () => {
        const accountPage = await registrationPage.continueToAccount();
        expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await homePage.isAuthenticatedAccountNavigationVisible()).toBeTruthy();
    });

    console.log('✅ Customer registration flow completed successfully.');
});
