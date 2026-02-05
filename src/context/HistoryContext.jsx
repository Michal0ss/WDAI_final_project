import { createContext, useState, useContext, useEffect } from 'react';

const HistoryContext = createContext();

export function useHistory() {
  return useContext(HistoryContext);
}

export function HistoryProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToHistory = (cartItems, total) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cartItems,
      total: total,
      status: 'Completed'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const clearHistory = () => {
    setOrders([]);
  };

  return (
    <HistoryContext.Provider value={{ orders, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}
