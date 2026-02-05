import { createContext, useState, useContext, useEffect } from 'react';

const ReviewContext = createContext();

export function useReviews() {
  return useContext(ReviewContext);
}

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem('product_reviews');
    // Initial mock data if empty
    if (!savedReviews) {
      return {
        //{ productId: [review, review] }
      };
    }
    return JSON.parse(savedReviews);
  });

  useEffect(() => {
    localStorage.setItem('product_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId, review) => {
    setReviews(prev => {
      const productReviews = prev[productId] || [];
      return {
        ...prev,
        [productId]: [review, ...productReviews]
      };
    });
  };

  const getReviews = (productId) => {
    return reviews[productId] || [];
  };

  const deleteReview = (productId, reviewId) => {
      setReviews(prev => {
          const productReviews = prev[productId] || [];
          return {
              ...prev,
              [productId]: productReviews.filter(r => r.id !== reviewId)
          }
      })
  }

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviews, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  );
}
