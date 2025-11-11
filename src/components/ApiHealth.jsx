import React, { useEffect, useState } from 'react';
import { apiFetch, getApiBase } from '../services/apiClient';
import { BrandCard, BrandText, BrandBadge } from './branding';

const StatusDot = ({ ok }) => (
  <span
    className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`}
    aria-hidden="true"
  />
);

export default function ApiHealth() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const base = getApiBase() || window.location.origin;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch('/health', { method: 'GET' });
        if (mounted) setState({ loading: false, data, error: null });
      } catch (e) {
        if (mounted) setState({ loading: false, data: null, error: e?.message || 'Unavailable' });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const ok = !!state.data && state.data.status === 'healthy';

  return (
    <BrandCard variant="default" padding="default">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <StatusDot ok={ok} />
          <BrandText weight="medium">API</BrandText>
        </div>
        <div className="flex items-center space-x-3">
          <BrandBadge variant={ok ? 'primary' : 'rose'}>
            {state.loading ? 'Checking…' : ok ? 'Healthy' : 'Unavailable'}
          </BrandBadge>
          <BrandText variant="secondary" className="text-xs truncate max-w-[16rem]" title={base}>
            {base}
          </BrandText>
        </div>
      </div>
      {!state.loading && state.data && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <BrandText variant="secondary">Project</BrandText>
            <div className="truncate">{state.data.project || '—'}</div>
          </div>
          <div>
            <BrandText variant="secondary">Features</BrandText>
            <div className="truncate">
              {Object.keys(state.data.features || {}).join(', ') || '—'}
            </div>
          </div>
        </div>
      )}
      {!state.loading && state.error && (
        <BrandText variant="secondary" className="mt-2 text-xs">
          {state.error}
        </BrandText>
      )}
    </BrandCard>
  );
}
