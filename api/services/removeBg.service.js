import fetch from 'node-fetch';

const REMOVE_BG_KEY = process.env.REMOVE_BG_API_KEY || process.env.REMOVE_BG_KEY;

/**
 * Remove background using remove.bg API and return data URI (png with transparency)
 */
export async function removeBackgroundFromImage(imageUrl) {
  if (!REMOVE_BG_KEY) throw new Error('Missing REMOVE_BG_API_KEY');
  if (!imageUrl) throw new Error('imageUrl required');

  const FormData = (await import('form-data')).default;
  const formData = new FormData();
  formData.append('image_url', imageUrl);
  formData.append('size', 'auto');
  formData.append('format', 'png');

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': REMOVE_BG_KEY },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Remove.bg failed: ' + err);
  }

  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:image/png;base64,${base64}`;
}

export default { removeBackgroundFromImage };
