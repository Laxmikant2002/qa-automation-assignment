import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  productItem(productName: string): Locator {
    return this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }

  async addToCart(productName: string): Promise<void> {
    await this.productItem(productName)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.productItem(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click();
  }

  async logout(): Promise<void> {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }
}
