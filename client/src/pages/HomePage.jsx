import React, { useEffect, useState } from 'react';
import ProductCard from '../components/products/ProductCard';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ user, setShowLogin }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    fetch('https://dummyjson.com/products?limit=100')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories([
          'all',
          ...Array.from(new Set((data.products || []).map((p) => p.category))),
        ]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Filter products by search and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group filtered products by category, but only include categories with products
  const productsByCategory = categories.reduce((acc, cat) => {
    if (cat === 'all') return acc;
    const prods = filteredProducts.filter((p) => p.category === cat);
    if (prods.length > 0) acc[cat] = prods;
    return acc;
  }, {});

  return (
    <div style={{ padding: 0, background: '#f5f6fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        style={{
          background:
            'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
          color: '#fff',
          padding: '2.5rem 2rem 2rem',
          textAlign: 'center',
          marginBottom: 40,
          minHeight: 320,
          borderRadius: 18,
          boxShadow: '0 6px 32px #1976d233',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'url(https://www.transparenttextures.com/patterns/diamond-upholstery.png)',
          opacity: 0.08,
          zIndex: 0,
        }} />
        <h1 style={{
          fontSize: 44,
          fontWeight: 900,
          marginBottom: 10,
          background: 'linear-gradient(90deg, #fff 60%, #e3f2fd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 16px #1976d255',
          position: 'relative',
          zIndex: 1,
          letterSpacing: 1.5,
          animation: 'heroGradient 3s ease-in-out infinite alternate',
        }}>
          Welcome to <span style={{color:'#ffd600'}}>ShopNest</span>
        </h1>
        <p style={{
          fontSize: 22,
          fontWeight: 500,
          marginBottom: 24,
          color: '#e3f2fd',
          textShadow: '0 2px 8px #1976d299',
          position: 'relative',
          zIndex: 1,
        }}>
          Discover trending products, exclusive deals, and a seamless shopping experience
        </p>
        <button
          onClick={() => {
            const el = document.getElementById('products-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)',
            color: '#222',
            fontWeight: 700,
            fontSize: 18,
            padding: '14px 38px',
            borderRadius: 10,
            boxShadow: '0 2px 12px #ffd60055',
            textDecoration: 'none',
            marginBottom: 28,
            position: 'relative',
            zIndex: 1,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #fffde7 60%, #ffd600 100%)'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd600 60%, #fffde7 100%)'}
        >
          Shop Now
        </button>
        {/* Featured Products Slideshow with stylish arrows */}
        <div style={{marginTop: 18, position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', width: '100%'}}>
          <FeaturedSlideshow products={products.slice(0, 5)} loading={loading} showArrows large />
        </div>
      </div>

      {/* Search Bar and Category Filter */}
      <div id="products-section" className="search-filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products by Category */}
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div>Failed to load products.</div>
      ) : Object.keys(productsByCategory).length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          color: '#888',
          fontSize: 22,
          padding: '3rem 0'
        }}>
          <span role="img" aria-label="search" style={{fontSize: 48, marginBottom: 16}}>🔍</span>
          No products found for your search.
        </div>
      ) : (
        Object.entries(productsByCategory).map(([cat, prods]) => (
          <div
            key={cat}
            style={{
              maxWidth: 1200,
              margin: '0 auto 40px',
              padding: '0 2rem',
            }}
          >
            <h2
              style={{
                marginBottom: 24,
                color: '#1976d2',
                textTransform: 'capitalize',
              }}
            >
              {cat}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 260px))',
                gap: '1.5rem',
                justifyContent: 'start',
              }}
            >
              {prods.map((product) => (
                <ProductCard key={product.id} product={product} user={user} setShowLogin={setShowLogin} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

      {/* Search Bar and Category Filter */}
      <div
        id="products-section"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 2rem 1.5rem',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: 10,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products by Category */}
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div>Failed to load products.</div>
      ) : Object.keys(productsByCategory).length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          color: '#888',
          fontSize: 22,
          padding: '3rem 0'
        }}>
          <span role="img" aria-label="search" style={{fontSize: 48, marginBottom: 16}}>🔍</span>
          No products found for your search.
        </div>
      ) : (
        Object.entries(productsByCategory).map(([cat, prods]) => (
          <div
            key={cat}
            style={{
              maxWidth: 1200,
              margin: '0 auto 40px',
              padding: '0 2rem',
            }}
          >
            <h2
              style={{
                marginBottom: 24,
                color: '#1976d2',
                textTransform: 'capitalize',
              }}
            >
              {cat}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 260px))',
                gap: '1.5rem',
                justifyContent: 'start',
              }}
            >
              {prods.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))
      )}


// Slideshow component
function FeaturedSlideshow({ products, loading, showArrows, large }) {
  const [index, setIndex] = React.useState(0);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!loading && products.length > 1) {
      const timer = setInterval(() => {
        setIndex((i) => (i + 1) % products.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [products, loading]);
  if (loading || products.length === 0) return null;

  // Card stack logic: show prev, current, next
  const prevIdx = (index - 1 + products.length) % products.length;
  const nextIdx = (index + 1) % products.length;
  const cards = [prevIdx, index, nextIdx];
  const zIndexes = [1, 3, 2]; // center card on top
  const scales = [0.85, 1.1, 0.85];
  const offsets = [-80, 0, 80];

  return (
    <div style={{
      position: 'relative',
      width: large ? 520 : 320,
      height: large ? 220 : 120,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: 1200,
    }}>
      {cards.map((idx, i) => {
        const product = products[idx];
        return (
          <div key={idx}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translateX(${offsets[i]}px) scale(${scales[i]})`,
              zIndex: zIndexes[i],
              boxShadow: i === 1 ? '0 6px 32px #1976d233' : '0 2px 8px #0002',
              opacity: i === 1 ? 1 : 0.7,
              transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
              background: '#fff',
              borderRadius: 18,
              width: large ? 320 : 180,
              height: large ? 180 : 90,
              display: 'flex',
              alignItems: 'center',
              gap: large ? 24 : 10,
              padding: large ? 24 : 10,
              cursor: i === 1 ? 'pointer' : 'default',
              border: i === 1 ? '2px solid #ffd600' : '1px solid #eee',
            }}
            onClick={i === 1 ? () => navigate(`/product/${product.id}`) : undefined}
          >
            <img src={product.thumbnail} alt={product.title} style={{ width: large ? 80 : 40, height: large ? 80 : 40, objectFit: 'cover', borderRadius: 12, boxShadow: '0 1px 6px #0001', marginRight: large ? 18 : 8 }} />
            <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: large ? 22 : 14, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#222' }}>{product.title}</div>
              <div style={{ fontSize: large ? 18 : 12, color: '#1976d2', fontWeight: 700, marginBottom: 2 }}>
                ${product.price}
              </div>
              <div style={{ fontSize: large ? 15 : 11, color: '#ffb300', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{fontSize: large ? 18 : 13}}>★</span> {product.rating || 'N/A'}
              </div>
            </div>
          </div>
        );
      })}
      {/* Stylish arrows */}
      {showArrows && products.length > 1 && (
        <>
          <button onClick={() => setIndex((index-1+products.length)%products.length)} style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg,#fffde7,#ffd600)', border: 'none', fontSize: large ? 32 : 20, color: '#1976d2', cursor: 'pointer', zIndex: 10, padding: large ? '10px 16px' : '6px 10px', borderRadius: '50%', boxShadow: '0 2px 8px #ffd60044',
          }} aria-label="Previous">
            <span style={{fontWeight:900, fontSize: large ? 28 : 18, color:'#1976d2', display:'inline-block', transform:'rotate(180deg)'}}>➤</span>
          </button>
          <button onClick={() => setIndex((index+1)%products.length)} style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg,#fffde7,#ffd600)', border: 'none', fontSize: large ? 32 : 20, color: '#1976d2', cursor: 'pointer', zIndex: 10, padding: large ? '10px 16px' : '6px 10px', borderRadius: '50%', boxShadow: '0 2px 8px #ffd60044',
          }} aria-label="Next">
            <span style={{fontWeight:900, fontSize: large ? 28 : 18, color:'#1976d2'}}>➤</span>
          </button>
        </>
      )}
    </div>
  );
}

// Add keyframes for heroGradient animation
const style = document.createElement('style');
style.innerHTML = `@keyframes heroGradient { 0% { filter: brightness(1); } 100% { filter: brightness(1.15) saturate(1.2); } }`;
document.head.appendChild(style);

}

export default HomePage;