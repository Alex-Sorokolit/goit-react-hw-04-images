import { useState } from 'react';
import './Searchbar.css';

export default function Searchbar({ onSubmit }) {
  const [searchInput, setSearchInput] = useState('');

  const handleInputChange = event => {
    const { value } = event.currentTarget;
    setSearchInput(value);
  };

  // Очистка інпутів (через очистку стейту)
  const reset = () => {
    setSearchInput('');
  };

  const handleSubmit = event => {
    event.preventDefault();

    // Записуємо у пропс значення стейту (передаємо дані у App-компонент)
    onSubmit(searchInput);
    reset();
  };

  return (
    <header className="Searchbar">
      <form className="SearchForm">
        <button
          type="submit"
          className="SearchForm-button"
          onClick={handleSubmit}
        >
          <span className="SearchForm-button-label">Search</span>
        </button>

        <input
          className="SearchForm-input"
          type="text"
          value={searchInput}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
}
