import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { BrandContainer } from '../components/branding/BrandElements';
import { BrandCard } from '../components/branding/BrandElements';
import { BrandHeading } from '../components/branding/BrandTypography';
import { BrandButton } from '../components/branding/BrandElements';

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product');
      }
    }
    load();
  }, [id]);

  async function handleSave() {
    if (!product) return;
    setSaving(true);
    setError(null);

    try {
      const ref = doc(db, 'products', product.id);
      await updateDoc(ref, {
        title: product.title,
        description: product.description,
        priceOptions: product.priceOptions,
        updatedAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error saving product:', err.message);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <BrandContainer>
        <BrandCard>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <BrandButton onClick={() => navigate('/dashboard')}>Back to Dashboard</BrandButton>
          </div>
        </BrandCard>
      </BrandContainer>
    );
  }

  if (!product) {
    return (
      <BrandContainer>
        <BrandCard>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </BrandCard>
      </BrandContainer>
    );
  }

  return (
    <BrandContainer>
      <BrandCard className="max-w-2xl mx-auto">
        <BrandHeading className="mb-6">Edit Product</BrandHeading>

        {/* Product Image */}
        {product.imageUrl && (
          <div className="mb-6">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full rounded-lg shadow-md max-h-96 object-contain bg-gray-50"
            />
          </div>
        )}

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={product.title || ''}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            placeholder="Product title"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={product.description || ''}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            rows={4}
            placeholder="Product description"
          />
        </div>

        {/* Prices */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Pricing Options</label>
          <div className="space-y-3">
            {['used', 'marketplace', 'new'].map((key) => (
              <div key={key} className="flex items-center gap-4">
                <span className="w-32 text-sm font-medium text-gray-700 capitalize">{key}</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={product.priceOptions?.[key] || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        priceOptions: {
                          ...product.priceOptions,
                          [key]: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publishing Status */}
        {product.published !== undefined && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Publishing Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {product.published ? 'Published' : 'Draft'}
              </span>
            </div>
            {product.publishedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Published: {new Date(product.publishedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <BrandButton onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </BrandButton>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
          <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
          {product.updatedAt && <p>Last updated: {new Date(product.updatedAt).toLocaleString()}</p>}
        </div>
      </BrandCard>
    </BrandContainer>
  );
}
