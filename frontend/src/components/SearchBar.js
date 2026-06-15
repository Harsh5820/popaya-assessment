import React, { useState } from 'react';

const SearchBar = ({ onSearch, value }) => {
  const [localQuery, setLocalQuery] = useState(value || '');

  const handleChange = (e) => {
    const query = e.target.value;
    setLocalQuery(query);
    onSearch(query);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search notes by title or content..."
        value={localQuery}
        onChange={handleChange}
        className="search-input"
      />
      {localQuery && (
        <button
          className="btn-clear-search"
          onClick={handleClear}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
