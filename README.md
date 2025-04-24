# Todo List App

A simple Todo List application built with Next.js and Material UI components.

## Features

- Create, read, update, and delete todo items
- Responsive design using MUI components
- Optimized for both development and production environments

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm
- Docker (optional)

### Installation

Clone this repository:

```
git clone <https://github.com/nisibz/nextjs-todo-list-tests.git>
cd nextjs-todo-list-tests
```

## Development Mode

### Local Setup

1. Install dependencies:

```
   npm install
```

2. Start the development server:

```
   npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Development Setup

1. Build the development Docker image:

```
   docker build -t nextjs-todo-list:dev .
```

2. Run the container with volume mounting for live code updates:

```
   docker run -v $(pwd):/app -p 3000:3000 --name nextjs-todo-list-dev nextjs-todo-list:dev
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Production Mode

### Local Production Setup

1. Create an optimized production build:

```
   npm run build
```

2. Start the production server:

```
   npm start
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

### Docker Production Setup

1. Build the production Docker image:

```
   docker build -t nextjs-todo-list:prod -f Dockerfile.prod .
```

2. Run the production container:

```
   docker run -p 3000:3000 --name nextjs-todo-list-prod nextjs-todo-list:prod
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Technology Stack

- Next.js - React framework
- Material UI - Component library
- Docker - Containerization

## License

This project is licensed under the MIT License
