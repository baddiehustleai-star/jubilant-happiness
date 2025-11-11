import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/apiClient';
import {
  BrandContainer,
  BrandSection,
  BrandCard,
  BrandHeading,
  BrandText,
  BrandBadge,
  BrandButton,
  BrandSpinner,
  BrandNavigation,
} from '../components/branding';

const Listings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/v2/listings', {
        headers: { 'x-user-id': 'usr_seed_demo' },
      });
      setData(res);
    } catch (e) {
      setError(e.body?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const openPublishModal = (listing) => {
    setSelectedListing(listing);
    setShowPublishModal(true);
  };

  const handlePublish = async (platform) => {
    if (!selectedListing) return;
    setPublishing(true);
    try {
      await apiFetch(`/api/v2/listings/${selectedListing.id}/publish`, {
        method: 'POST',
        body: JSON.stringify({ platforms: [platform] }),
        headers: { 'x-user-id': 'usr_seed_demo' },
      });
      await fetchListings();
      setShowPublishModal(false);
    } catch (e) {
      alert('Failed to publish listing.');
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-blush">
      <BrandNavigation
        navigation={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Listings', href: '/listings' },
        ]}
      />
      <BrandSection background="white" padding="lg">
        <BrandContainer>
          <div className="flex items-center justify-between mb-6">
            <BrandHeading level={2}>Your Listings</BrandHeading>
            <BrandButton variant="outline" onClick={fetchListings}>
              Refresh
            </BrandButton>
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

          {!loading && !error && (
            <BrandCard variant="default" padding="lg">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Channels</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((l) => (
                      <tr key={l.id} className="border-b hover:bg-rose-50/40">
                        <td className="px-3 py-3">
                          <div className="flex items-center space-x-3">
                            {l.imageUrl && (
                              <img
                                src={l.imageUrl}
                                alt={l.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <BrandText weight="semibold">{l.title}</BrandText>
                              <BrandText size="sm" variant="secondary">
                                {l.category || '—'}
                              </BrandText>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <BrandText variant="gold" weight="bold">
                            ${String(l.price)}
                          </BrandText>
                        </td>
                        <td className="px-3 py-3">
                          <BrandBadge variant={l.status === 'archived' ? 'secondary' : 'primary'}>
                            {l.status}
                          </BrandBadge>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {l.channelListings?.map((cl) => (
                              <BrandBadge key={cl.id} variant="outline">
                                {cl.platform}
                              </BrandBadge>
                            ))}
                            {!l.channelListings?.length && (
                              <BrandText size="sm" variant="secondary">
                                —
                              </BrandText>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-3 items-center">
                            <Link
                              to={`/listings/${l.id}/audit`}
                              className="underline text-rose-700"
                            >
                              Audit
                            </Link>
                            {l.status !== 'archived' && (
                              <button
                                className="text-red-600 hover:underline"
                                onClick={async () => {
                                  if (!window.confirm(`Archive "${l.title}"?`)) return;
                                  try {
                                    await apiFetch(`/api/v2/listings/${l.id}/archive`, {
                                      method: 'PATCH',
                                      headers: { 'x-user-id': 'usr_seed_demo' },
                                    });
                                    await fetchListings();
                                  } catch (err) {
                                    alert('Failed to archive listing.');
                                    console.error(err);
                                  }
                                }}
                              >
                                Archive
                              </button>
                            )}
                            {l.status === 'active' && (
                              <button
                                className="text-green-600 hover:underline"
                                onClick={() => openPublishModal(l)}
                              >
                                Publish
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BrandCard>
          )}
        </BrandContainer>
      </BrandSection>
      {showPublishModal && selectedListing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-96 p-6">
            <BrandHeading level={3} className="mb-2">
              Publish Listing
            </BrandHeading>
            <BrandText variant="secondary" className="mb-4">
              Choose a platform to publish "{selectedListing.title}".
            </BrandText>
            <div className="flex gap-4 mb-6">
              <BrandButton
                variant="primary"
                disabled={publishing}
                onClick={() => handlePublish('ebay')}
              >
                {publishing ? 'Publishing...' : 'eBay'}
              </BrandButton>
              <BrandButton
                variant="outline"
                disabled={publishing}
                onClick={() => handlePublish('facebook')}
              >
                {publishing ? 'Publishing...' : 'Facebook'}
              </BrandButton>
            </div>
            <div className="text-center">
              <button
                className="text-rose-700 underline"
                disabled={publishing}
                onClick={() => !publishing && setShowPublishModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;

// Modal portal appended after component (simple conditional render)
