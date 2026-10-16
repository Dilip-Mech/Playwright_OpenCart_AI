/**
 * Test Case: Data-driven customer login
 *
 * Tags: @master @datadriven @web
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginTestData = {
    testName?: string;
    TestName?: string;
    email: string;
    password: string;
    expected: 'success' | 'failure';
};

const loginData = DataProvider.readJson('./testdata/opencart_logindata.json') as LoginTestData[];

const resolveDataValue = (value: string): string => {
    const environmentVariable = value.match(/^\$([A-Z_][A-Z0-9_]*)$/)?.[1];
    if (!environmentVariable) {
        return value.trim();
    }

    const configuredValue = process.env[environmentVariable];
    if (!configuredValue) {
        throw new Error(`${environmentVariable} must be configured to run this login data row.`);
    }
    return configuredValue.trim();
};

for (const [index, data] of loginData.entries()) {
    const testName = data.testName ?? data.TestName ?? `Login data row ${index + 1}`;

    test(`${testName} (row ${index + 1}) @master @datadriven @web`, async ({ homePage }) => {
        const email = resolveDataValue(data.email);
        const password = resolveDataValue(data.password);

        await test.step('1) Open the login form and submit the external test data', async () => {
            const loginPage = await homePage.openLogin();
            expect(await loginPage.isLoginPageExists()).toBeTruthy();

            if (data.expected === 'success') {
                const accountPage = await loginPage.login(email, password);
                expect(await accountPage.isMyAccountPageExists()).toBeTruthy();
            } else {
                await loginPage.submitLogin(email, password);
                if (email === '' || password === '') {
                    const warning = await loginPage.getVisibleLoginWarning();
                    if (warning) {
                        expect(warning)
                            .toMatch(/Warning: (No match for E-Mail Address and\/or Password\.|Your account has exceeded allowed number of login attempts\.)/);
                    }
                    expect(await loginPage.getLoginFieldValues()).toEqual({ email, password });
                } else {
                    expect(await loginPage.getLoginWarning())
                        .toMatch(/Warning: (No match for E-Mail Address and\/or Password\.|Your account has exceeded allowed number of login attempts\.)/);
                }
                expect(await loginPage.isLoginPageExists()).toBeTruthy();
            }
        });

        console.log(`✅ Data-driven login row ${index + 1} completed as expected.`);
    });
}
