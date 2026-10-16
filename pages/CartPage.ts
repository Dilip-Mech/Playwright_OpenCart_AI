import { Locator, Page } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.cartHeading = page.getByRole('heading', { name: /^Shopping Cart/ });
    }

    private getProductRow(productName: string): Locator {
        return this.page.getByRole('row')
            .filter({ has: this.page.getByRole('link', { name: productName }) })
            .filter({ has: this.page.locator('input[name^="quantity"]') });
    }

    /**
     * Verifies that the shopping cart page is displayed.
     * @returns Promise<boolean> - true if the cart heading is visible
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        await this.cartHeading.waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Verifies that the named product is in the cart.
     * @param productName - expected cart product name
     * @returns Promise<boolean> - true if the product row is visible
     */
    async isProductInCart(productName: string): Promise<boolean> {
        await this.getProductRow(productName).waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Reads the quantity of the named product in the cart.
     * @param productName - cart product name
     * @returns Promise<string> - current quantity
     */
    async getProductQuantity(productName: string): Promise<string> {
        return this.getProductRow(productName).locator('input[name^="quantity"]').inputValue();
    }

    /**
     * Reads the displayed unit price of the named product.
     * @param productName - cart product name
     * @returns Promise<string> - formatted unit price
     */
    async getProductUnitPrice(productName: string): Promise<string> {
        return this.getProductRow(productName).getByRole('cell').nth(4).innerText();
    }

    /**
     * Reads the displayed cart total.
     * @returns Promise<string> - formatted total
     */
    async getCartTotal(): Promise<string> {
        const totalRow = this.page.getByRole('row')
            .filter({ has: this.page.getByText('Total:', { exact: true }) });
        return totalRow.getByRole('cell').nth(1).innerText();
    }
}
