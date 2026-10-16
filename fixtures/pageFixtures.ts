import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ProductPage } from '../pages/ProductPage';
import { RegisterPage } from '../pages/RegisterPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL;

if (!APP_URL) {
    throw new Error('WEB_APP_URL must be set to run web tests.');
}

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    myAccountPage: MyAccountPage;
    searchResultsPage: SearchResultsPage;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});

test.afterEach(async ({ page, context }) => {
    if (!page.isClosed()) {
        await page.close();
    }
    await context.close();
});

export { expect } from '@playwright/test';
