import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import {
  BrandContainer,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandButton,
} from '../components/branding/BrandElements';

export default function PublicProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const ref = doc(db, 'products', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyNow = () => {
    // Navigate to Stripe checkout or login
    navigate(`/checkout/${id}`);
  };

  if (loading) {
    return (
      <BrandContainer>
        <BrandCard>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
            <BrandText>Loading product...</BrandText>
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
            <div className="text-6xl mb-4">❌</div>
            <BrandHeading level={2} className="mb-2">
              Product Not Found
            </BrandHeading>
            <BrandText className="mb-6">
              This product may have been removed or the link is incorrect.
            </BrandText>
            <BrandButton onClick={() => navigate('/')}>Go Home</BrandButton>
          </div>
        </BrandCard>
      </BrandContainer>
    );
  }

  return (
    <BrandContainer>
      <BrandCard className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            {product.imageUrl && (
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border-2 border-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-rose-gold hover:text-rose-gold transition-colors font-medium"
            >
              {copied ? '✓ Link Copied!' : '📋 Share This Product'}
            </button>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Status Badge */}
            {product.published !== undefined && (
              <div className="inline-block">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    product.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {product.published ? '✓ Available' : 'Coming Soon'}
                </span>
              </div>
            )}

            {/* Title */}
            <BrandHeading className="text-3xl">{product.title || 'Product'}</BrandHeading>

            {/* Description */}
            {product.description && (
              <BrandText className="text-lg leading-relaxed">{product.description}</BrandText>
            )}

            {/* Price Options */}
            {product.priceOptions && Object.keys(product.priceOptions).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Pricing Options
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.priceOptions).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key === 'used' && 'Pre-Owned'}
                        {key === 'marketplace' && 'Marketplace'}
                        {key === 'new' && 'Brand New'}
                      </span>
                      <span className="text-2xl font-bold text-rose-gold">${value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Button */}
            <BrandButton onClick={handleBuyNow} className="w-full py-4 text-lg">
              💳 Buy Now
            </BrandButton>

            {/* Metadata */}
            <div className="pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  Listed:{' '}
                  {new Date(product.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                {product.publishedAt && (
                  <p>
                    Published:{' '}
                    {new Date(product.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <span className="text-2xl">🔒</span>
              <span>
                Secure checkout powered by <strong>Stripe</strong>
              </span>
            </div>
          </div>
        </div>
      </BrandCard>
    </BrandContainer>
  );
}
