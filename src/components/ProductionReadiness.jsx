import React, { useEffect, useState } from 'react';
import { apiFetch, getApiBase } from '../services/apiClient.js';
import { BrandCard, BrandText, BrandHeading, BrandBadge } from './branding';

function Row({ label, ok, hint }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-rose-100 last:border-0">
      <BrandText>{label}</BrandText>
      <div className="flex items-center space-x-3">
        {hint && (
          <BrandText variant="secondary" className="text-xs hidden sm:block">
            {hint}
          </BrandText>
        )}
        <BrandBadge variant={ok ? 'success' : 'rose'}>{ok ? 'OK' : 'Missing'}</BrandBadge>
      </div>
    </div>
  );
}

export default function ProductionReadiness() {
  const [api, setApi] = useState({ loading: true, ok: false, features: {} });
  const env = import.meta.env;

  const checks = {
    firebaseApiKey: !!env.VITE_FIREBASE_API_KEY,
    firebaseProject: !!env.VITE_FIREBASE_PROJECT_ID,
    stripePublishable: !!env.VITE_STRIPE_PUBLISHABLE_KEY,
    apiBase: !!env.VITE_API_BASE || (typeof window !== 'undefined' && window.location),
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await apiFetch('/health');
        if (!mounted) return;
        setApi({
          loading: false,
          ok: result?.status === 'healthy',
          features: result?.features || {},
        });
      } catch {
        if (!mounted) return;
        setApi({ loading: false, ok: false, features: {} });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const base = getApiBase() || (typeof window !== 'undefined' ? window.location.origin : '');

  return (
    <BrandCard variant="default" padding="lg">
      <BrandHeading level={3} className="mb-4">
        Production Readiness
      </BrandHeading>
      <BrandText variant="secondary" className="mb-4">
        Quick checklist to validate environment configuration and backend availability.
      </BrandText>

      <div className="space-y-2">
        <Row label="Firebase API Key" ok={checks.firebaseApiKey} hint="VITE_FIREBASE_API_KEY" />
        <Row
          label="Firebase Project ID"
          ok={checks.firebaseProject}
          hint="VITE_FIREBASE_PROJECT_ID"
        />
        <Row
          label="Stripe Publishable Key"
          ok={checks.stripePublishable}
          hint="VITE_STRIPE_PUBLISHABLE_KEY"
        />
        <Row label={`API Base (${base})`} ok={checks.apiBase} hint="VITE_API_BASE or same-origin" />
        <Row label="API Health" ok={api.ok} hint="/health" />
        {!api.loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <Row label="AI (Vertex)" ok={!!api.features.ai} />
            <Row label="Stripe (billing)" ok={!!api.features.stripe} />
            <Row label="Cross-post" ok={!!api.features.crossPost} />
          </div>
        )}
      </div>
    </BrandCard>
  );
}
