import { Locator, Page } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly accountHeading: Locator;
    private readonly accountMenu: Locator;
    private readonly logoutLink: Locator;
    private readonly logoutHeading: Locator;
    private readonly continueLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.accountHeading = page.locator('#content').getByRole('heading', { name: 'My Account', exact: true });
        this.accountMenu = page.locator('#top').getByText('My Account', { exact: true }).first();
        this.logoutLink = page.getByRole('link', { name: 'Logout', exact: true })
            .filter({ visible: true }).first();
        this.logoutHeading = page.getByRole('heading', { name: 'Account Logout', exact: true });
        this.continueLink = page.getByRole('link', { name: 'Continue', exact: true });
    }

    /**
     * Verifies that the authenticated account dashboard is displayed.
     * @returns Promise<boolean> - true if the account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        await this.accountHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Signs the customer out of the store.
     */
    async logout(): Promise<void> {
        if (!await this.logoutLink.isVisible()) {
            await this.accountMenu.click();
        }
        await this.logoutLink.click();
    }

    /**
     * Verifies that the logout confirmation is displayed.
     * @returns Promise<boolean> - true if logout succeeded
     */
    async isLogoutSuccessful(): Promise<boolean> {
        await this.logoutHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Continues from the logout confirmation to the store homepage.
     */
    async continueAfterLogout(): Promise<void> {
        await this.continueLink.click();
    }
}
