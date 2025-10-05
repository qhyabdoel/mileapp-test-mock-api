# MileApp Fullstack Developer Test

## Overview

This project is a **mock Task Management web application** built for the MileApp Fullstack Developer Test.  
It includes a **Vue.js frontend** and a **Node.js (Express + TypeScript)** backend that serves as a **mock API** (no real database).

The application demonstrates full CRUD operations for tasks and a basic authentication flow using a mock token.

---

## Features

### Backend (Mock API)

- Built with **Express** and **TypeScript**
- No real database — data is stored in memory during runtime
- Provides the following endpoints:
  - `POST /login` → returns a mock JWT token
  - `GET /tasks` → supports filtering, sorting, pagination, and meta info
  - `POST /tasks` → create a new task
  - `PUT /tasks/:id` → update an existing task
  - `DELETE /tasks/:id` → delete a task

### Frontend (Vue.js)

Repo: https://github.com/qhyabdoel/mileapp-test-frontend

- Login page with token-based mock authentication
- Protected Task module with full CRUD functionality
- Clean, responsive UI using Tailwind CSS
- Realistic API error handling and loading states

---

## Design Decisions

- **TypeScript** for strong type safety and cleaner code across both frontend and backend
- **Mock API** to simulate real-world behavior (status codes, validation, and error handling)
- **Frontend** designed to easily integrate with different API environments

---

## Deployment

Both the mock API and frontend are deployed for review:

- **Mock API**: [https://mock-api-production.up.railway.app](https://mock-api-production.up.railway.app)
- **Frontend (Vue)**: [https://mileapp-test-frontend-production.up.railway.app/](https://mileapp-test-frontend-production.up.railway.app/)

---

## Database Index Design (MongoDB)

Although this project uses an in-memory mock API, the database design assumes a **MongoDB Task collection**.  
The following indexes were chosen based on the query patterns used in `/tasks`:

| Index Name                 | Fields                         | Purpose                                                    |
| -------------------------- | ------------------------------ | ---------------------------------------------------------- |
| `status_idx`               | `{ status: 1 }`                | Optimizes filtering tasks by status (`find({ status })`)   |
| `createdAt_idx`            | `{ createdAt: -1 }`            | Optimizes sorting tasks by newest first                    |
| `title_idx`                | `{ title: 1 }`                 | Optimizes sorting and searching tasks by title             |
| `status_createdAt_idx`     | `{ status: 1, createdAt: -1 }` | Speeds up combined filtering and sorting queries           |
| `createdAt_pagination_idx` | `{ createdAt: -1, _id: 1 }`    | Improves pagination performance when combined with sorting |

### Why These Indexes

- Filtering and sorting are the most frequent queries in the app
- Compound indexes reduce the need for multiple scans and improve performance for combined filters (`status` + `createdAt`)
- Pagination indexes ensure smooth navigation through large datasets

See the full implementation in [`db/indexes.js`](./db/indexes.js)

---

## Strengths of the Module

- Lightweight and easy-to-deploy **mock API** for frontend integration testing
- **Realistic API design** — supports pagination, filtering, sorting, and proper HTTP codes
- **Scalable architecture** — can easily integrate MongoDB as a real database layer
- **Well-indexed schema** for efficient querying in production

---

## Author

**Kiki Abdulloh**  
Email: [qhyabdoel@gmail.com]  
Whatsapp: +62895422999953
