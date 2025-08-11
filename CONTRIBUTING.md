# Contributing Guide

## Prerequisites

Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20 or higher)
- [pnpm](https://pnpm.io/) (recommended)

## Getting Started

1. Fork the Repository
   First, fork the repository to your GitHub account. This will create your own copy of the repository.

2. Clone the Repository
   Clone the repository you just forked to your local machine:

```bash
git clone https://github.com/your-username/hawk-tracker.git
cd hawk-tracker
```

3. Add Upstream Remote
   To keep your repository in sync with the original repository, add the upstream remote:

```bash
git remote add upstream https://github.com/gshan-1/hawk-tracker.git
```

4. Create a New Branch
   Before you start working, make sure to create a new branch:

```bash
git checkout -b <type>/<desc>
```

Replace `<type>` with the type of change you are making (e.g., `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`).
Replace `<desc>` with the issue description you are working on (e.g., `api`).

## Development Workflow

1. Install Dependencies
   Before you start developing, install all dependencies:

```bash
pnpm install
```

2. Run the Project
   To ensure you are developing in a properly running environment, start the project:

```bash
pnpm dev
```

Replace `<desc>` with the issue description you are working on (e.g., `api`).

3. Globally Link the Project
   To conveniently use and test your scaffold commands during development, you can globally link your project using pnpm link --global:

```bash
pnpm link --global
```

This way, you can use your scaffold commands anywhere without having to run them from the project directory each time.

## Development Guidelines

Please follow these development guidelines:

Ensure code is clear and concise.
Follow the project's code style and standards (you can use ESLint and Prettier).
If you add new features, please write corresponding tests.
If you fix bugs, please add tests to prevent them from reoccurring.

## Commit Changes

Before committing your changes, make sure you have properly formatted and linted the code:

```bash
pnpm lint
pnpm format
```

Then commit your changes:

```bash
git add .
pnpm commit
```

Replace `<desc>` with the issue description you are working on (e.g., `api`).

## Sync Your Branch

Before you submit your changes, make sure your branch is up to date:

```bash
git fetch upstream
git rebase upstream/develop
```

## Push Your Branch

Push your branch to your own repository:

```bash
git push origin <type>/<desc>
```

Replace `<desc>` with the issue description you are working on (e.g., `api`).

## Create a Pull Request

On GitHub, navigate to your forked repository and click the "Compare & pull request" button. Make sure to describe your changes in detail.
