import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../api';
import ProductCard from '../components/ProductCard';
import { Search, Loader, Filter } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(['all', ...categoriesData]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="center-container">
        <Loader className="spinner" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-container">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-container home-layout">
      <aside className="filters-sidebar">
        <div className="filters-header">
           <Filter size={20} />
           <h3>Categories</h3>
        </div>
        <div className="category-list">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>

      <main className="home-content">
        <header className="home-header">
          <h1>Discover Latest Trends</h1>
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
      
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-results">No products found matching "{searchTerm}"</p>
        )}
      </div>
      </main>
    </div>
  );
}
