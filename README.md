# ServeRest — UI + API Test Automation with Playwright

This project automates the **ServeRest** application covering both API and UI layers.
It validates REST endpoints and browser flows through isolated, reproducible tests
powered by Docker and TypeScript.

Continuous Integration is configured with **GitHub Actions**, running all tests
automatically on every push with ServeRest served as a Docker service container.

This is a portfolio project focused on applying real-world practices: Page Object Model,
API request contexts, fixture-based authentication, and CI/CD pipelines.

[![CI](https://github.com/adamcy11/Automating-ServeRest-with-Playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/adamcy11/Automating-ServeRest-with-Playwright/actions/workflows/playwright.yml)

## Technologies Used

| Tool | Purpose |
|---|---|
| Playwright 1.60 | API and UI test framework |
| TypeScript | Type-safe test language |
| Node.js 22 | Runtime |
| Docker | Isolated ServeRest environment |
| GitHub Actions | CI/CD pipeline |
| Faker.js | Dynamic test data generation |
| ESLint + Prettier | Code quality and formatting |
| dotenv | Environment variable management |

## Architecture & Patterns

- **Page Object Model (POM)** — each page has a dedicated class with `private readonly` locators initialized in the constructor, encapsulating selectors, actions, and assertions
- **Fixture Pattern** — `apiAsAdmin` and `authenticatedPage` fixtures handle authentication setup and teardown, keeping test bodies clean and focused
- **Playwright Project Dependency** — `api-setup` and `api-teardown` run exclusively as scoped dependencies of the API project, keeping UI tests fully independent from Docker
- **Assertion methods in Page Object** — `checkHomePage()`, `checkEmailBlankError()`, `checkInvalidCredentialsError()` encapsulate assertions inside the page class following a single-responsibility approach
- **Constants for messages** — UI error strings centralized in `support/constants/messages.ts`, decoupled from test logic
- **Data Factories** — `buildUser()` and `buildProduct()` generate realistic random data per execution using Faker.js to avoid collisions and simulate real-world usage
- **Environment Variables** — credentials managed via `.env` locally and GitHub Secrets in CI

## CI/CD Pipeline

The GitHub Actions pipeline runs on every push to `main` and `develop`, and on pull requests:

1. **Checkout** — clones the repository
2. **Setup Node** — prepares Node.js 22
3. **Start ServeRest** — Docker service container spins up automatically before any step runs
4. **Install dependencies** — `npm ci` for reproducible installs
5. **Type check** — `tsc --noEmit` catches type errors before running tests
6. **Install Playwright** — installs Chromium and system dependencies
7. **Run tests** — executes API and UI suites; API depends on Docker, UI targets `front.serverest.dev`
8. **Upload report** — saves Playwright HTML report as a CI artifact

## Getting Started

**Prerequisites:** Node.js 22+, Docker

```bash
git clone https://github.com/adamcy11/Automating-ServeRest-with-Playwright
cd Automating-ServeRest-with-Playwright
npm install
```

**Configure environment variables**

Create a `.env` file in the project root:

```env
BASE_URL=http://localhost:3000
ADMIN_EMAIL=fulano@qa.com
ADMIN_PASSWORD=teste

UI_BASE_URL=https://front.serverest.dev
UI_ADMIN_EMAIL=fulano@qa.com
UI_ADMIN_PASSWORD=teste
```

> Never commit the `.env` file — it is already in `.gitignore`.

**Start ServeRest locally**

```bash
docker compose up -d
```

> Note: Docker is only required for API tests. UI tests target `front.serverest.dev` directly.

## Running the Tests

```bash
# Run all tests (API + UI)
npm test

# API tests only (requires Docker)
npx playwright test --project=api

# UI tests only
npx playwright test --project=ui

# Open interactive UI mode
npm run test:ui

# View last HTML report
npm run test:report
```

> Running `npm test` with Docker off will skip API tests gracefully and run UI tests normally.

## Folder Structure

```
├── pages/                        # Page Object classes
│   ├── LoginPage.ts
│   └── HomePage.ts
├── tests/
│   ├── api/                      # API test specs
│   │   └── usuarios.spec.ts
│   └── ui/                       # UI test specs
│       └── login.spec.ts
├── support/
│   ├── constants/
│   │   └── messages.ts           # UI error message constants
│   ├── data/                     # Test data factories
│   │   ├── credentials.ts
│   │   ├── products.ts
│   │   └── user.ts
│   ├── fixtures/                 # Playwright fixtures
│   │   ├── api.fixture.ts        # apiAsAdmin authenticated context
│   │   └── ui.fixture.ts         # authenticatedPage fixture
│   ├── helpers/
│   │   └── auth-file.ts
│   ├── types/
│   │   └── serverest.types.ts    # API response interfaces
│   ├── global-setup.ts           # Creates admin user before API tests
│   └── global-teardown.ts        # Deletes admin user after API tests
├── .github/workflows/
│   └── playwright.yml            # CI/CD pipeline
├── docker-compose.yml
├── playwright.config.ts
└── .env                          # Local environment variables (not committed)
```

## Test Scenarios

**API — /usuarios**
- Create a user successfully with valid data
- Reject creation with a duplicate email
- Reject creation when required fields are missing
- List all users
- Get a user by ID
- Return validation error for malformed ID
- Return error for non-existent ID
- Filter users by email query param
- Update an existing user successfully
- Upsert when ID does not exist
- Reject update to an already used email
- Delete an existing user successfully
- Return success when deleting a non-existent ID

**UI — Login**
- Login successfully with valid credentials
- Logout successfully
- Show error when email is empty
- Show error when password is empty
- Show error with invalid credentials
