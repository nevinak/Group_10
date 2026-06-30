# Chat App — Frontend

React and Vite app for Chat App, a simple personal dashboard for saving, organizing, and revisiting links.

## What this app does

- Lets users sign in with Clerk.
- Displays a dashboard for managing saved links.
- Supports creating and organizing collections.
- Allows users to mark links as favorites.
- Helps users group links with tags and search by title, URL, or tag.

## Tech stack

- React
- React Router
- Vite
- Tailwind CSS and shadcn/ui
- Clerk authentication

## Prerequisites

- Node.js 22+
- A [Clerk](https://clerk.com) account
- The backend running at `http://localhost:3000`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in this folder:

```env
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
VITE_API_URL="http://localhost:3000"
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown by Vite and sign in.

## Project structure

- `src/main.jsx` sets up Clerk, routing, and UI providers.
- `src/App.jsx` defines the app routes.
- `src/pages/` contains the main pages such as Dashboard, Links, Favorites, Tags, and Collections.
- `src/components/` contains shared UI and form components.
- `src/lib/api.js` sends authenticated requests to the backend.

## Notes

- Keep `.env` out of version control.
- If requests return `401`, make sure the backend is running and `VITE_API_URL` points to the correct server.
