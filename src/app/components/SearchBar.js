import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, toggleDropdown, dropdownOpen, sortOptions, handleOptionClick, sort, sortLabel }) => (
  <div className="flex mb-10">
      <button
        id="dropdown-button"
        onClick={toggleDropdown}
        className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:outline-none"
        type="button"
      >
        {sortLabel ? `Sort by: ${sortLabel}` : 'Sort by'}
        <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
      </button>
      
      <div
        id="dropdown"
        className={`${
          dropdownOpen ? 'block' : 'hidden'
        } z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute`}
      >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {sortOptions.map((option) => (
              <li key={option.value}>
                <button 
                  onClick={() => handleOptionClick(option)}
                  className={`${
                    sort === option.value ? 'font-bold' : ''} inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
                  type="button"
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
      </div>

      <div className="relative w-full">
          <input 
            type="search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-dropdown" 
            className="block p-2.5 w-full z-20 text-sm text-gray-900 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:border-gray-500 dark:bg-gray-700" 
            placeholder="Search videos..." 
            required 
          />
          <button 
            onClick={handleSearch} 
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-500 rounded-r-lg border border-blue-500 hover:bg-blue-600 focus:outline-none"
            type="button"
          >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
              <span className="sr-only">Search</span>
          </button>
      </div>
  </div>
  );

export default SearchBar;
