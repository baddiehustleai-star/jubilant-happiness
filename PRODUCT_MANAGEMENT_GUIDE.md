# Product Management Guide

## 🎯 Overview

Your Photo2Profit app now has complete product management with Firebase Firestore storage and a beautiful dashboard for viewing and editing products.

## 🏗️ Architecture

```
User uploads photo
       ↓
AI processes (remove background, analyze, price)
       ↓
saveProduct() stores in Firestore
       ↓
Products Dashboard displays all products
       ↓
Click product → Product Editor
       ↓
Edit & save → Updates Firestore
```

## 📦 Product Schema

Every product in Firestore has this structure:

```javascript
{
  id: "auto-generated-id",
  title: "Product Name",
  description: "AI-generated or user-edited description",
  imageUrl: "https://... or data:image/...",
  priceOptions: {
    used: 45.99,
    marketplace: 65.00,
    new: 89.99
  },
  published: false,              // Publishing status
  channels: ["ebay", "facebook"], // Where to publish
  publishedAt: null,              // Timestamp when published
  publishResults: {},             // Results from each marketplace
  createdAt: "2025-01-11T10:30:00.000Z",
  updatedAt: "2025-01-11T10:30:00.000Z",
  userEmail: "user@example.com"   // Owner (if multi-user)
}
```

## 🎨 User Interface

### Products Dashboard (`/products`)

**Features:**

- Grid view of all products with images
- Filter by status: All, Published, Drafts
- Hover animations and smooth transitions
- Click any product to edit
- Summary stats (Total, Published, Drafts)

**Empty State:**

- Shows when no products exist
- Friendly message with upload button
- Responsive design

### Product Editor (`/product/:id`)

**Features:**

- Edit title and description
- Update pricing for used/marketplace/new
- View publishing status badge
- Auto-save with loading state
- Cancel button to go back
- Timestamps (created/updated)
- Responsive form layout

## 🔧 API Integration

### Saving Products (Backend)

In your AI processing code (e.g., after background removal):

```javascript
import { saveProduct } from './services/autopublish.service.js';

// After AI generates product data
const productId = await saveProduct({
  title: aiGeneratedTitle,
  description: aiGeneratedDescription,
  priceOptions: {
    used: aiPriceUsed,
    marketplace: aiPriceMarketplace,
    new: aiPriceNew,
  },
  imageUrl: uploadedImageUrl,
  published: false,
  channels: ['ebay', 'facebook'],
});

console.log('✅ Product saved:', productId);
```

### Loading Products (Frontend)

The `ProductsDashboard` component automatically loads products:

```javascript
// Loads all products, ordered by creation date
const snapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
```

### Updating Products (Frontend)

The `ProductEditor` component handles updates:

```javascript
await updateDoc(ref, {
  title: product.title,
  description: product.description,
  priceOptions: product.priceOptions,
  updatedAt: new Date().toISOString(),
});
```

## 🚀 Usage Examples

### Example 1: Upload and Auto-Save

```javascript
// User uploads photo
// AI processes it
// Automatically saves to Firestore

POST /api/upload
→ AI processing
→ saveProduct(data)
→ Product appears in dashboard
```

### Example 2: Edit Product

```
1. Navigate to /products
2. Click on a product card
3. Update title, description, or prices
4. Click "Save Changes"
5. Automatically redirects back to dashboard
```

### Example 3: Filter Products

```
1. Go to /products
2. Click "Published" to see only live products
3. Click "Drafts" to see unpublished products
4. Click "All" to see everything
```

## 🎯 Integration with Auto-Publishing

Products integrate seamlessly with the auto-publishing system:

1. **Created as Draft**: All new products start with `published: false`
2. **Threshold Triggers**: When you hit N products, auto-publish runs
3. **Status Updates**: After publishing, `published: true` is set
4. **Results Stored**: Publishing results saved in `publishResults`

## 📱 Routes

| Route          | Component         | Purpose             |
| -------------- | ----------------- | ------------------- |
| `/products`    | ProductsDashboard | View all products   |
| `/product/:id` | ProductEditor     | Edit single product |
| `/dashboard`   | Dashboard         | Upload new products |
| `/orders`      | Orders            | View sales          |

## 🧪 Testing

### 1. Test Product Creation

```bash
# Upload a product photo via frontend
# Check Firestore in Firebase Console
# Should see new document in `products` collection
```

### 2. Test Product Listing

```bash
# Navigate to /products
# Should see all products in grid
# Try filtering by Published/Drafts
```

### 3. Test Product Editing

```bash
# Click on a product
# Change title or price
# Click "Save Changes"
# Check Firestore - should see updated values
```

### 4. Verify from Command Line

```bash
# In Google Cloud Shell
gcloud firestore documents list products

# Should output list of products with IDs
```

## 🔐 Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products collection
    match /products/{productId} {
      // Anyone can read products
      allow read: if true;

      // Only authenticated users can create
      allow create: if request.auth != null;

      // Only owner can update/delete (if userEmail matches)
      allow update, delete: if request.auth != null
        && request.auth.token.email == resource.data.userEmail;
    }
  }
}
```

## 📊 Firestore Indexes

For better performance, create these indexes:

```bash
# Index on published + createdAt for filtering
gcloud firestore indexes composite create \
  --collection-group=products \
  --field-config=field-path=published,order=ascending \
  --field-config=field-path=createdAt,order=descending
```

## 🎨 Customization

### Change Grid Layout

In `ProductsDashboard.jsx`:

```javascript
// Current: 3 columns on large screens
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

// Change to 4 columns:
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
```

### Add Delete Button

In `ProductEditor.jsx`:

```javascript
import { deleteDoc } from 'firebase/firestore';

async function handleDelete() {
  if (confirm('Delete this product?')) {
    await deleteDoc(doc(db, 'products', product.id));
    navigate('/products');
  }
}

// Add button in UI
<button onClick={handleDelete} className="text-red-600">
  Delete Product
</button>;
```

### Add Search

In `ProductsDashboard.jsx`:

```javascript
const [search, setSearch] = useState('');

const filteredProducts = products.filter(
  (p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
);

// Add search input in UI
<input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border rounded-lg px-4 py-2"
/>;
```

## 📚 Next Steps

1. ✅ Products auto-save from AI processing
2. ✅ Dashboard displays all products
3. ✅ Edit functionality working
4. 🔲 Add public product pages (`/p/:id`)
5. 🔲 Add share functionality
6. 🔲 Add bulk operations (delete multiple)
7. 🔲 Add export to CSV
8. 🔲 Add image gallery for multiple photos

## 🐛 Troubleshooting

### Products not showing up

**Check:**

- Is Firebase initialized? Look for `🔥 Firebase initialized` in console
- Are products being saved? Check server logs for `✅ Product saved`
- Firestore rules allowing reads?

### Can't edit products

**Check:**

- User authenticated?
- Firestore rules allowing updates?
- Product ID valid in URL?

### Images not displaying

**Check:**

- Image URLs valid?
- CORS issues? (Use Cloud Storage for production)
- Base64 images might be too large

---

**Ready to sell!** Your products are now persistently stored, beautifully displayed, and fully editable. 🎉
