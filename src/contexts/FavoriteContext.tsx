import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FavoriteContextType {
  favoriteShopIds: string[]
  toggleFavorite: (shopId: string) => void
  isFavorite: (shopId: string) => boolean
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined)

export const FavoriteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoriteShopIds, setFavoriteShopIds] = useState<string[]>([])

  // localStorage에서 즐겨찾기 로드
  useEffect(() => {
    const saved = localStorage.getItem('favoriteShops')
    if (saved) {
      try {
        setFavoriteShopIds(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load favorite shops:', error)
      }
    }
  }, [])

  // 즐겨찾기 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('favoriteShops', JSON.stringify(favoriteShopIds))
  }, [favoriteShopIds])

  const toggleFavorite = (shopId: string) => {
    setFavoriteShopIds(prev => {
      if (prev.includes(shopId)) {
        return prev.filter(id => id !== shopId)
      } else {
        return [...prev, shopId]
      }
    })
  }

  const isFavorite = (shopId: string) => {
    return favoriteShopIds.includes(shopId)
  }

  return (
    <FavoriteContext.Provider value={{ favoriteShopIds, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export const useFavorite = () => {
  const context = useContext(FavoriteContext)
  if (context === undefined) {
    throw new Error('useFavorite must be used within a FavoriteProvider')
  }
  return context
}
