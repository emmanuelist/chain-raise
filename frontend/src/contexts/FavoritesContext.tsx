import { createContext, useState, useEffect, useCallback, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (campaignId: string) => void;
  removeFavorite: (campaignId: string) => void;
  toggleFavorite: (campaignId: string) => void;
  isFavorite: (campaignId: string) => boolean;
  clearFavorites: () => void;
}

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "chainraise_favorites";

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }, [favorites]);

  const addFavorite = useCallback((campaignId: string) => {
    setFavorites((prev) => {
      if (prev.includes(campaignId)) return prev;
      return [...prev, campaignId];
    });
  }, []);

  const removeFavorite = useCallback((campaignId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== campaignId));
  }, []);

  const toggleFavorite = useCallback((campaignId: string) => {
    setFavorites((prev) => {
      if (prev.includes(campaignId)) {
        return prev.filter((id) => id !== campaignId);
      }
      return [...prev, campaignId];
    });
  }, []);

  const isFavorite = useCallback(
    (campaignId: string) => favorites.includes(campaignId),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
