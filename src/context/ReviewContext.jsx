import { createContext, useState, useContext, useCallback } from 'react';
import { fetchReviews, addProductReview, deleteProductReview } from '../api';

const ReviewContext = createContext();

export function useReviews() {
  return useContext(ReviewContext);
}

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState({});

  const loadReviews = useCallback(async (productId) => {
    const data = await fetchReviews(productId);
    setReviews(prev => ({
      ...prev,
      [productId]: data
    }));
  }, []);

  const addReview = useCallback(async (productId, rating, comment) => {
    const review = await addProductReview(productId, rating, comment);
    setReviews(prev => {
      const productReviews = prev[productId] || [];
      return {
        ...prev,
        [productId]: [review, ...productReviews]
      };
    });
    return review;
  }, []);

  const getReviews = (productId) => reviews[productId] || [];

  const deleteReview = useCallback(async (productId, reviewId) => {
    await deleteProductReview(productId, reviewId);
    setReviews(prev => {
      const productReviews = prev[productId] || [];
      return {
        ...prev,
        [productId]: productReviews.filter(r => r.id !== reviewId)
      };
    });
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, loadReviews, addReview, getReviews, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  );
}
