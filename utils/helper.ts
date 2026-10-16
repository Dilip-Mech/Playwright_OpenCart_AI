export class Helper {
    static convertPriceToNumber(price: string): number {
        const cleaned = price.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned);
    }

    static getProductDetails() {
        return {
            productName: "MacBook",
            productQuantity: "1",
            totalPrice: "$602.00"
        };
    }

    static getLoginDetails() {
        const email = process.env.APP_EMAIL;
        const password = process.env.APP_PASSWORD;

        if (!email || !password) {
            throw new Error('APP_EMAIL and APP_PASSWORD must be configured for customer login tests.');
        }

        return {
            email,
            password
        };
    }
}