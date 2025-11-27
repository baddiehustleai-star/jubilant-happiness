const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Reseller Specifics
  title: { type: String, required: true }, // "Vintage Nike Windbreaker"
  description: String,
  price: Number,
  currency: { type: String, default: 'USD' },
  condition: { type: String, enum: ['NEW', 'LIKE NEW', 'GOOD', 'FAIR'] },
  brand: String,
  size: String,
  sku: String,

  // Gallery (Resellers need front, back, tag, flaws)
  images: [String], // Array of S3/Cloudinary URLs

  // Links to where it is sold (for cross-promotion)
  marketplaceLinks: {
    poshmark: String,
    ebay: String,
    depop: String,
    mercari: String,
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamp on save
InventorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InventoryItem', InventorySchema);
