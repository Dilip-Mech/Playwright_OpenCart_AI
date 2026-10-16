/**
 * Test Case: Invalid customer login flow
 *
 * Tags: @master @sanity @regression @web
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginTestData = {
    email: string;
    password: string;
    expected: 'success' | 'failure';
};

test('Invalid customer login flow @master @sanity @regression @web', async ({ homePage }) => {
    const credentials = (DataProvider.readJson('./testdata/opencart_logindata.json') as LoginTestData[])
        .find(data => data.expected === 'failure' && data.email.trim() && data.password.trim());

    if (!credentials) {
        throw new Error('The external login dataset must contain a failure row with non-blank credentials.');
    }

    await test.step('1) Submit invalid customer credentials', async () => {
        const loginPage = await homePage.openLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        await loginPage.submitLogin(credentials.email, credentials.password);
        expect(await loginPage.getLoginWarning())
            .toMatch(/Warning: (No match for E-Mail Address and\/or Password\.|Your account has exceeded allowed number of login attempts\.)/);
    });

    await test.step('2) Verify the customer remains unauthenticated', async () => {
        expect(await homePage.isLoggedOutAccountNavigationVisible()).toBeTruthy();
    });

    console.log('✅ Invalid customer login was rejected as expected.');
});
