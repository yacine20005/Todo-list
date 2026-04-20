# Angular Todo List - University Project

This repository gathers practical work sessions (TPs) completed during the **Angular course at Universite Gustave Eiffel**.

It showcases my ability to design and build a modern front-end application with real API interactions, clean component architecture, and user-focused feedback.

## Learning Outcomes

- Solid Angular fundamentals (components, services, data binding, pipes, forms)
- Real-world CRUD integration with a remote REST API
- Reusable component design and event-driven communication
- Attention to UX through notifications and immediate interaction feedback
- Ability to write and maintain testable code in a structured project

## Features

- Add a task
- Edit task labels
- Mark tasks as done / not done
- Delete tasks
- Display creation dates using a custom date pipe
- Show contextual toast messages for success, info, warning, and error states

## Tech Stack

- **Framework:** Angular 21
- **Language:** TypeScript
- **UI Libraries:** PrimeNG, Materialize CSS
- **Reactive Programming:** RxJS
- **API:** REST endpoint (CRUD operations)

## Architecture Overview

- `src/app/todolist/`: main feature component that manages task collection and user actions
- `src/app/task/`: reusable task item component with edit/toggle/delete events
- `src/app/services/todo.service.ts`: API communication layer (GET, POST, PUT, DELETE)
- `src/app/custom-date.pipe.ts`: presentation formatting for task dates
- `src/app/model/ModelTask.ts`: shared task data contract

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm start
```

Then open:

`http://localhost:4200/`

### 3. Run tests

```bash
npm test
```

### 4. Build for production

```bash
npm run build
```

## Scripts

- `npm start` - Run the Angular dev server
- `npm test` - Execute unit tests
- `npm run build` - Build application bundles
- `npm run watch` - Build in watch mode (development)

## Academic Context

This project was developed as part of multiple supervised practical sessions (TPs) in the Angular curriculum at **Universite Gustave Eiffel**.

The objective was not only to make a working app, but also to apply best practices in component organization, service abstraction, and maintainable front-end development.
