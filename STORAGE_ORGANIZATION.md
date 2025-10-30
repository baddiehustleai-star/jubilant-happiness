# Firebase Storage Organization Guide 🗂️

This document explains the organized Firebase Storage structure implemented in Photo2Profit.

## 📁 Storage Structure

All uploads are organized in a hierarchical folder structure for better management and scalability:

```
uploads/
├── Women/
│   ├── Tops/
│   │   └── [listingId]/
│   │       ├── 1234567890_image1.jpg
│   │       └── 1234567891_image2.jpg
│   ├── Bottoms/
│   │   └── [listingId]/
│   │       └── 1234567890_photo.jpg
│   └── Dresses/
│       └── [listingId]/
│           └── 1234567890_item.jpg
├── Electronics/
│   └── Tools/
│       └── [listingId]/
│           └── 1234567890_product.jpg
└── Misc/
    └── [listingId]/
        └── 1234567890_generic.jpg
```

## 🎯 Key Benefits

### 1. **Organization by Category**
Files are automatically sorted into category-based folders:
- `Women > Tops` → `uploads/Women/Tops/`
- `Electronics > Tools` → `uploads/Electronics/Tools/`
- No category → `uploads/Misc/`

### 2. **Isolation by Listing**
Each listing gets its own folder using the listing ID:
- Prevents filename conflicts
- Makes it easy to find all images for a listing
- Simplifies deletion when listing is removed

### 3. **Unique Filenames**
Files are renamed with timestamp prefix:
- Original: `photo.jpg`
- Stored as: `1234567890_photo.jpg`
- Prevents overwrites and maintains chronological order

### 4. **Clean Paths**
Category names are sanitized for storage:
- Spaces are converted to slashes: `Women > Tops` → `Women/Tops`
- Special characters are removed
- Only alphanumeric, hyphens, and underscores allowed

## 🔧 How It Works

### Basic Upload

```javascript
import { uploadToStorage } from './scripts/firebase-storage.js';

const result = await uploadToStorage(
  './image.jpg',           // Local file path
  'listing-123',           // Listing ID
  'Women > Tops'           // Category
);

// Result:
// {
//   url: 'https://firebasestorage.googleapis.com/...',
//   path: 'uploads/Women/Tops/listing-123/1234567890_image.jpg',
//   size: 123456,
//   mimeType: 'image/jpeg',
//   metadata: { ... }
// }
```

### Upload with Listing

The `upload-listing.js` script automatically handles category organization:

```javascript
import { uploadListing } from './scripts/upload-listing.js';

const listing = await uploadListing('./photo.jpg', {
  category: 'Women > Dresses',
  title: 'Vintage Summer Dress',
  price: '$35'
});

// Image is automatically uploaded to:
// uploads/Women/Dresses/[auto-generated-id]/[timestamp]_photo.jpg
```

### Multiple Images per Listing

```javascript
import { uploadListingWithMultipleImages } from './scripts/upload-listing.js';

const listing = await uploadListingWithMultipleImages(
  ['./front.jpg', './back.jpg', './detail.jpg'],
  {
    category: 'Women > Tops',
    title: 'Designer Blazer'
  }
);

// All images stored in same listing folder:
// uploads/Women/Tops/[listing-id]/1234567890_front.jpg
// uploads/Women/Tops/[listing-id]/1234567891_back.jpg
// uploads/Women/Tops/[listing-id]/1234567892_detail.jpg
```

## 📊 Storage Metadata

Each uploaded file includes rich metadata:

```javascript
{
  contentType: 'image/jpeg',
  customMetadata: {
    listingId: 'listing-123',
    category: 'Women > Tops',
    uploadedAt: '2025-10-30T04:12:20.088Z',
    originalName: 'photo',
    imageIndex: '0'  // For multi-image uploads
  }
}
```

## 🛠️ Utility Functions

### Build Storage Path

```javascript
import { buildStoragePath } from './scripts/firebase-storage.js';

const path = buildStoragePath('Women > Tops', 'listing-123', 'image.jpg');
// Returns: 'uploads/Women/Tops/listing-123/image.jpg'
```

### Parse Storage Path

```javascript
import { parseStoragePath } from './scripts/firebase-storage.js';

const info = parseStoragePath('uploads/Women/Tops/listing-123/1234567890_image.jpg');
// Returns:
// {
//   category: 'Women > Tops',
//   listingId: 'listing-123',
//   filename: '1234567890_image.jpg'
// }
```

### Delete from Storage

```javascript
import { deleteFromStorage } from './scripts/firebase-storage.js';

// Delete by URL
await deleteFromStorage('https://firebasestorage.googleapis.com/...');

// Or by path
await deleteFromStorage('uploads/Women/Tops/listing-123/image.jpg');
```

## 📋 Category Examples

Common category structures that map to organized folders:

| Category Input | Storage Path |
|----------------|--------------|
| `Women > Tops` | `uploads/Women/Tops/` |
| `Women > Bottoms` | `uploads/Women/Bottoms/` |
| `Women > Dresses` | `uploads/Women/Dresses/` |
| `Women > Outerwear` | `uploads/Women/Outerwear/` |
| `Electronics > Tools` | `uploads/Electronics/Tools/` |
| `Electronics > Gadgets` | `uploads/Electronics/Gadgets/` |
| `Home > Decor` | `uploads/Home/Decor/` |
| `Misc` | `uploads/Misc/` |
| *(no category)* | `uploads/Misc/` |

## 🔍 Finding Files in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Storage** in the left menu
4. Browse the organized folder structure:
   - Click `uploads/`
   - Select a category folder (e.g., `Women/`)
   - Select a subcategory (e.g., `Tops/`)
   - View all listing folders
   - Click a listing ID folder to see its images

## 🧹 Maintenance

### Cleanup Orphaned Images

The system includes a cleanup function to remove images without corresponding Firestore documents:

```javascript
import { cleanupOrphanedImages } from './scripts/firebase-storage.js';

await cleanupOrphanedImages();
```

*Note: This is currently a placeholder and needs to be fully implemented.*

### Storage Analytics

Get analytics for uploaded files:

```javascript
import { getStorageAnalytics } from './scripts/firebase-storage.js';

const stats = getStorageAnalytics('Women/Tops');
// Returns analytics for that category
```

*Note: This is currently a placeholder and needs to be fully implemented.*

## 🚀 Advanced Features

### Image Variants (Future)

The system is prepared for generating multiple image sizes:

```javascript
import { generateImageVariants } from './scripts/firebase-storage.js';

const variants = await generateImageVariants(
  './photo.jpg',
  'listing-123',
  'Women > Tops'
);

// Will generate:
// - Original size
// - Thumbnail (future)
// - Medium (future)
// - Large (future)
```

## 🔐 Security Considerations

1. **Firebase Storage Rules**: Set up proper security rules in Firebase Console
2. **Environment Variables**: Store Firebase config in `.env` file
3. **Public URLs**: All uploaded images get public URLs by default
4. **Access Control**: Consider implementing user-based access rules

## 📈 Scalability

This organized structure supports:

- ✅ Unlimited categories and subcategories
- ✅ Unlimited listings per category
- ✅ Multiple images per listing
- ✅ Easy browsing and searching
- ✅ Efficient deletion of listing images
- ✅ Clear audit trails with metadata
- ✅ Automatic conflict prevention

## 🎓 Best Practices

1. **Always provide a category** when uploading to ensure proper organization
2. **Use consistent category naming** (e.g., always use `Women > Tops`, not `women > tops`)
3. **Clean up listings properly** - delete images when removing listings from Firestore
4. **Monitor storage usage** in Firebase Console
5. **Set up lifecycle policies** for automatic cleanup of old files
6. **Use image optimization** before uploading to save storage costs

## 🐛 Troubleshooting

### "File not found" errors
- Verify the local file path exists
- Check file permissions

### "Upload failed" errors
- Verify Firebase credentials are set
- Check Firebase Storage is enabled in console
- Verify storage bucket name is correct

### Images not organized correctly
- Verify category format matches pattern: `Category > Subcategory`
- Check for special characters that might be stripped

### Can't find uploaded images
- Check the correct category folder in Firebase Console
- Verify the listing ID used in the path
- Use the `parseStoragePath` utility to debug paths

## 📚 Related Documentation

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase setup and configuration
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firestore Collections Guide](./FIREBASE_SETUP.md#-firestore-collections-structure)

---

**Built for Photo2Profit** - Making reselling automated, organized, and profitable! 🚀
