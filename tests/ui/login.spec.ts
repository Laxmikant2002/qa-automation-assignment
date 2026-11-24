import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Login', () => {
  test('valid login redirects to inventory and shows Products', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('valid username with invalid password shows a credentials error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'invalid_password');

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match',
    );
  });

  test('locked out user shows a locked-out error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out',
    );
  });

  test('empty credentials show the username required error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required',
    );
  });

  test('empty username is rejected even when a password is supplied', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('', 'secret_sauce');

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required',
    );
  });

  test('direct inventory navigation redirects to login with an access error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const loginPage = new LoginPage(page);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toContainText(
      "Epic sadface: You can only access",
    );
  });
});
