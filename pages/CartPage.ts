import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly title: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  cartItem(productName: string): Locator {
    return this.page.locator('.cart_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }

  async removeProduct(productName: string): Promise<void> {
    await this.cartItem(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
