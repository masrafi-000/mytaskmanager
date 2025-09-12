# Task Manager Frontend

This is a [Next.js](https://nextjs.org) project for a task management application with full backend integration.

## Features

- **User Authentication**: Login/Signup with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Real-time API Integration**: Connected to Express.js backend
- **Redux State Management**: Using Redux Toolkit for state management
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Works on desktop and mobile devices

## Backend Integration

This frontend is integrated with the `taskmanagerserver` backend API:

- **Authentication**: `/api/auth/login` and `/api/auth/sign-up`
- **Todo Management**: `/user/todo` (GET and POST)
- **JWT Authentication**: Bearer token authentication
- **CORS Enabled**: Backend configured for frontend communication

## Getting Started

### Prerequisites

1. Make sure the backend server is running on `http://localhost:5000`
2. Node.js and pnpm installed

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend Setup

Make sure your `taskmanagerserver` is running:

```bash
cd ../taskmanagerserver
pnpm install
pnpm dev
```

The backend should be running on `http://localhost:5000`.

## API Integration

The frontend uses the following API endpoints:

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/login` - User login

### Todo Management
- `GET /user/todo` - Fetch user's todos
- `POST /user/todo` - Create new todo
- `PUT /user/todo/:id` - Update existing todo
- `DELETE /user/todo/:id` - Delete todo

All API calls are handled through Redux Toolkit async thunks with proper error handling and loading states. The backend includes proper authentication middleware to ensure users can only access their own todos.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
