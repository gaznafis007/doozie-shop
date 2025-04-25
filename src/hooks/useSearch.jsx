import { useContext } from "react";
import SearchContext from "../context/SearchContext";

/**
 * Custom hook to use search context
 */
export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
      throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
  };