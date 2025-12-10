# VerifyIt Backend

## Task

Backend API for the VerifyIt application - a NestJS-based server providing authentication, data validation, and business logic services.

## Live Deployment

- **Production URL:** https://verifyit-backend-frhc.onrender.com/
- **API Documentation:** https://verifyit-backend-frhc.onrender.com/swagger/docs

## How to run the app

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run start:dev
```

### Run in production mode

```bash
npm run start:prod
```

### Build project

```bash
npm run build
```

Built files will appear in the `dist/` folder

### Code linting

```bash
npm run lint
```

### Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Folder Structure

### `/src` - Application source code

- **`/modules`** - Feature modules (auth, users, etc.)
- **`/common`** - Shared utilities, decorators, guards, interceptors
- **`/config`** - Configuration files and environment setup
- **`/prisma`** - Database module
- **`main.ts`** - Application entry point

### `/dist` - Built files (generated automatically)

- Production-ready compiled JavaScript files

### `/test` - Test files

- Unit tests and e2e test suites

### `/prisma` - Prisma ORM 

- Prisma ORM schema, migrations and generation

### Other files

- **`nest-cli.json`** - NestJS CLI configuration
- **`tsconfig.json`** - TypeScript settings
- **`package.json`** - Dependencies and scripts
- **`.env`** - Environment variables (not committed to git)
- **`.gitignore`** - Git ignore rules