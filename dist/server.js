"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
let tasks = [];
// POST /login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    return res.json({ token: "mock-token-12345" });
  }
  res.status(400).json({ error: "Invalid credentials" });
});
// GET /tasks (filter, sort, pagination)
app.get("/tasks", (req, res) => {
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
    const key = sort;
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
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;
  const paged = filtered.slice(start, start + limitNum);
  res.json({ data: paged, meta: { total, page: pageNum, limit: limitNum } });
});
// POST /tasks
app.post("/tasks", (req, res) => {
  const { title, description, status = "pending" } = req.body;
  const newTask = {
    id: (0, uuid_1.v4)(),
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});
// PUT /tasks/:id
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  tasks[idx] = { ...tasks[idx], ...req.body };
  res.json(tasks[idx]);
});
// DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).end();
});

// app.listen(3001, () => console.log("Mock API running on http://localhost:3001"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
