import React, { createContext, useContext, useState, useEffect } from "react";
import { logAnalyticsEvent } from "../firebase";

export interface CartItem {
  id: string; // Format: `${productId}-${size}`
  productId: number;
  name: string;
  price: string;
  image: string;
  slug: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  addToCart: (product: { id: number; name: string; price: string; image: string; slug: string }, size: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPriceAmount: number;
  formattedSubtotal: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const parsePrice = (priceStr: string): number => {
  const parsed = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatPrice = (amount: number): string => {
  return `PKR ${amount.toLocaleString()}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("eternal_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("eternal_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    product: { id: number; name: string; price: string; image: string; slug: string },
    size: string,
    quantity = 1
  ) => {
    // Audit telemetry
    try {
      logAnalyticsEvent({
        eventType: "add_to_cart",
        productSlug: product.slug,
        productName: product.name,
        price: parsePrice(product.price),
        size,
      });
    } catch (err) {
      console.error("Telemetry failed:", err);
    }

    const itemId = `${product.id}-${size}`;
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prevItems,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
          size,
          quantity,
        },
      ];
    });
    setCartOpen(true); // Always open the cart sliding window when an item is added for strong feedback
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const totalPriceAmount = cartItems.reduce((acc, curr) => {
    return acc + parsePrice(curr.price) * curr.quantity;
  }, 0);

  const formattedSubtotal = formatPrice(totalPriceAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setCartOpen,
        isMenuOpen,
        setMenuOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPriceAmount,
        formattedSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
