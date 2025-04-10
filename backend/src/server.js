import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the notes JSON file
const dataPath = path.join(__dirname, "..", "data", "notes.json");

// Function to read notes from JSON file
const readNotesFromFile = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data).notes;
  } catch (error) {
    console.error("Error reading notes file:", error);
    return [];
  }
};

// Function to write notes to JSON file
const writeNotesToFile = (notes) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ notes }, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing notes file:", error);
    return false;
  }
};

// Middleware for parsing JSON and handling CORS
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Get all notes
app.get("/api/notes", (req, res) => {
  const notes = readNotesFromFile();
  res.json(notes);
});

// Get a single note
app.get("/api/notes/:id", (req, res) => {
  const notes = readNotesFromFile();
  const note = notes.find((note) => note.id === req.params.id);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.json(note);
});

// Create a new note
app.post("/api/notes", (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const notes = readNotesFromFile();

  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    category: category || "Uncategorized",
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);

  if (writeNotesToFile(notes)) {
    res.status(201).json(newNote);
  } else {
    res.status(500).json({ message: "Failed to save note" });
  }
});

// Update a note
app.put("/api/notes/:id", (req, res) => {
  const { title, content, category } = req.body;
  const notes = readNotesFromFile();
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title || notes[noteIndex].title,
    content: content || notes[noteIndex].content,
    category: category || notes[noteIndex].category,
    updatedAt: new Date().toISOString(),
  };

  if (writeNotesToFile(notes)) {
    res.json(notes[noteIndex]);
  } else {
    res.status(500).json({ message: "Failed to update note" });
  }
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotesFromFile();
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  const deletedNote = notes[noteIndex];
  const updatedNotes = notes.filter((note) => note.id !== req.params.id);

  if (writeNotesToFile(updatedNotes)) {
    res.json(deletedNote);
  } else {
    res.status(500).json({ message: "Failed to delete note" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
