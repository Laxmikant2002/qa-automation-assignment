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
npm run test:ui
npm run test:api
```

## Project Structure

- `pages/` - Page Object Model classes
- `tests/ui/` - Sauce Demo UI tests
- `tests/api/` - Restful-Booker API tests
- `docs/` - Test plan, bug reports, and AI notes
- `playwright.config.ts` - Playwright configuration

## Reports

After a run, open the HTML report with:

```powershell
npx playwright show-report
```
