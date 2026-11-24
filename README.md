# QA Automation Assignment

Playwright TypeScript test suite for:

- Sauce Demo UI flows: https://www.saucedemo.com
- Restful-Booker API flows: https://restful-booker.herokuapp.com

## Setup

```powershell
npm install
npx playwright install --with-deps
```

## Run Tests

```powershell
npm test
npx playwright test
npm run test:ui
npm run test:api
```

The full suite currently contains 16 UI tests and 11 API tests. Tests are independent
and create their own booking data where applicable.

## Project Structure

- `pages/` - Page Object Model classes
- `tests/ui/` - Sauce Demo UI tests
- `tests/api/` - Restful-Booker API tests
- `docs/` - Test plan, bug reports, and AI notes
- `playwright.config.ts` - Playwright configuration
- `.github/workflows/playwright.yml` - GitHub Actions workflow for pull requests and pushes

## Assignment Status

All requested deliverables are included. The local suite and GitHub Actions workflow
pass successfully; no known assignment items remain unfinished.

## Reports

After a run, open the HTML report with:

```powershell
npx playwright show-report
```
