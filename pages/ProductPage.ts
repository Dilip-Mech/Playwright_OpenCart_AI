import { Locator, Page } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly productHeading: Locator;
    private readonly quantityField: Locator;
    private readonly addToCartButton: Locator;
    private readonly cartSummaryButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.productHeading = page.getByRole('heading', { name: 'MacBook', exact: true });
        this.quantityField = page.locator('input[name="quantity"]');
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart', exact: true });
        this.cartSummaryButton = page.getByRole('button', { name: /item\(s\) - \$/ });
    }

    /**
     * Verifies the requested product details page is displayed.
     * @returns Promise<boolean> - true if the product heading is visible
     */
    async isProductPageExists(): Promise<boolean> {
        await this.productHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Verifies that the expected price is displayed on the product page.
     * @param price - expected formatted price
     * @returns Promise<boolean> - true if the price is visible
     */
    async isProductPriceDisplayed(price: string): Promise<boolean> {
        await this.page.getByText(price, { exact: true }).waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Sets the requested product quantity.
     * @param quantity - quantity to add to the cart
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.quantityField.fill(quantity);
    }

    /**
     * Adds the displayed product to the shopping cart and reads the server confirmation.
     * @returns Promise<string> - product-added confirmation from OpenCart
     */
    async addToCart(): Promise<string> {
        const responsePromise = this.page.waitForResponse(response =>
            response.request().method() === 'POST' && response.url().includes('route=checkout/cart/add')
        );
        await this.addToCartButton.click();
        const response = await responsePromise;
        const result: { success?: string; error?: string } = await response.json();
        if (!result.success) {
            throw new Error(`OpenCart did not confirm adding the product to the cart: ${result.error ?? 'no success message returned'}`);
        }
        return result.success.replace(/<[^>]*>/g, '');
    }

    /**
     * Reads the header's current cart summary.
     * @returns Promise<string> - visible cart summary text
     */
    async getCartSummary(): Promise<string> {
        return this.cartSummaryButton.innerText();
    }

    /**
     * Waits for the cart summary to contain the expected text.
     * @param summaryText - text expected in the cart summary
     */
    async waitForCartSummary(summaryText: string): Promise<void> {
        await this.cartSummaryButton.filter({ hasText: summaryText }).waitFor({ state: 'visible' });
    }

    /**
     * Opens the shopping cart from the header cart menu.
     * @returns Promise<CartPage> - shopping cart page object
     */
    async openCart(): Promise<CartPage> {
        await this.cartSummaryButton.click();
        await this.page.getByRole('link', { name: 'View Cart' }).click();
        return new CartPage(this.page);
    }
}
