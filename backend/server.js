const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for notes (session-based)
let notes = [
  {
    id: '1',
    title: 'Welcome to Notes App',
    content: 'This is your first note! You can edit, delete, or create new notes. All notes are stored in the session and will be cleared when you close the browser.',
    createdAt: new Date('2026-06-15T10:00:00').toISOString(),
    updatedAt: new Date('2026-06-15T10:00:00').toISOString()
  },
  {
    id: '2',
    title: 'Getting Started',
    content: 'Tips for using this Notes Management System:\n1. Create new notes by clicking "Create Note"\n2. Search notes using the search bar\n3. Edit notes by clicking the Edit button\n4. Delete notes with confirmation\n5. All notes are automatically sorted by most recently updated',
    createdAt: new Date('2026-06-15T10:30:00').toISOString(),
    updatedAt: new Date('2026-06-15T10:30:00').toISOString()
  }
];

// Helper function to generate unique IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// GET - Retrieve all notes
app.get('/api/notes', (req, res) => {
  try {
    // Sort notes by updatedAt in descending order (most recent first)
    const sortedNotes = [...notes].sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    res.json(sortedNotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});

// GET - Retrieve single note by ID
app.get('/api/notes/:id', (req, res) => {
  try {
    const note = notes.find(n => n.id === req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});

// POST - Create a new note
app.post('/api/notes', (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    const newNote = {
      id: generateId(),
      title: title.trim(),
      content: content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.push(newNote);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT - Update an existing note
app.put('/api/notes/:id', (req, res) => {
  try {
    const { title, content } = req.body;
    const note = notes.find(n => n.id === req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Validation
    if (title !== undefined && (!title || title.trim() === '')) {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    // Update fields
    if (title !== undefined) {
      note.title = title.trim();
    }
    if (content !== undefined) {
      note.content = content;
    }
    note.updatedAt = new Date().toISOString();

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE - Delete a note
app.delete('/api/notes/:id', (req, res) => {
  try {
    const noteIndex = notes.findIndex(n => n.id === req.params.id);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const deletedNote = notes.splice(noteIndex, 1);
    res.json({ message: 'Note deleted successfully', note: deletedNote[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// GET - Search notes by title and content
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query.trim()) {
      return res.json([]);
    }

    const searchTerm = query.toLowerCase();
    const results = notes.filter(note => {
      const titleMatch = note.title.toLowerCase().includes(searchTerm);
      const contentMatch = note.content.toLowerCase().includes(searchTerm);
      return titleMatch || contentMatch;
    });

    // Sort results by updatedAt
    results.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Notes Management System Backend running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  GET /api/notes - Get all notes');
  console.log('  GET /api/notes/:id - Get single note');
  console.log('  POST /api/notes - Create note');
  console.log('  PUT /api/notes/:id - Update note');
  console.log('  DELETE /api/notes/:id - Delete note');
  console.log('  GET /api/search?q=query - Search notes');
});
