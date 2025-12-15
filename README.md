# Better Auth InstantDB Adapter

A seamless integration between [Better Auth](https://better-auth.com) and [InstantDB](https://www.instantdb.com) that allows you to use InstantDB as your authentication database.

[Better Auth UI Integration](https://better-auth-ui.com/data/instantdb)

- *Own Your Auth*

𝕏 [@daveycodez](https://x.com/daveycodez)

## Installation

```bash
bun add better-auth-instantdb@latest
```

## Features

- 🔐 **Complete Authentication**: Leverage Better Auth's authentication features with InstantDB as your database
- 🔄 **Session Sync**: Automatically synchronize auth sessions between Better Auth and InstantDB
- 🛠️ **Customizable**: Configure the adapter to match your specific needs
- 🧩 **Type-Safe**: Fully typed with TypeScript for improved developer experience

## Usage

### Basic Setup

First you need to add the InstantDB Adapter to your Better Auth config.

#### auth.ts
```typescript
import { betterAuth } from "better-auth"
import { instantAdapter } from "better-auth-instantdb"
import { init } from "@instantdb/admin"
import schema from "@/instant.schema"

// Create InstantDB admin client
export const adminDb = init({
  schema,
  appId: process.env.VITE_INSTANT_APP_ID as string,
  adminToken: process.env.INSTANT_ADMIN_TOKEN,
  useDateObjects: true
})

// Create Better Auth instance with InstantDB adapter
export const auth = betterAuth({
  database: instantDBAdapter({
    db: adminDb,
    usePlural: true, // Optional: set to true if your schema uses plural table names
    debugLogs: false  // Optional: set to true to see detailed logs
  }),
  // Other Better Auth configuration options
  emailAndPassword: {
    enabled: true
  },
})
```

### Client-Side Usage

Synchronize authentication state between Better Auth and InstantDB:

#### providers.tsx
```typescript
import authClient from "@/lib/auth-client"
import { init } from "@instantdb/react"
import { useInstantAuth } from "better-auth-instantdb"

// Initialize InstantDB client
const db = init({ 
    appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID
})

export function Providers({ children }) {
  return (
      <>
        <InstantAuth db={db} authClient={authClient} persistent />

        {children}
      </>
  )
}
```

## InstantDB Schema and Permissions Setup

⚠️ **Important**: You can now use Better Auth cli to generate InstantDB schema, but you must manually configure permissions, for now.

### 1. Create Schema File

Run the following command in terminal:

```bash
npx @better-auth/cli generate
```

### 2. Create Permissions File

Create an `instant.perms.ts` file to secure your schema:

```typescript
// instant.perms.ts
import type { InstantRules } from "@instantdb/react";

const rules = {
  // Prevent creation of new attributes without explicit schema changes
  attrs: {
    allow: {
      $default: "false",
    },
  },
  // Auth entities permissions
  users: {
    bind: ["isOwner", "auth.id != null && auth.id == data.id"],
    allow: {
      view: "isOwner",
      create: "false",
      delete: "false",
      update: "isOwner && (newData.email == data.email) && (newData.emailVerified == data.emailVerified) && (newData.createdAt == data.createdAt)",
    },
  },
  accounts: {
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
    allow: {
      view: "isOwner",
      create: "false",
      delete: "false",
      update: "false",
    },
  },
  sessions: {
    bind: ["isOwner", "auth.id != null && auth.id == data.userId"],
    allow: {
      view: "isOwner",
      create: "false",
      delete: "false",
      update: "false",
    },
  },
  verifications: {
    allow: {
      $default: "false"
    }
  },
  // Optional permissions (public profile example)
  profiles: {
    bind: ["isOwner", "auth.id != null && auth.id == data.id"],
    allow: {
      view: "true",
      create: "false",
      delete: "false",
      update: "isOwner",
    },
  },
  // Add your custom entity permissions here
} satisfies InstantRules;

export default rules;
```

### 3. Push Schema and Permissions to InstantDB

After creating these files, use the InstantDB CLI to push them to your app:

```bash
# Push schema
npx instant-cli@latest push schema

# Push permissions
npx instant-cli@latest push perms
```

### 4. Initialize InstantDB with Your Schema

Update your client-side InstantDB initialization to use your schema:

#### /database/instant.ts
```typescript
import { init } from "@instantdb/react"
import schema from "../../instant.schema"

export const db = init({
    appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID,
    schema
})
```

## API Reference

### `instantDBAdapter(options)`

Creates an adapter that allows Better Auth to use InstantDB as its database.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `db` | `InstantAdminDatabase` | (required) | An InstantDB admin client instance |
| `usePlural` | `boolean` | `true` | Set to `false` if your schema uses singular table names |
| `debugLogs` | `boolean` | `false` | Set to `true` to enable detailed logging |

### `useInstantAuth({ db, useSession })`

A React hook that synchronizes authentication state between Better Auth and InstantDB.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `db` | `InstantReactWebDatabase` | An InstantDB client instance |
| `authClient` | `AuthClient` | The `authClient` from Better Auth |
| `persistent` | `boolean?` | Whether to enable offline persistence for session |

## License

MIT
