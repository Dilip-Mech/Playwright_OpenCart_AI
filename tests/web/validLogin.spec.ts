/**
 * Test Case: Valid customer login flow
 *
 * Tags: @master @sanity @regression @web
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid customer login flow @master @sanity @regression @web', async ({ homePage }) => {
    const credentials = Helper.getLoginDetails();

    await test.step('1) Open the login page', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        const loginPage = await homePage.openLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();

        await test.step('2) Authenticate with configured customer credentials', async () => {
            const accountPage = await loginPage.login(credentials.email, credentials.password);
            expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
            expect(await homePage.isAuthenticatedAccountNavigationVisible()).toBeTruthy();
        });
    });

    console.log('✅ Valid customer login flow completed successfully.');
});
