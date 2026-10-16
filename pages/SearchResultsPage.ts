import { Locator, Page } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly searchResultsHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.searchResultsHeading = page.getByRole('heading', { name: /^Search - / });
    }

    /**
     * Opens a product from the search results.
     * @param productName - exact product name
     * @returns Promise<ProductPage> - product details page object
     */
    async openProduct(productName: string): Promise<ProductPage> {
        await this.page.getByRole('heading', { name: productName, exact: true })
            .getByRole('link', { name: productName, exact: true })
            .click();
        return new ProductPage(this.page);
    }

    /**
     * Verifies that the named product is present in the search results.
     * @param productName - expected exact product name
     * @returns Promise<boolean> - true if the product heading is visible
     */
    async isProductListed(productName: string): Promise<boolean> {
        await this.page.getByRole('heading', { name: productName, exact: true }).waitFor({ state: 'visible' });
        return true;
    }

    /**
     * Verifies that the search results page is displayed.
     * @returns Promise<boolean> - true if the search results heading is visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        await this.searchResultsHeading.waitFor({ state: 'visible' });
        return true;
    }
}
