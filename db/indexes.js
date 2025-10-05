// For filtering tasks by status
db.getCollection("tasks").createIndex({ status: 1 }, { name: "status_idx" });

// For sorting tasks by creation date
db.getCollection("tasks").createIndex(
  { createdAt: -1 },
  { name: "createdAt_idx" }
);

// For sorting tasks by title
db.getCollection("tasks").createIndex({ title: 1 }, { name: "title_idx" });

// Compound index for filtering + sorting (status + createdAt)
db.getCollection("tasks").createIndex(
  { status: 1, createdAt: -1 },
  { name: "status_createdAt_idx" }
);

// Compound index to support pagination with sorting by createdAt
db.getCollection("tasks").createIndex(
  { createdAt: -1, _id: 1 },
  { name: "createdAt_pagination_idx" }
);
