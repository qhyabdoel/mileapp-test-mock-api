import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "done";
  createdAt: string;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

let tasks: Task[] = [];

// POST /login
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username && password) {
    return res.json({ token: "mock-token-12345" });
  }
  res.status(400).json({ error: "Invalid credentials" });
});

// GET /tasks (filter, sort, pagination)
app.get("/tasks", (req: Request, res: Response) => {
  let {
    page = "1",
    limit = "5",
    sort = "createdAt",
    order = "desc",
    status,
  } = req.query;

  let filtered = [...tasks];
  if (status && typeof status === "string") {
    filtered = filtered.filter((t) => t.status === status);
  }

  filtered.sort((a, b) => {
    const key = sort as keyof Task;
    const aVal = a[key];
    const bVal = b[key];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return -1;
    if (bVal == null) return 1;

    if (order === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    }
    return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
  });

  const total = filtered.length;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const start = (pageNum - 1) * limitNum;
  const paged = filtered.slice(start, start + limitNum);

  res.json({ data: paged, meta: { total, page: pageNum, limit: limitNum } });
});

// POST /tasks
app.post("/tasks", (req: Request, res: Response) => {
  const { title, description, status = "pending" } = req.body;
  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put("/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });

  tasks[idx] = { ...tasks[idx], ...req.body };
  res.json(tasks[idx]);
});

// DELETE /tasks/:id
app.delete("/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).end();
});

app.listen(3001, () =>
  console.log("Mock API running on http://localhost:3001")
);
