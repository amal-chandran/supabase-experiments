# supabase-start

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, and more.

## Tech Stack

### Frontend

- **React** - UI library
- **TypeScript** - Type safety and improved developer experience
- **Vite** - Fast build tool and dev server
- **TanStack Router** - File-based routing with full type safety
- **TanStack Query** - Data fetching and state management
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components built on Radix UI
- **Better-Auth** - Authentication library
- **Supabase JS** - Supabase client library

### Backend

- **Hono** - Lightweight, performant server framework
- **Node.js** - Runtime environment
- **Better-Auth** - Authentication server
- **TypeScript** - Type safety

### Database & ORM

- **PostgreSQL** - Database engine
- **Supabase** - PostgreSQL hosting and management
- **Drizzle ORM** - TypeScript-first ORM for database operations
- **Drizzle Kit** - Database migration and introspection tool

### DevOps & Tooling

- **Turborepo** - Optimized monorepo build system
- **npm** - Package manager

## Better Auth vs Supabase Auth

For a comprehensive feature-by-feature comparison between Better Auth and Supabase Auth, see [COMPARISON.md](./COMPARISON.md).

## Why I Made These Choices

This section explains the rationale behind the key technology decisions in this project.

### Drizzle ORM

- **Schema as Code**: Drizzle allows managing database schema as TypeScript code, providing version control, code review, and better collaboration on database changes.
- **Cross-Platform Compatibility**: The same schema definitions can be used for transactions in Deno as well, providing flexibility across different runtime environments.
- **AI-Friendly**: Drizzle's schema definitions provide full context to AI tools, making it easier to get accurate code suggestions and assistance.
- **Type Inference**: Excellent TypeScript type inference ensures type safety throughout the application, reducing runtime errors and improving developer experience.

### Better Auth

- **Plugin Ecosystem**: Better Auth's extensive plugin system offers unparalleled customization and extensibility compared to integrated authentication solutions. This allows for easy integration of additional features without modifying core authentication logic.
- **OAuth Access Token Management**: Better Auth handles [OAuth access tokens](https://www.better-auth.com/docs/concepts/oauth#get-access-token) as part of the authentication system itself, making it seamless to work with third-party services that require OAuth tokens.
- **Payment Integration**: The [Stripe plugin](https://www.better-auth.com/docs/plugins/stripe) makes it straightforward to integrate payment providers, handling customer creation, subscription management, and webhook processing out of the box.
- **Passkey Support**: If needed, we can easily integrate [expo-passkey](https://github.com/iosazee/expo-passkey) with Better Auth for modern WebAuthn-based authentication, providing a passwordless authentication option.

## Project Structure

```
supabase-start/
├── apps/
│   └── web/                    # Frontend application (React + Vite + TanStack Router)
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── routes/         # TanStack Router routes
│       │   └── lib/            # Utilities and hooks
│       └── package.json
├── packages/
│   ├── auth/                   # Authentication package (Better-Auth + Hono)
│   │   ├── src/
│   │   │   ├── auth.ts         # Better-Auth configuration
│   │   │   ├── app.ts          # Hono app setup
│   │   │   └── schema.ts       # Database schema
│   │   └── package.json
│   └── backend/                # Backend package (Supabase + Drizzle)
│       ├── src/
│       │   └── schema/         # Drizzle schema definitions
│       ├── supabase/
│       │   ├── migrations/     # Database migrations
│       │   └── signing_key.base # Base64 encoded signing key
│       ├── scripts/
│       │   └── generate-signing-key.ts
│       └── package.json
├── package.json                # Root package.json (monorepo config)
└── turbo.json                  # Turborepo configuration
```

## How to Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v10 or higher)
- Supabase CLI (for local development)

### Setup Steps

1. **Clone the repository and install dependencies:**

   ```bash
   git clone <repository-url>
   cd supabase-start
   npm install
   ```

2. **Generate signing key (inside backend package):**

   ```bash
   cd packages/backend
   npm run generate:signing-key
   ```

   This will create `signing_key.base` and `signing_key.json` files in `packages/backend/supabase/`.

3. **Set up environment variables:**
   - In `packages/auth/`, replicate the `.env.example` file to `.env`:
     ```bash
     cd packages/auth
     cp .env.example .env
     ```
   - Add `SUPABASE_SIGNING_KEY` to `packages/auth/.env`:
     - Read the content from `packages/backend/supabase/signing_key.base`
     - Add it as: `SUPABASE_SIGNING_KEY=<content-from-signing_key.base>`

4. **Get Supabase connection details:**

   ```bash
   cd packages/backend
   npm run start
   ```

   This will display the Supabase API URL and anon/public key.

5. **Update environment variables:**
   - In `apps/web/.env`, set `VITE_SUPABASE_PUBLISHABLE_KEY` to the anon/public key from step 4
   - Also update `VITE_SUPABASE_URL` with the API URL from step 4

6. **Reboot Supabase (after generating signing key):**

   ```bash
   cd packages/backend
   npm run reboot
   ```

   This stops and restarts the local Supabase instance to apply the new signing key.

7. **Start development servers:**
   ```bash
   npm run dev
   ```

The web application will be available at [http://localhost:3001](http://localhost:3001) and the API/auth server will be running at [http://localhost:3000](http://localhost:3000).

## Database Migrations

This project uses **Drizzle ORM** combined with **Supabase** for managing database migrations. This combination allows for easy migration management and database resets.

### Generating Migrations

**Option 1: Custom migration (for seed data or custom SQL):**

```bash
cd packages/backend
drizzle-kit generate --custom --name=create-bucket
```

**Option 2: Schema-based migration (recommended for schema changes):**

1. Update the schema files in `packages/backend/src/schema/`
2. Generate migration:
   ```bash
   npm run db:generate
   ```

### Applying Migrations

To push migrations to the database:

```bash
npm run db:migrate
```

### Database Reset

To reset the database to a fresh state (useful during development):

```bash
cd packages/backend
npm run db:reset
```

This will drop all tables and reapply all migrations from scratch.

## Available Scripts

### Root Level

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications
- `npm run dev:web` - Start only the web application
- `npm run dev:server` - Start only the server
- `npm run check-types` - Check TypeScript types across all apps
- `npm run db:generate` - Generate database migrations from schema
- `npm run db:migrate` - Apply database migrations

### Backend Package (`packages/backend`)

- `npm run generate:signing-key` - Generate JWT signing key for Supabase
- `npm run status` - Show Supabase local instance status
- `npm run dev` - Start Supabase local instance
- `npm run reboot` - Stop and restart Supabase local instance
- `npm run db:reset` - Reset database to fresh state

### Auth Package (`packages/auth`)

- `npm run dev` - Start auth server in development mode
- `npm run build` - Build auth package

## Deployment

### Hosting on Vercel

This project is designed to be deployed on Vercel:

- **Web App (Frontend)**: Deploy using [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- **Auth Server (Backend)**: Deploy using [Hono on Vercel](https://vercel.com/docs/frameworks/backend/hono)

#### Deployment Steps

1. **Connect your repository to Vercel**
2. **Configure build settings:**
   - Root directory: Leave as default (or set to project root)
   - Build command: `npm run build`
   - Output directory: Set per app (e.g., `apps/web/dist` for web app)

3. **Set environment variables in Vercel:**
   - Add all required environment variables from `.env.example` files
   - For production, use your production Supabase credentials

4. **Deploy:**
   - Vercel will automatically detect and deploy both the frontend and backend
   - The auth server (Hono) will be deployed as Vercel Functions
   - The web app (Vite) will be deployed as static assets with client-side routing

For more details, refer to:

- [Hono on Vercel Documentation](https://vercel.com/docs/frameworks/backend/hono)
- [Vite on Vercel Documentation](https://vercel.com/docs/frameworks/frontend/vite)

## References

The following resources were helpful in developing this solution:

- [Better Auth Discord Discussion](https://discord.com/channels/839993398554656828/1435439475261050880) - Community discussion on Better Auth implementation
- [Better Auth JWT Plugin Documentation](https://www.better-auth.com/docs/plugins/jwt#usage) - Guide for implementing JWT tokens with Better Auth
- [Supabase Clerk Integration](https://supabase.com/partners/integrations/clerk) - Reference for integrating third-party auth with Supabase RLS
