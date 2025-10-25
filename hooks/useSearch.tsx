import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  isSearchExpanded: boolean;
  searchQuery: string;
  setSearchExpanded: (expanded: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQueryState] = useState('');

  const setSearchExpanded = (expanded: boolean) => {
    setIsSearchExpanded(expanded);
    if (!expanded) {
      setSearchQueryState('');
    }
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
  };

  const toggleSearch = () => {
    setSearchExpanded(!isSearchExpanded);
  };

  const clearSearch = () => {
    setSearchQueryState('');
    setSearchExpanded(false);
  };

  const contextValue: SearchContextType = {
    isSearchExpanded,
    searchQuery,
    setSearchExpanded,
    setSearchQuery,
    toggleSearch,
    clearSearch,
  };

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
