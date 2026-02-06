import { createContext, useState, useContext, useCallback } from 'react';
import { fetchOrders, createOrder } from '../api';

const HistoryContext = createContext();

export function useHistory() {
  return useContext(HistoryContext);
}

export function HistoryProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(async () => {
    const data = await fetchOrders();
    setOrders(data);
  }, []);

  const addToHistory = useCallback(async (cartItems, total) => {
    const order = await createOrder(cartItems, total);
    setOrders(prev => [order, ...prev]);
    return order;
  }, []);

  const clearHistory = () => {
    setOrders([]);
  };

  return (
    <HistoryContext.Provider value={{ orders, loadOrders, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}
