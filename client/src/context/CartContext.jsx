import React, { createContext, useState, useEffect } from 'react';
import { getCart, saveCart, deleteCart } from '../services/cartService';

// 1. Create the Context
export const CartContext = createContext();

// 2. Create the Provider Component
export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });
  const [userId, setUserId] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  });

  // 3. Sync cart state with localStorage and backend
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch {}
    // Only save to backend if user is logged in and cart is not being cleared (i.e., not empty due to logout)
    if (userId && cartItems.length > 0) {
      saveCart(userId, cartItems).catch(() => {});
    }
  }, [cartItems, userId]);

  // 4. Listen for user login/logout and load/clear cart
  useEffect(() => {
    const id = user ? user.id : null;
    setUserId(id);
    if (id) {
      // On login, load cart from backend and always trust backend
      getCart(id)
        .then(items => {
          setCartItems(items);
          localStorage.setItem('cartItems', JSON.stringify(items));
        })
        .catch(() => {
          setCartItems([]);
          localStorage.removeItem('cartItems');
        });
    } else {
      // On logout, only clear local cart and localStorage (do NOT delete backend cart)
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  }, [user]);

  // 4. Define cart manipulation functions
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If not, add the new item with a quantity of 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = async () => {
    console.log('clearCart called');
    setCartItems([]);
    localStorage.removeItem('cartItems');
    try {
      if (userId) {
        await deleteCart(userId);
      }
    } catch {}
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // 5. Provide the state and functions to children components
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};