import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getGuestId } from '../api';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ttj_fav_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isFavsOpen, setIsFavsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ttj_fav_ids', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  async function toggleFavorite(productId) {
    const guestId = getGuestId();
    // Optimistic UI update
    setFavoriteIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    try {
      await api.toggleFavorite(guestId, productId);
    } catch (err) {
      console.error('Failed to sync favorite with server', err);
    }
  }

  const isFavorite = (productId) => favoriteIds.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        isFavorite,
        isFavsOpen,
        setIsFavsOpen,
        favCount: favoriteIds.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
