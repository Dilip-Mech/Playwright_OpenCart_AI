/**
 * Test Case: Customer logout flow
 *
 * Tags: @master @sanity @regression @web
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Customer logout flow @master @sanity @regression @web', async ({ homePage }) => {
    const credentials = Helper.getLoginDetails();

    const accountPage = await test.step('1) Authenticate the configured customer', async () => {
        const loginPage = await homePage.openLogin();
        const authenticatedAccountPage = await loginPage.login(credentials.email, credentials.password);
        expect(await authenticatedAccountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await homePage.isAuthenticatedAccountNavigationVisible()).toBeTruthy();
        return authenticatedAccountPage;
    });

    await test.step('2) Log out and continue from the confirmation page', async () => {
        await accountPage.logout();
        expect(await accountPage.isLogoutSuccessful()).toBeTruthy();
        await accountPage.continueAfterLogout();
    });

    await test.step('3) Verify the homepage and logged-out navigation', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        expect(await homePage.isLoggedOutAccountNavigationVisible()).toBeTruthy();
    });

    console.log('✅ Customer logout flow completed successfully.');
});
