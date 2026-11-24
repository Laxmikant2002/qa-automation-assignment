import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('completes checkout with exact subtotal, tax, and total', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillCustomerDetails({
      firstName: 'Lax',
      lastName: 'Tester',
      postalCode: '411001',
    });
    await checkoutPage.continue();

    await expect(checkoutPage.subtotal).toHaveText('Item total: $39.98');
    await expect(checkoutPage.tax).toHaveText('Tax: $3.20');
    await expect(checkoutPage.total).toHaveText('Total: $43.18');

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('empty first name blocks checkout step one', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomerDetails({
      firstName: '',
      lastName: 'Tester',
      postalCode: '411001',
    });
    await checkoutPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
  });

  test('empty postal code blocks checkout step one', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomerDetails({
      firstName: 'Lax',
      lastName: 'Tester',
      postalCode: '',
    });
    await checkoutPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });

  test('Cancel on checkout step two returns to inventory without losing items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomerDetails({
      firstName: 'Lax',
      lastName: 'Tester',
      postalCode: '411001',
    });
    await checkoutPage.continue();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
  });

  test('empty cart reproduces the $0.00 order bug', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.goto('https://www.saucedemo.com/cart.html');
    await cartPage.checkout();
    await checkoutPage.fillCustomerDetails({
      firstName: 'Lax',
      lastName: 'Tester',
      postalCode: '411001',
    });
    await checkoutPage.continue();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutPage.total).toHaveText('Total: $0.00');
  });
});
