# Social Media Task Manager

## Overview

This is a tiered task management application specifically designed for social media marketing services. The application allows users to select from three different service tiers (Basic, Standard, Premium) and automatically generates monthly recurring task schedules. It features calendar integration with the ability to export schedules in iCalendar (.ics) format for use with Apple Calendar and Google Calendar.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Design**: RESTful API endpoints

### Project Structure
- `client/` - Frontend React application
- `server/` - Backend Express.js application
- `shared/` - Shared TypeScript schemas and types
- `migrations/` - Database migration files

## Key Components

### Service Tiers
The application supports three predefined service tiers:
1. **Basic ($500/month)**: 2 platforms, 8 posts/month, basic analytics
2. **Standard ($1,200/month)**: 4 platforms, 16 posts/month, custom graphics, ad management
3. **Premium ($2,500/month)**: 6 platforms, 30 posts/month, advanced content, influencer collaboration

### Task Management System
- Automatic task generation based on selected tier
- Monthly recurring schedules with smart distribution across the month
- Task categorization (setup, content, engagement, reporting, ads)
- Priority levels (high, medium, low)
- Completion tracking and progress monitoring

### Calendar Integration
- Custom calendar view component for task visualization
- iCalendar (.ics) export functionality for external calendar apps
- Monthly navigation and task scheduling
- Automatic monthly reminders for client reporting

### Database Schema
- **Users**: User authentication and profile management
- **Projects**: Client projects with tier selection and start dates
- **Tasks**: Individual tasks with scheduling, completion status, and metadata

## Data Flow

1. **Tier Selection**: User selects service tier and project details
2. **Task Generation**: System automatically generates monthly recurring tasks based on tier
3. **Task Scheduling**: Tasks are distributed across the month using intelligent scheduling
4. **Progress Tracking**: Users can mark tasks as completed and track progress
5. **Calendar Export**: Users can export schedules to external calendar applications
6. **Monthly Reporting**: Automatic reminders for client report generation

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Data and State Management
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL provider
- **PostgreSQL**: Primary database system

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with tsx for TypeScript execution
- Automatic database schema synchronization with Drizzle

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- ESBuild bundles backend to `dist/index.js` with external packages
- Environment variable configuration for database connections

### Database Management
- Drizzle Kit for schema migrations and database management
- PostgreSQL-compatible deployment with connection pooling
- Automated schema synchronization using `db:push` command

### Scalability Considerations
- Stateless backend design for horizontal scaling
- Client-side caching with TanStack Query reduces server load
- Database indexing on frequently queried fields (project relationships, scheduled dates)