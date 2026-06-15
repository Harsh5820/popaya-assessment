import React, { useState, useEffect } from 'react';
import './App.css';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';
import SearchBar from './components/SearchBar';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Update filtered notes when notes or search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const performSearch = async () => {
        try {
          const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
          if (!response.ok) {
            throw new Error('Search failed');
          }
          const data = await response.json();
          setFilteredNotes(data);
        } catch (err) {
          console.error('Search error:', err);
          setError('Error searching notes: ' + err.message);
        }
      };
      performSearch();
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchQuery]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (err) {
      setError('Error loading notes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      if (!query.trim()) {
        setFilteredNotes(notes);
        return;
      }

      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setFilteredNotes(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching notes: ' + err.message);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setShowForm(false);
    } catch (err) {
      setError('Error creating note: ' + err.message);
      console.error(err);
    }
  };

  const handleEditNote = async (noteData) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update note');
      }

      const updatedNote = await response.json();
      setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
      setEditingNote(null);
      setShowForm(false);
    } catch (err) {
      setError('Error updating note: ' + err.message);
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('Error deleting note: ' + err.message);
      console.error(err);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Notes Management System</h1>
          <p className="subtitle">Keep track of your thoughts and ideas</p>
        </div>
      </header>

      <main className="app-main">
        <div className="controls">
          <SearchBar onSearch={handleSearch} value={searchQuery} />
          <button 
            className="btn btn-primary btn-create"
            onClick={handleOpenCreateForm}
          >
            + Create Note
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button 
              className="btn-close"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {showForm && (
          <NoteForm
            note={editingNote}
            onSubmit={editingNote ? handleEditNote : handleCreateNote}
            onCancel={handleCloseForm}
            isEditing={!!editingNote}
          />
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>{searchQuery ? 'No notes found' : 'No notes yet'}</h2>
            <p>
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Create your first note to get started!'}
            </p>
            {!searchQuery && (
              <button 
                className="btn btn-primary"
                onClick={handleOpenCreateForm}
              >
                Create First Note
              </button>
            )}
          </div>
        ) : (
          <NotesList
            notes={filteredNotes}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteNote}
          />
        )}
      </main>
    </div>
  );
}

export default App;
