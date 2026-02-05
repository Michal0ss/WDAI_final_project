import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../api';
import { ShoppingCart, Star, ArrowLeft, Loader } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { reviews, addReview, deleteReview } = useReviews();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const [stock, setStock] = useState(0);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const productReviews = reviews[id] || [];

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        // Random stock between 0 and 50
        setStock(Math.floor(Math.random() * 50));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} x ${product.title} to cart!`);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to leave a review.');
      return;
    }

    const hasReviewed = productReviews.some(r => r.username === user.username);
    if (hasReviewed) {
      alert('You have already reviewed this product.');
      return;
    }

    const review = {
      id: Date.now(),
      username: user.username,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString()
    };
    
    addReview(id, review);
    setNewReview({ rating: 5, comment: '' });
  };
  
  const handleDeleteReview = (reviewId) => {
     deleteReview(id, reviewId);
  }

  if (loading) return <div className="center-container"><Loader className="spinner" size={48} /></div>;
  if (error) return <div className="center-container"><p className="error-text">Error: {error}</p></div>;
  if (!product) return <div className="center-container"><p>Product not found</p></div>;

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={20} /> Back to Products
      </Link>

      <div className="product-details-container">
        <div className="product-details-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-details-info">
          <h1 className="details-title">{product.title}</h1>
          <p className="details-category">{product.category}</p>
          
          <div className="details-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.rating?.rate || 0) ? "#fbbf24" : "none"} color="#fbbf24" />
              ))}
            </div>
            <span className="rating-count">({product.rating?.count} ratings)</span>
          </div>

          <p className="details-price">${product.price.toFixed(2)}</p>
          
          <div className="details-stock">
            <span className={`stock-status ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {stock > 0 ? `In Stock (${stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <p className="details-description">{product.description}</p>

          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input 
                type="number" 
                id="quantity" 
                min="1" 
                max={stock} 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                disabled={stock === 0}
              />
            </div>
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              <ShoppingCart size={20} style={{ marginRight: '8px' }} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews ({productReviews.length})</h2>
        
        {user ? (
          <form className="add-review-form" onSubmit={handleAddReview}>
            <h3>Write a Review</h3>
            <div className="form-group">
              <label>Rating:</label>
              <select 
                value={newReview.rating} 
                onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comment:</label>
              <textarea 
                value={newReview.comment} 
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                required
                placeholder="Share your thoughts..."
              />
            </div>
            <button type="submit" className="submit-review-btn">Submit Review</button>
          </form>
        ) : (
          <div className="auth-card" style={{ marginBottom: '2rem', maxWidth: '100%', textAlign: 'center' }}>
            <p>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>login</Link> to write a review.</p>
          </div>
        )}

        <div className="reviews-list">
          {productReviews.length > 0 ? productReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div>
                  <span className="review-user">{review.username}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "#fbbf24" : "none"} color="#fbbf24" />
                  ))}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              
               {(user?.role === 'admin' || user?.username === review.username) && (
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    style={{ 
                      marginTop: '0.5rem', 
                      background: 'none', 
                      border: 'none', 
                      color: '#ef4444', 
                      fontSize: '0.75rem', 
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Delete Review
                  </button>
               )}
            </div>
          )) : (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No reviews yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
