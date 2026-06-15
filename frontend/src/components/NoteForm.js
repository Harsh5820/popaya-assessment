import React, { useState, useEffect } from 'react';

const NoteForm = ({ note, onSubmit, onCancel, isEditing }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        content: content || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Note' : 'Create New Note'}</h2>
          <button
            className="btn-close-modal"
            onClick={onCancel}
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="note-form">
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Note Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              autoFocus
              maxLength="200"
            />
            <small>{title.length}/200</small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Note Content</label>
            <textarea
              id="content"
              placeholder="Enter note content (optional)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              rows="8"
            />
            <small>{content.length} characters</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
