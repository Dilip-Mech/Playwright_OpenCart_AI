import { Locator, Page } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export type CustomerRegistrationData = {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
};

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly firstNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly emailField: Locator;
    private readonly telephoneField: Locator;
    private readonly passwordField: Locator;
    private readonly confirmPasswordField: Locator;
    private readonly privacyPolicyCheckbox: Locator;
    private readonly continueButton: Locator;
    private readonly continueLink: Locator;
    private readonly registrationHeading: Locator;
    private readonly registrationSuccessHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.firstNameField = page.getByRole('textbox', { name: '* First Name' });
        this.lastNameField = page.getByRole('textbox', { name: '* Last Name' });
        this.emailField = page.getByRole('textbox', { name: '* E-Mail' });
        this.telephoneField = page.getByRole('textbox', { name: '* Telephone', exact: true });
        this.passwordField = page.getByRole('textbox', { name: '* Password', exact: true });
        this.confirmPasswordField = page.getByRole('textbox', { name: '* Password Confirm', exact: true });
        this.privacyPolicyCheckbox = page.locator('input[name="agree"]');
        this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
        this.continueLink = page.getByRole('link', { name: 'Continue', exact: true });
        this.registrationHeading = page.getByRole('heading', { name: 'Register Account', exact: true });
        this.registrationSuccessHeading = page.getByRole('heading', {
            name: 'Your Account Has Been Created!',
            exact: true
        });
    }

    /**
     * Verifies that the customer registration form is displayed.
     * @returns Promise<boolean> - true if the registration heading is visible
     */
    async isRegistrationPageExists(): Promise<boolean> {
        await this.registrationHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Completes and submits the customer registration form.
     * @param customer - customer details to register
     */
    async completeRegistration(customer: CustomerRegistrationData): Promise<void> {
        await this.firstNameField.fill(customer.firstName);
        await this.lastNameField.fill(customer.lastName);
        await this.emailField.fill(customer.email);
        await this.telephoneField.fill(customer.telephone);
        await this.passwordField.fill(customer.password);
        await this.confirmPasswordField.fill(customer.password);
        await this.privacyPolicyCheckbox.check();
        await this.continueButton.click();
    }

    /**
     * Verifies that the registration confirmation is displayed.
     * @returns Promise<boolean> - true if registration succeeded
     */
    async isRegistrationSuccessful(): Promise<boolean> {
        await this.registrationSuccessHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Continues from registration confirmation to the account dashboard.
     * @returns Promise<MyAccountPage> - customer account page object
     */
    async continueToAccount(): Promise<MyAccountPage> {
        await this.continueLink.click();
        return new MyAccountPage(this.page);
    }
}
