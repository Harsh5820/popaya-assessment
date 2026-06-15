const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];

app.get("/users", (req, res) => {
  const allUsers = users;
  res.send(allUsers);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send(user);
});

function getUserById(id) {
  return users.find((u) => u.id === Number(id));
}

app.get("/notes/count", (req, res) => {
  const total = notes.length;
  res.send({ total });
});

async function fetchExternalData() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  if (!response.ok) {
    throw new Error("Unable to fetch external data");
  }

  return response.json();
}

app.get("/external-data", async (req, res) => {
  try {
    const data = await fetchExternalData();
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch external data"
    });
  }
});

app.get("/notes", (req, res) => {
  if (notes.length === 0) {
    console.log("No notes found");
  }

  res.send(notes);
});

function generateNoteId() {
  if (notes.length === 0) {
    return 1;
  }

  return Math.max(...notes.map((note) => note.id)) + 1;
}

app.post("/notes", (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res.status(400).send("Invalid input");
  }

  const newNote = {
    id: generateNoteId(),
    title,
    content,
    userId: Number(userId)
  };

  notes.push(newNote);

  res.status(201).send(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).send({
      message: "Note not found"
    });
  }

  notes.splice(noteIndex, 1);

  res.send({ message: "Note deleted" });
});

app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send({
      message: "User not found"
    });
  }

  if (!name) {
    return res.status(400).send({
      message: "Name is required"
    });
  }

  user.name = name;

  res.send(user);
});

app.get("/user-notes/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  const userNotes = notes.filter(
    (note) => note.userId === userId
  );

  res.send(userNotes);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123456") {
    res.send({ message: "Login successful" });
  } else {
    res.status(401).send({
      message: "Invalid credentials"
    });
  }
});

app.get("/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send({
      message: "User not found"
    });
  }

  res.send(user.name);
});

app.post("/sum", (req, res) => {
  const { a, b } = req.body;

  const firstNumber = Number(a);
  const secondNumber = Number(b);

  if (
    !Number.isFinite(firstNumber) ||
    !Number.isFinite(secondNumber)
  ) {
    return res.status(400).send({
      message: "a and b must be valid numbers"
    });
  }

  const total = firstNumber + secondNumber;

  res.send({ total });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});