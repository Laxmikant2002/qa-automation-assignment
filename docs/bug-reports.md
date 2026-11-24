# Sauce Demo Bug Reports

## BUG-01: Empty Cart Allows a $0.00 Completed Order

- **Title:** Users can proceed to checkout and complete a $0.00 order when the shopping cart is completely empty
- **Severity:** High - Allows invalid $0.00 order creation and bypasses core e-commerce cart validation.
- **Preconditions:** User is logged in as `standard_user` (`secret_sauce`) and the shopping cart contains zero items.
- **Steps to Reproduce:**
  1. Open `https://www.saucedemo.com/cart.html`.
  2. Click **Checkout**.
  3. Enter valid First Name, Last Name, and Postal Code on Checkout Step 1.
  4. Click **Continue**.
  5. Review Checkout Step 2.
  6. Click **Finish**.
- **Expected Result:** Checkout is blocked, an appropriate empty-cart or cart-content error is shown, and no order can be completed.
- **Actual Result:** Checkout proceeds successfully and Step 2 displays `Total: $0.00`, allowing an empty order to be completed.

## BUG-02: Reset App State Leaves Inventory Buttons on Remove

- **Title:** Reset App State clears the cart badge but leaves inventory add/remove buttons stuck on Remove
- **Severity:** Medium - The cart badge and product button state become inconsistent until the inventory page is manually refreshed.
- **Preconditions:** User is logged in; at least one inventory item has been added to the cart.
- **Steps to Reproduce:**
  1. Add an item to the cart from the inventory page.
  2. Open the sidebar menu.
  3. Click **Reset App State**.
  4. Observe the cart badge and the added item's button.
- **Expected Result:** The cart badge is cleared and the inventory button for the added item resets from **Remove** to **Add to cart**.
- **Actual Result:** The cart badge count is cleared, but the inventory button remains labeled **Remove** until the page is manually refreshed.

## BUG-03: Checkout Step 1 Accepts Invalid Name and Postal Code Formats

- **Title:** Your Information fields lack format validation and retain data during backward navigation
- **Severity:** Medium - Invalid personal information can enter the checkout flow, and inconsistent retained data may lead to incorrect order details.
- **Preconditions:** User is logged in and has at least one item in the cart.
- **Steps to Reproduce:**
  1. Open the cart and click **Checkout**.
  2. Enter numeric or special-character values in **First Name** and **Last Name**.
  3. Enter an arbitrary, non-postal string in **Zip/Postal Code**.
  4. Click **Continue**.
  5. Navigate back to Checkout Step 1.
- **Expected Result:** Names accept valid text formats only, Postal Code follows a suitable format for the application context, invalid values are rejected with clear validation errors, and back navigation does not unexpectedly retain data beyond the intended state.
- **Actual Result:** The numeric/special-character names and arbitrary Postal Code are accepted, and previously entered values remain populated when navigating back.
