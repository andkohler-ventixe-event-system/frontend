import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
const API_CART = import.meta.env.VITE_API_CART;

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const addToCart = async (newItem) => {
    const quantityToAdd = newItem.quantity || 1;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.name === newItem.name && item.eventTitle === newItem.eventTitle
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        const updatedItem = { ...updatedCart[existingIndex] };
        updatedItem.quantity += quantityToAdd;
        updatedCart[existingIndex] = updatedItem;
        return updatedCart;
      } else {
        return [...prevCart, { ...newItem, quantity: quantityToAdd }];
      }
    });

    try {
      await fetch(`${API_CART}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTitle: newItem.eventTitle,
          packageName: newItem.name,
          price: newItem.price,
          quantity: quantityToAdd
        })
      });
    } catch (error) {
      console.error('Failed to sync with CartService:', error);
    }

    setToastMessage('Package added to cart');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const increaseQuantity = (index) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      const updatedItem = { ...updatedCart[index] };
      updatedItem.quantity += 1;
      updatedCart[index] = updatedItem;
      return updatedCart;
    });
  };

  const decreaseQuantity = (index) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      const updatedItem = { ...updatedCart[index] };

      if (updatedItem.quantity > 1) {
        updatedItem.quantity -= 1;
        updatedCart[index] = updatedItem;
      } else {
        updatedCart.splice(index, 1);
      }

      return updatedCart;
    });
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      toastMessage
    }}>
      {children}
    </CartContext.Provider>
  );
}
