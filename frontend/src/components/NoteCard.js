import React, { useState } from 'react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreview = (content, maxLength = 100) => {
    if (!content) return 'No content';
    const preview = content.substring(0, maxLength);
    return preview.length < content.length ? preview + '...' : preview;
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(note.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="note-card">
      <div className="note-card-content">
        <h3 className="note-title">{note.title}</h3>
        <p className="note-preview">{getPreview(note.content)}</p>
        <div className="note-dates">
          <span className="note-date">
            <strong>Created:</strong> {formatDate(note.createdAt)}
          </span>
          <span className="note-date">
            <strong>Updated:</strong> {formatDate(note.updatedAt)}
          </span>
        </div>
      </div>
      <div className="note-actions">
        <button
          className="btn btn-secondary btn-edit"
          onClick={() => onEdit(note)}
          title="Edit note"
        >
          ✎ Edit
        </button>
        <button
          className="btn btn-danger btn-delete"
          onClick={handleDeleteClick}
          title="Delete note"
        >
          🗑 Delete
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this note?</p>
          <div className="confirmation-actions">
            <button
              className="btn btn-danger"
              onClick={handleConfirmDelete}
            >
              Yes, Delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
