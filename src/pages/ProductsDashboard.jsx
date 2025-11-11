import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../contexts/AuthContext';
import {
  BrandContainer,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
} from '../components/branding/BrandElements';

export default function ProductsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        // Build query based on filter
        let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

        // Add filter for published status
        if (filter === 'published') {
          q = query(
            collection(db, 'products'),
            where('published', '==', true),
            orderBy('createdAt', 'desc')
          );
        } else if (filter === 'draft') {
          q = query(
            collection(db, 'products'),
            where('published', '==', false),
            orderBy('createdAt', 'desc')
          );
        }

        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [filter]);

  if (loading) {
    return (
      <BrandContainer>
        <BrandCard>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
            <BrandText>Loading your products...</BrandText>
          </div>
        </BrandCard>
      </BrandContainer>
    );
  }

  return (
    <BrandContainer>
      <div className="mb-6 flex items-center justify-between">
        <BrandHeading>Your Products</BrandHeading>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-rose-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'published'
                ? 'bg-rose-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'draft'
                ? 'bg-rose-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <BrandCard>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <BrandHeading level={2} className="mb-2">
              No Products Yet
            </BrandHeading>
            <BrandText className="mb-6">
              Upload your first product photo to get started with AI-powered listings.
            </BrandText>
            <BrandButton onClick={() => navigate('/dashboard')}>Upload Product</BrandButton>
          </div>
        </BrandCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <BrandCard className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                {/* Product Image */}
                {product.imageUrl && (
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-rose-gold transition-colors">
                      {product.title || 'Untitled Product'}
                    </h3>
                    {product.published !== undefined && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                          product.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {product.published ? 'Live' : 'Draft'}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  )}

                  {/* Price Options */}
                  {product.priceOptions && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.priceOptions.used && (
                        <div className="px-3 py-1 rounded-md bg-pink-50 text-pink-700 text-sm font-medium">
                          Used ${product.priceOptions.used}
                        </div>
                      )}
                      {product.priceOptions.marketplace && (
                        <div className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
                          Market ${product.priceOptions.marketplace}
                        </div>
                      )}
                      {product.priceOptions.new && (
                        <div className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm font-medium">
                          New ${product.priceOptions.new}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <p>Created {new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </BrandCard>
            </Link>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {products.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <BrandCard>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-gold">{products.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Products</div>
            </div>
          </BrandCard>
          <BrandCard>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {products.filter((p) => p.published).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Published</div>
            </div>
          </BrandCard>
          <BrandCard>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {products.filter((p) => !p.published).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Drafts</div>
            </div>
          </BrandCard>
        </div>
      )}
    </BrandContainer>
  );
}
