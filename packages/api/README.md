# API Package

The `@workspace/api` package will serve as the definitive **"contract"** between the frontend and backend. Its primary role is to define communication protocols, data models, not to house business logic.

- **For the Frontend**: It provides a fully-typed, ready-to-use API client. And the Developer won't need to configure `axios` or `fetch`, manage token refresh logic, or handle request headers manually. Then can simply call methods like `api.auth.login({ username, password })`.
- **For the Backend**: It defines the API request payloads, responses, and URL parameters.

## Architectural Improvement: Token Encapsulation

Following best practices, the management of the accessToken is fully encapsulated within this package. The client-side application does not need to know about the token's existence. It only interacts with high-level methods like login, logout, and checkSession, and receives back a User object upon successful authentication. This decouples the application from the authentication mechanism and enhances security.

## Project Structure

```
.
├── packages/
│   └── api/                  # The core API package
│       ├── src/
│       │   ├── client/         # Frontend API Client
│       │   │   ├── index.ts
│       │   │   ├── instance.ts   # Axios instance and interceptors
│       │   │   └── modules/
│       │   │       └── auth.ts   # Authentication request methods
│       │   ├── types/          # Shared TypeScript definitions (The "Contract")
│       │   │   ├── index.ts
│       │   │   ├── auth.ts
│       │   │   ├── common.ts     # NEW: For BaseResponse
│       │   │   └── user.ts
│       │   └── index.ts          # Main package export
│       └── package.json
└── package.json
└── tsconfig.json
```