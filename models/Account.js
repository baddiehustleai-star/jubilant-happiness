const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  platform: {
    type: String,
    required: true,
    enum: ['instagram', 'twitter', 'linkedin', 'pinterest', 'ebay', 'facebook'],
  },

  // OAuth Tokens
  accessToken: { type: String, required: true },
  refreshToken: String,
  expiresAt: Date, // Token expiration timestamp

  // Platform-Specific IDs
  platformUserId: String, // e.g., Instagram Business Account ID, Twitter User ID
  platformUsername: String, // Display name or handle

  // Platform-Specific Metadata
  metadata: {
    // Instagram
    instagramAccountId: String,
    facebookPageId: String,

    // Pinterest
    defaultBoardId: String,

    // eBay Reseller Policies (Must be configured once)
    fulfillmentPolicyId: String, // Shipping rules
    paymentPolicyId: String, // Payment methods
    returnPolicyId: String, // Return policy
    merchantLocationKey: String, // Warehouse location

    // LinkedIn
    organizationId: String, // For company pages

    // Twitter
    twitterUserId: String,
  },

  // Account Status
  isActive: { type: Boolean, default: true },
  lastRefreshed: Date,

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamp on save
AccountSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Account', AccountSchema);
