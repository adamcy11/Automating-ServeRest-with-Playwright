# ServeRest — UI + API Test Automation with Playwright

This project is a test automation suite covering **UI and API** layers of the **ServeRest** application using **Playwright** with **TypeScript**.

This is a learning and portfolio project focused on building practical skills in test automation with Playwright, applying professional-grade practices such as Page Object Model, API testing with request context, Docker isolation, and CI/CD pipelines.

> Project currently under development — tests and documentation are being added progressively.

![CI](https://github.com/adamcy11/Automating-ServeRest-with-Playwright/actions/workflows/playwright.yml/badge.svg)

## Technologies Used

| Tool              | Purpose                     |
| ----------------- | --------------------------- |
| Playwright        | UI and API test framework   |
| TypeScript        | Test language               |
| Node.js 22        | Runtime                     |
| ServeRest         | Target REST API and UI      |
| Docker            | Isolated test environment   |
| GitHub Actions    | CI/CD pipeline              |
| ESLint + Prettier | Code quality and formatting |

## Getting Started

**Clone and install dependencies**

```bash
git clone https://github.com/adamcy11/Automating-ServeRest-with-Playwright.git

cd Automating-ServeRest-with-Playwright

npm install
```

**Install Playwright browsers**

```bash
npx playwright install
```

**Set up environment variables**

```bash
cp .env.example .env
```

> Edit `.env` with your credentials. Never commit this file.

**Start ServeRest with Docker**

```bash
docker compose up -d
```

> Note: Make sure Node.js 22+ and Docker Desktop are installed before starting.

## Running the Tests

```bash
# Run all tests headless
npm test

# Run with browser visible
npm run test:headed

# Run with interactive UI mode
npm run test:ui

# Open HTML report
npm run test:report

# Type check
npm run typecheck
```

## Folder Structure

```
serverest-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml             # CI/CD pipeline
├── pages/                             # Page Object classes
├── support/
│   ├── types/
│   │   └── serverest.types.ts         # API response interfaces
│   ├── fixtures/                      # Custom Playwright fixtures
│   ├── helpers/                       # Utility functions
│   ├── data/                          # Test data
│   ├── global-setup.ts                # Creates admin user before suite
│   └── global-teardown.ts             # Deletes admin user after suite
├── tests/
│   ├── ui/                            # UI test specs
│   └── api/                           # API test specs
├── docker-compose.yml                 # Isolated environment
├── playwright.config.ts               # Playwright configuration
└── tsconfig.json                      # TypeScript configuration
```
