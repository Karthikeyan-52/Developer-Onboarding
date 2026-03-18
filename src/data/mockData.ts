export interface FileNode {
  name: string;
  type: "file" | "folder";
  description?: string;
  children?: FileNode[];
  language?: string;
}

export interface Module {
  name: string;
  path: string;
  description: string;
  importance: "critical" | "important" | "standard";
  connections: string[];
}

export interface PullRequest {
  id: number;
  title: string;
  author: string;
  date: string;
  description: string;
  impact: "high" | "medium" | "low";
  labels: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  roles: ("frontend" | "backend" | "fullstack")[];
  completed: boolean;
}

export const projectStructure: FileNode = {
  name: "acme-platform",
  type: "folder",
  description: "Main project root",
  children: [
    {
      name: "src",
      type: "folder",
      description: "Source code directory",
      children: [
        {
          name: "api",
          type: "folder",
          description: "REST API layer — Express routes and middleware",
          children: [
            { name: "routes.ts", type: "file", language: "typescript", description: "Route definitions for all API endpoints" },
            { name: "middleware.ts", type: "file", language: "typescript", description: "Auth, logging, and rate-limiting middleware" },
            { name: "validators.ts", type: "file", language: "typescript", description: "Request validation schemas using Zod" },
          ],
        },
        {
          name: "components",
          type: "folder",
          description: "Reusable React UI components",
          children: [
            { name: "Dashboard.tsx", type: "file", language: "tsx", description: "Main dashboard layout component" },
            { name: "Sidebar.tsx", type: "file", language: "tsx", description: "Navigation sidebar with collapsible sections" },
            { name: "DataTable.tsx", type: "file", language: "tsx", description: "Generic data table with sorting and filtering" },
          ],
        },
        {
          name: "services",
          type: "folder",
          description: "Business logic and external integrations",
          children: [
            { name: "auth.service.ts", type: "file", language: "typescript", description: "Authentication service using JWT tokens" },
            { name: "payment.service.ts", type: "file", language: "typescript", description: "Stripe payment processing integration" },
            { name: "notification.service.ts", type: "file", language: "typescript", description: "Email and push notification service" },
          ],
        },
        {
          name: "database",
          type: "folder",
          description: "Database models, migrations, and seeds",
          children: [
            { name: "models.ts", type: "file", language: "typescript", description: "Prisma/TypeORM entity definitions" },
            { name: "migrations/", type: "folder", description: "Database migration files" },
            { name: "seed.ts", type: "file", language: "typescript", description: "Development seed data" },
          ],
        },
        {
          name: "utils",
          type: "folder",
          description: "Shared utility functions",
          children: [
            { name: "helpers.ts", type: "file", language: "typescript", description: "Common helper functions" },
            { name: "constants.ts", type: "file", language: "typescript", description: "App-wide constants and config" },
          ],
        },
      ],
    },
    { name: "package.json", type: "file", description: "Project dependencies and scripts" },
    { name: "tsconfig.json", type: "file", description: "TypeScript compiler configuration" },
    { name: ".env.example", type: "file", description: "Environment variables template" },
    { name: "docker-compose.yml", type: "file", description: "Docker services for local development" },
  ],
};

export const modules: Module[] = [
  {
    name: "Authentication Service",
    path: "src/services/auth.service.ts",
    description: "Handles user authentication using JWT tokens. Integrates with the API middleware for route protection. Manages token refresh, session validation, and role-based access control.",
    importance: "critical",
    connections: ["API Middleware", "Database Models", "Notification Service"],
  },
  {
    name: "API Routes",
    path: "src/api/routes.ts",
    description: "Defines all REST API endpoints organized by resource. Uses Express Router with middleware chains for validation and auth checks.",
    importance: "critical",
    connections: ["API Middleware", "Authentication Service", "Request Validators"],
  },
  {
    name: "Payment Service",
    path: "src/services/payment.service.ts",
    description: "Stripe integration for subscription management, one-time payments, and webhook handling. Processes billing events and updates user subscription status.",
    importance: "important",
    connections: ["Database Models", "Notification Service", "API Routes"],
  },
  {
    name: "Dashboard Component",
    path: "src/components/Dashboard.tsx",
    description: "Main dashboard view rendering key metrics, recent activity feed, and quick action cards. Uses React Query for data fetching.",
    importance: "important",
    connections: ["DataTable Component", "Sidebar Component", "API Routes"],
  },
  {
    name: "Database Models",
    path: "src/database/models.ts",
    description: "Entity definitions for Users, Subscriptions, Payments, and Notifications. Includes relations, indexes, and validation decorators.",
    importance: "critical",
    connections: ["Authentication Service", "Payment Service", "API Routes"],
  },
  {
    name: "Notification Service",
    path: "src/services/notification.service.ts",
    description: "Manages email (SendGrid) and push notifications. Supports templated messages, batch sending, and delivery tracking.",
    importance: "standard",
    connections: ["Authentication Service", "Payment Service"],
  },
];

export const pullRequests: PullRequest[] = [
  {
    id: 142,
    title: "Migrate authentication from session-based to JWT",
    author: "sarah.chen",
    date: "2024-11-15",
    description: "Major auth refactor moving from express-session to stateless JWT tokens. Introduced refresh token rotation and improved security headers. All API routes now use the new auth middleware.",
    impact: "high",
    labels: ["breaking-change", "security", "backend"],
  },
  {
    id: 128,
    title: "Add Stripe subscription billing",
    author: "marcus.johnson",
    date: "2024-10-28",
    description: "Integrated Stripe for recurring subscription billing. Added webhook handlers for payment events, subscription lifecycle management, and a billing dashboard component.",
    impact: "high",
    labels: ["feature", "payments", "full-stack"],
  },
  {
    id: 115,
    title: "Implement role-based access control (RBAC)",
    author: "sarah.chen",
    date: "2024-10-10",
    description: "Added granular role-based permissions system. Roles are stored in a separate table with a security-definer function for RLS policy checks. Supports admin, editor, and viewer roles.",
    impact: "high",
    labels: ["security", "backend", "architecture"],
  },
  {
    id: 98,
    title: "Dashboard redesign with new data visualization",
    author: "alex.rivera",
    date: "2024-09-22",
    description: "Complete dashboard UI overhaul using Recharts. Added interactive charts, real-time metrics, and a responsive layout. Performance optimized with React.memo and virtualization.",
    impact: "medium",
    labels: ["frontend", "design", "performance"],
  },
  {
    id: 87,
    title: "Database migration to PostgreSQL",
    author: "marcus.johnson",
    date: "2024-09-05",
    description: "Migrated from MongoDB to PostgreSQL with Prisma ORM. Added comprehensive migration scripts and seed data. Improved query performance with proper indexing.",
    impact: "high",
    labels: ["breaking-change", "database", "backend"],
  },
];

export const onboardingChecklist: ChecklistItem[] = [
  {
    id: "1",
    title: "Clone and set up the repository",
    description: "Clone the repo, install dependencies, and copy .env.example to .env with your local settings.",
    category: "Setup",
    roles: ["frontend", "backend", "fullstack"],
    completed: false,
  },
  {
    id: "2",
    title: "Run the development environment",
    description: "Use docker-compose up to start PostgreSQL and Redis, then run npm run dev for the app server.",
    category: "Setup",
    roles: ["frontend", "backend", "fullstack"],
    completed: false,
  },
  {
    id: "3",
    title: "Understand the project structure",
    description: "Review the folder layout in the Project Structure tab. Focus on understanding how src/ is organized.",
    category: "Exploration",
    roles: ["frontend", "backend", "fullstack"],
    completed: false,
  },
  {
    id: "4",
    title: "Review the Authentication Service",
    description: "Read src/services/auth.service.ts to understand JWT-based auth flow, token refresh, and middleware integration.",
    category: "Exploration",
    roles: ["backend", "fullstack"],
    completed: false,
  },
  {
    id: "5",
    title: "Explore the component library",
    description: "Review src/components/ to understand reusable UI patterns, the design system, and component composition.",
    category: "Exploration",
    roles: ["frontend", "fullstack"],
    completed: false,
  },
  {
    id: "6",
    title: "Read the API routes and middleware",
    description: "Review src/api/routes.ts and middleware.ts to understand endpoint structure and request lifecycle.",
    category: "Exploration",
    roles: ["backend", "fullstack"],
    completed: false,
  },
  {
    id: "7",
    title: "Review key pull requests",
    description: "Read through the highlighted PRs in the Pull Requests tab, especially the JWT migration and RBAC implementation.",
    category: "History",
    roles: ["frontend", "backend", "fullstack"],
    completed: false,
  },
  {
    id: "8",
    title: "Understand the database schema",
    description: "Review src/database/models.ts to understand entity relationships, constraints, and the migration strategy.",
    category: "Exploration",
    roles: ["backend", "fullstack"],
    completed: false,
  },
  {
    id: "9",
    title: "Run the test suite",
    description: "Execute npm test and npm run test:e2e. Review existing test patterns and coverage requirements.",
    category: "Quality",
    roles: ["frontend", "backend", "fullstack"],
    completed: false,
  },
  {
    id: "10",
    title: "Pick up a beginner-friendly issue",
    description: "Check the issues board for tickets labeled 'good-first-issue'. Start with a small bug fix or minor feature.",
    category: "First Contribution",
    roles: ["frontend", "backend", "fullstack"],
    completed: false,
  },
];
