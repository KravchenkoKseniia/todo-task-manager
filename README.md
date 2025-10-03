# Todo Task Manager

A full-stack task management application built with FastAPI backend and Next.js frontend.

## Features

- Display a list of all tasks
- Add a new task and remove a task
- Search for tasks
- Mark a task as done
- Filter tasks by status (all / done / undone)
- Assign priority to tasks (1–10)
- Sort tasks by priority in ascending or descending order

## Tech Stack

- **Backend**: Python FastAPI with SQLAlchemy ORM
- **Frontend**: Next.js 15 with React 19
- **Database**: SQLite (development) / PostgreSQL (production)

## Getting Started

### Prerequisites

- Python 3.9+ 
- Node.js 18+ and npm
- PostgreSQL (optional, for production)

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/KravchenkoKseniia/todo-task-manager.git
   cd todo-task-manager
   ```

2. **Create a virtual environment**

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the database**

   By default, the application uses SQLite for development. You can configure PostgreSQL or another database by editing the `.env` file:

   ```
   # For SQLite (development)
   DATABASE_URL=sqlite:///./todo.db

   # For PostgreSQL (production)
   # DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
   ```

5. **Start the backend server**

   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at http://localhost:8000

   - API documentation: http://localhost:8000/docs
   - API endpoints: http://localhost:8000/api/tasks

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

## API Endpoints

- `GET /api/tasks` - List all tasks with filtering options
  - Query parameters:
    - `status`: Filter by status (`done`, `undone`, `all`)
    - `sort_by_priority`: Sort by priority (`asc`, `desc`)
    - `search`: Search in title and description
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get a specific task
- `PATCH /api/tasks/{task_id}` - Update a task
- `DELETE /api/tasks/{task_id}` - Delete a task
- `PATCH /api/tasks/{task_id}/done` - Mark a task as done




