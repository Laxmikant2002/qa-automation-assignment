# Sauce Demo Checkout Test Plan

## Scope

This plan validates the Sauce Demo purchase flow on [https://www.saucedemo.com](https://www.saucedemo.com):
`Cart -> Your Information -> Overview -> Complete`.

Coverage includes:

- Login and navigation into the inventory and cart pages.
- Adding and removing products and preserving cart state.
- Checkout Step 1 required fields and validation behavior.
- Checkout Overview item totals, 8% tax, and final total.
- Order completion and post-checkout state.
- Logout, browser navigation, page refresh, and sidebar reset behavior.

## Top Risks

1. **Incorrect item subtotal, tax calculation (8%), or final total calculation**: Wrong values can display an incorrect charge.
2. **Empty cart checkout or missing mandatory fields**: Checkout may proceed without items or required customer information.
3. **Session/state corruption**: Cart or UI state may become inconsistent when canceling, navigating back, refreshing, or resetting app state.
4. **Broken behavior on special accounts**: `problem_user`, `error_user`, and `performance_glitch_user` may expose account-specific defects.

## Top 10 Test Cases

| Priority | ID | Test Scenario | Expected Outcome | Automate? (Yes/No) | Reason |
|---|---|---|---|---|---|
| P0 | TC-01 | Complete checkout with two valid items | Exact subtotal, 8% tax, final total, and confirmation are shown | Yes | Highest-value end-to-end checkout validation |
| P0 | TC-02 | Attempt checkout with an empty cart | Checkout is blocked or no $0.00 order is accepted | Yes | Prevents invalid orders and protects checkout integrity |
| P0 | TC-03 | Submit Step 1 with an empty First Name | First Name required error appears and navigation stops | Yes | Core required-field validation |
| P0 | TC-04 | Submit Step 1 with an empty Postal Code | Postal Code required error appears and navigation stops | Yes | Core required-field validation |
| P1 | TC-05 | Add one item and view the cart | Badge becomes `1` and the item appears in `/cart.html` | Yes | Verifies cart-to-checkout entry state |
| P1 | TC-06 | Add two items, then remove one from the cart | Badge becomes `1` and only the remaining item is listed | Yes | Validates dynamic cart updates |
| P1 | TC-07 | Click Continue Shopping from the cart | Inventory opens and previously added items remain in the cart | Yes | Checks navigation and state preservation |
| P1 | TC-08 | Reload while cart items are present | Cart item and badge count persist after reload | Yes | Covers state loss on browser reset |
| P2 | TC-09 | Cancel on Checkout Overview | Return to inventory without losing cart items | Yes | Validates non-destructive checkout cancellation |
| P2 | TC-10 | Exercise `problem_user` and `error_user` flows | Special accounts complete or fail according to supported behavior without unexpected UI or state defects | Yes | Targets known account-specific risk areas |
