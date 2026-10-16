import { Locator, Page } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly emailField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;
    private readonly loginHeading: Locator;
    private readonly loginWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.emailField = page.getByRole('textbox', { name: 'E-Mail Address', exact: true });
        this.passwordField = page.getByRole('textbox', { name: 'Password', exact: true });
        this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
        this.loginHeading = page.getByRole('heading', { name: 'Returning Customer', exact: true });
        this.loginWarning = page.locator('.alert-danger');
    }

    /**
     * Verifies that the returning-customer login form is displayed.
     * @returns Promise<boolean> - true if the login form heading is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        await this.loginHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Submits the supplied customer credentials without assuming authentication succeeds.
     * @param email - login email, which may be empty
     * @param password - login password, which may be empty
     */
    async submitLogin(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    /**
     * Waits for and reads the login warning when authentication fails.
     * @returns Promise<string> - visible warning text
     */
    async getLoginWarning(): Promise<string> {
        await this.loginWarning.waitFor({ state: 'visible' });
        return this.loginWarning.innerText();
    }

    /**
     * Reads the login warning only when the application displays one.
     * @returns Promise<string> - visible warning text, or an empty string when absent
     */
    async getVisibleLoginWarning(): Promise<string> {
        if (await this.loginWarning.isVisible()) {
            return this.loginWarning.innerText();
        }
        return '';
    }

    /**
     * Reads the email and password values currently present in the login form.
     * @returns Promise<{ email: string; password: string }> - current login field values
     */
    async getLoginFieldValues(): Promise<{ email: string; password: string }> {
        return {
            email: await this.emailField.inputValue(),
            password: await this.passwordField.inputValue()
        };
    }

    /**
     * Authenticates a customer with the supplied credentials.
     * @param email - registered customer email
     * @param password - registered customer password
     * @returns Promise<MyAccountPage> - customer account page object
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        await this.submitLogin(email, password);
        const accountHeading = this.page.locator('#content').getByRole('heading', { name: 'My Account', exact: true });
        await accountHeading.or(this.loginWarning).waitFor({ state: 'visible' });

        if (await this.loginWarning.isVisible()) {
            throw new Error(`Login failed: ${(await this.loginWarning.innerText()).trim()}`);
        }

        return new MyAccountPage(this.page);
    }
}
