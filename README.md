# Project-structure-frontend-role-permission

A Next.js 15 dashboard for managing library data with authentication, role and permission checks, and CRUD workflows for core entities.

## Features

- Auth flow with login and registration
- Role and permission aware UI controls
- Category, author, user, role, and permission management
- Token-based API calls with Axios
- Tailwind CSS v4 styling and responsive layout

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Axios, SweetAlert2, lucide-react

## Project Structure

```
src/
  app/                Next.js routes and layouts
    (auth)/           Login and register
    (dashboard)/      Dashboard pages and UI
  context/            Auth context and permission helpers
  lib/                Axios client configuration
  services/           API service modules
```

## Getting Started

### Prerequisites

- Node.js and npm installed
- Backend API running (default: `http://localhost:8000/api`)

### Install

```bash
npm install
```

### Configure API Base URL

Update `src/lib/api.ts` if your backend is not running at the default URL:

```
baseURL: "http://localhost:8000/api"
```

### Run the App

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint

## API Expectations

This frontend expects a backend that exposes endpoints similar to:

- `POST /login`, `POST /register`, `POST /logout`
- `GET /me` for user + permissions
- `GET/POST/PUT/DELETE /categories`
- `GET/POST/PUT/DELETE /authors`
- `GET/POST/PUT/DELETE /users`
- `GET/DELETE /roles`
- `GET /permissions`

Auth tokens are stored in `localStorage` and attached as `Authorization: Bearer <token>` on requests.

## Deployment

Use `npm run build` and `npm run start`, or deploy with any Next.js compatible host.
