import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../services/apiClient';
import {
  BrandContainer,
  BrandSection,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandBadge,
  BrandSpinner,
  BrandNavigation,
} from '../components/branding';

const ListingAudit = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [evt, lst] = await Promise.all([
        apiFetch(`/api/v2/audit-events?listingId=${encodeURIComponent(id)}&limit=50`, {
          headers: { 'x-user-id': 'usr_seed_demo' },
        }),
        apiFetch(`/api/v2/listings/${encodeURIComponent(id)}`, {
          headers: { 'x-user-id': 'usr_seed_demo' },
        }),
      ]);
      setEvents(evt || []);
      setListing(lst || null);
    } catch (e) {
      setError(e.body?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-blush">
      <BrandNavigation navigation={[{ name: 'Listings', href: '/listings' }]} />
      <BrandSection background="white" padding="lg">
        <BrandContainer>
          <div className="flex items-center justify-between mb-6">
            <BrandHeading level={2}>Audit History</BrandHeading>
            <Link to="/listings" className="underline text-rose-700">
              ← Back to Listings
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <BrandSpinner size="lg" />
            </div>
          )}

          {error && (
            <BrandCard variant="default" padding="default" className="mb-6">
              <BrandText variant="danger">{error}</BrandText>
              <BrandText size="sm" variant="secondary" className="mt-2">
                Ensure DATABASE_URL is set and v2 API is enabled. This page uses
                x-user-id=usr_seed_demo.
              </BrandText>
            </BrandCard>
          )}

          {!loading && !error && listing && (
            <BrandCard variant="default" padding="lg" className="mb-6">
              <div className="flex items-center gap-4">
                {listing.imageUrl && (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <BrandHeading level={3}>{listing.title}</BrandHeading>
                  <div className="flex items-center gap-3 mt-1">
                    <BrandBadge variant={listing.status === 'archived' ? 'secondary' : 'primary'}>
                      {listing.status}
                    </BrandBadge>
                    <BrandText variant="gold" weight="bold">
                      ${String(listing.price)}
                    </BrandText>
                  </div>
                </div>
              </div>
            </BrandCard>
          )}

          {!loading && !error && (
            <BrandCard variant="default" padding="lg">
              {events.length === 0 ? (
                <BrandText variant="secondary">No audit events found for this listing.</BrandText>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="px-3 py-2">When</th>
                        <th className="px-3 py-2">Platform</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Detail</th>
                        <th className="px-3 py-2">Payload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((e) => (
                        <tr key={e.id} className="border-b">
                          <td className="px-3 py-3 text-sm text-gray-600">
                            {new Date(e.createdAt).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 capitalize">{e.platform || '—'}</td>
                          <td className="px-3 py-3 capitalize">
                            <BrandBadge variant={e.type === 'price_change' ? 'gold' : 'primary'}>
                              {e.type}
                            </BrandBadge>
                          </td>
                          <td className="px-3 py-3 text-sm">{e.detail || '—'}</td>
                          <td className="px-3 py-3 font-mono text-xs whitespace-pre-wrap">
                            {e.payload ? JSON.stringify(e.payload) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </BrandCard>
          )}
        </BrandContainer>
      </BrandSection>
    </div>
  );
};

export default ListingAudit;
