/* eslint-env node */
// Middleware for authentication and paid user verification

export function requirePaidUser(req, res, next) {
  if (!req.user || !req.user.paid) {
    return res.status(403).json({ error: 'This feature is for Pro members only.' });
  }
  next();
}

// Basic auth middleware to attach user to request
// In a real app, this would verify JWT tokens or session
export function attachUser(req, res, next) {
  // For now, we'll look for email in query params or body
  // In production, this should verify authentication tokens
  const email = req.query.email || req.body.email;
  
  if (email) {
    // Mock user object - in production, fetch from database
    req.user = {
      email,
      paid: false, // This should be fetched from database
    };
  }
  
  next();
}
