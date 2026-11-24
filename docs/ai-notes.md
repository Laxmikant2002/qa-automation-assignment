# AI Assistance Notes

## Tools Used

- GitHub Copilot was used to scaffold Playwright TypeScript Page Objects, generate test suites, and organize Restful-Booker API fixtures and assertions.
- AI assistance was also used to brainstorm positive, negative, and edge cases for checkout, cart, logout, and API workflows.

## Where AI Helped

- Created reusable POM classes around Sauce Demo's `data-test` locators.
- Generated the initial 16 UI test structure and 11 Restful-Booker API tests.
- Suggested test data isolation using unique booking fields and independent test setup.
- Helped organize the test plan and bug report Markdown files.

## Example: AI Was Wrong

AI initially suggested using generic CSS locators such as `.btn_primary` and `networkidle`-style synchronization for parts of the test flow. Running and reviewing the application showed that Sauce Demo exposes stable `data-test` attributes and Playwright's click and assertion auto-waiting are sufficient. The implementation was corrected to use exact `data-test` selectors and web-first assertions.

AI also assumed a missing Restful-Booker authorization token might return `401 Unauthorized` for `PUT` requests. The assignment notes and public API behavior indicate `403 Forbidden` for missing auth; the negative API assertion was therefore set to require `403`.
