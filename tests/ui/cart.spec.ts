import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('adding one item updates the badge and displays it in the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');

    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.cartItem('Sauce Labs Backpack')).toBeVisible();
  });

  test('adding two items and removing one updates the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

    await inventoryPage.openCart();
    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    await expect(cartPage.cartItem('Sauce Labs Backpack')).toHaveCount(0);
    await expect(cartPage.cartItem('Sauce Labs Bike Light')).toBeVisible();
  });

  test('Continue Shopping returns to inventory and preserves added items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    await expect(
      inventoryPage.productItem('Sauce Labs Backpack')
        .getByRole('button', { name: 'Remove' }),
    ).toBeVisible();
  });

  test('cart items and badge persist after reload', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await page.reload();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.cartItem('Sauce Labs Backpack')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });
});
