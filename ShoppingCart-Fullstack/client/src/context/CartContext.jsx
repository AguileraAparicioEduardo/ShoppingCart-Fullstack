import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.name === product.name)
      if (exists) return prev.map(i =>
        i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i
      )
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (name) =>
    setCart(prev => prev.filter(i => i.name !== name))

  const increment = (name) =>
    setCart(prev => prev.map(i =>
      i.name === name ? { ...i, quantity: i.quantity + 1 } : i
    ))

  const decrement = (name) =>
    setCart(prev => prev
      .map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0)
    )

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, increment, decrement, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)