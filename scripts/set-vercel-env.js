#!/usr/bin/env node
/* eslint-env node */

/**
 * Set environment variables on a Vercel project using the Vercel API.
 * Requires VERCEL_TOKEN and VERCEL_PROJECT_ID in env.
 * Usage: VERCEL_TOKEN=token VERCEL_PROJECT_ID=proj node scripts/set-vercel-env.js KEY VALUE
 */
import fetch from 'node-fetch';

async function main() {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) {
    console.error('ERROR: VERCEL_TOKEN or VERCEL_PROJECT_ID not set in env');
    process.exit(1);
  }

  const [key, value] = process.argv.slice(2);
  if (!key || !value) {
    console.error('Usage: node scripts/set-vercel-env.js KEY VALUE');
    process.exit(1);
  }

  const url = `https://api.vercel.com/v9/projects/${projectId}/env`;
  const body = {
    key,
    value,
    target: ['preview', 'production'],
    type: 'encrypted',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error('Vercel API error:', result);
    process.exit(1);
  }

  console.log('Vercel env created:', result);
}

main().catch((err) => {
  console.error('Error setting vercel env:', err);
  process.exit(1);
});
