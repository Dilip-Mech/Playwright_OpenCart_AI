import { Locator, Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { SearchResultsPage } from './SearchResultsPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly logo: Locator;
    private readonly searchBox: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.logo = page.locator('#logo');
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
    }

    /**
     * Verifies that the store home page is displayed.
     * @returns Promise<boolean> - true if the store logo is visible
     */
    async isHomePageExists(): Promise<boolean> {
        await this.logo.waitFor({ state: 'visible' });
        return true;
    }

    /**
    * Opens the registration page using the OpenCart route.
     * @returns Promise<RegisterPage> - registration page object
     */
    async openRegistration(): Promise<RegisterPage> {
        await this.page.goto(new URL('index.php?route=account/register', this.page.url()).toString());
        return new RegisterPage(this.page);
    }

    /**
    * Opens the login page using the OpenCart route.
     * @returns Promise<LoginPage> - login page object
     */
    async openLogin(): Promise<LoginPage> {
        await this.page.goto(new URL('index.php?route=account/login', this.page.url()).toString());
        return new LoginPage(this.page);
    }

    /**
     * Verifies that authenticated account navigation is available.
     * @returns Promise<boolean> - true when My Account and Logout are visible
     */
    async isAuthenticatedAccountNavigationVisible(): Promise<boolean> {
        return await this.page.getByRole('link', { name: 'My Account', exact: true }).first().isVisible()
            && await this.page.getByRole('link', { name: 'Logout', exact: true }).first().isVisible();
    }

    /**
     * Verifies that logged-out account navigation is available.
     * @returns Promise<boolean> - true when Register and Login are visible
     */
    async isLoggedOutAccountNavigationVisible(): Promise<boolean> {
        const registerLinks = this.page.getByRole('link', { name: 'Register', exact: true }).filter({ visible: true });
        const loginLinks = this.page.getByRole('link', { name: 'Login', exact: true }).filter({ visible: true });

        if (await registerLinks.count() > 0 && await loginLinks.count() > 0) {
            return true;
        }

        const accountMenu = this.page.locator('#top').getByText('My Account', { exact: true }).first();
        if (await accountMenu.isVisible()) {
            await accountMenu.click();
        }

        return await registerLinks.count() > 0 && await loginLinks.count() > 0;
    }

    /**
     * Searches the catalog for a product.
     * @param productName - product name to search for
     * @returns Promise<SearchResultsPage> - search results page object
     */
    async searchForProduct(productName: string): Promise<SearchResultsPage> {
        await this.searchBox.fill(productName);
        await this.searchBox.press('Enter');
        return new SearchResultsPage(this.page);
    }
}
