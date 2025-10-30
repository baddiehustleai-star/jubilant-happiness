# Firebase Storage Quick Reference 📋

Quick guide for using the organized Firebase Storage system in Photo2Profit.

## 🚀 Quick Upload Commands

### Single Image Upload
```bash
# Upload with auto-generated details
node scripts/upload-listing.js ./photo.jpg

# The image will be automatically organized into:
# uploads/{AI-detected-category}/{listing-id}/{timestamp}_photo.jpg
```

### Multiple Images (One Listing)
```bash
# Upload multiple images for a single listing
node scripts/upload-listing.js multi ./front.jpg ./back.jpg ./detail.jpg
```

### Bulk Upload (Multiple Listings)
```bash
# Create multiple listings from multiple images
node scripts/upload-listing.js bulk ./item1.jpg ./item2.jpg ./item3.jpg
```

### Generate Sample Data
```bash
# Create sample listings for testing
node scripts/upload-listing.js sample
```

## 📁 Storage Path Format

```
uploads/{category}/{listingId}/{timestamp}_{filename}
```

**Examples:**
- `uploads/Women/Tops/abc-123/1730266340000_shirt.jpg`
- `uploads/Electronics/Tools/def-456/1730266341000_drill.jpg`
- `uploads/Misc/ghi-789/1730266342000_item.jpg`

## 🎯 Category Mapping

| User Input | Storage Path |
|------------|--------------|
| `Women > Tops` | `uploads/Women/Tops/` |
| `Women > Bottoms` | `uploads/Women/Bottoms/` |
| `Electronics > Tools` | `uploads/Electronics/Tools/` |
| `Home > Decor` | `uploads/Home/Decor/` |
| *(empty)* | `uploads/Misc/` |

## 💻 Code Examples

### Upload with Custom Category
```javascript
import { uploadListing } from './scripts/upload-listing.js';

await uploadListing('./photo.jpg', {
  category: 'Women > Dresses',
  title: 'Vintage Summer Dress',
  price: '$35',
  condition: 'Used - Excellent'
});
```

### Upload Multiple Images
```javascript
import { uploadListingWithMultipleImages } from './scripts/upload-listing.js';

const listing = await uploadListingWithMultipleImages(
  ['./front.jpg', './back.jpg', './tag.jpg'],
  {
    category: 'Women > Tops',
    title: 'Designer Blouse',
    brand: 'Zara'
  }
);
```

### Direct Storage Upload
```javascript
import { uploadToStorage } from './scripts/firebase-storage.js';

const result = await uploadToStorage(
  './image.jpg',
  'my-listing-id',
  'Electronics > Gadgets'
);

console.log('Image URL:', result.url);
console.log('Storage Path:', result.path);
```

### Delete Image
```javascript
import { deleteFromStorage } from './scripts/firebase-storage.js';

// By URL
await deleteFromStorage('https://firebasestorage.googleapis.com/...');

// By path
await deleteFromStorage('uploads/Women/Tops/abc-123/image.jpg');
```

### Build & Parse Paths
```javascript
import { buildStoragePath, parseStoragePath } from './scripts/firebase-storage.js';

// Build path
const path = buildStoragePath('Women > Tops', 'listing-123', 'photo.jpg');
// → 'uploads/Women/Tops/listing-123/photo.jpg'

// Parse path
const info = parseStoragePath('uploads/Women/Tops/listing-123/photo.jpg');
// → { category: 'Women > Tops', listingId: 'listing-123', filename: 'photo.jpg' }
```

## 🔧 Common Operations

### Find All Images for a Listing
```javascript
// Path pattern: uploads/{category}/{listingId}/*
// Example: uploads/Women/Tops/abc-123/*
// This will contain all images for listing abc-123
```

### List Images by Category
```bash
# In Firebase Console:
# Storage → uploads → Women → Tops
# Shows all listings in "Women > Tops" category
```

### Get Upload Metadata
```javascript
// Each uploaded file includes:
{
  listingId: 'abc-123',
  category: 'Women > Tops',
  uploadedAt: '2025-10-30T04:12:20.088Z',
  originalName: 'photo',
  imageIndex: '0'  // For multi-image uploads
}
```

## 📊 File Naming Convention

```
{timestamp}_{sanitized-filename}.{ext}

Examples:
1730266340000_vintage_shirt.jpg
1730266341000_designer_blazer.png
1730266342000_summer_dress.jpg
```

**Benefits:**
- ✅ Unique filenames (timestamp ensures no conflicts)
- ✅ Chronological ordering
- ✅ Original filename preserved (sanitized)
- ✅ Supports all image formats

## 🛡️ Best Practices

### ✅ DO
- Always provide a category when uploading
- Use consistent category naming
- Delete listing images when removing listings
- Monitor storage usage in Firebase Console
- Use environment variables for Firebase config

### ❌ DON'T
- Don't hardcode Firebase credentials
- Don't upload without category (defaults to Misc)
- Don't delete listings without cleaning up images
- Don't use special characters in filenames
- Don't upload non-image files to organized structure

## 🔍 Troubleshooting

### Upload Fails
```bash
# Check Firebase config
echo $FIREBASE_API_KEY
echo $FIREBASE_STORAGE_BUCKET

# Verify credentials in scripts/firebase.js
```

### Image Not Found
```javascript
// Verify the path format
const path = buildStoragePath(category, listingId, filename);
console.log('Expected path:', path);
```

### Category Not Organizing Correctly
```javascript
// Check category format - must use " > " separator
Good: "Women > Tops"
Bad:  "women>tops" or "Women-Tops"
```

## 📚 Documentation Links

- **Full Guide**: [STORAGE_ORGANIZATION.md](./STORAGE_ORGANIZATION.md)
- **Firebase Setup**: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Main Script**: [scripts/firebase-storage.js](./scripts/firebase-storage.js)
- **Upload Script**: [scripts/upload-listing.js](./scripts/upload-listing.js)

## 🎓 Support

For issues or questions:
1. Check [STORAGE_ORGANIZATION.md](./STORAGE_ORGANIZATION.md) troubleshooting section
2. Review code comments in `scripts/firebase-storage.js`
3. Verify Firebase Console for actual storage structure
4. Check environment variables are set correctly

---

**Photo2Profit** - Organized, Scalable, Production-Ready 🚀
