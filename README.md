# Photo2Profit 💎

Turn your photos into profit — AI-powered listings, background removal, and instant cross-posting.

A modern, luxe-themed React application built with **Vite + TailwindCSS** featuring rose-gold branding and elegant typography.

## ✨ Features

### Currently Implemented
- 🎨 **Rose-Gold Theme** - Custom color palette with blush, rose, and gold tones
- 💎 **Luxe Design** - Cinzel Decorative + Montserrat typography
- ⚡ **Vite** - Lightning-fast dev server and optimized builds
- ⚛️ **React 18** - Modern React with hooks
- 🎯 **TailwindCSS** - Utility-first styling with custom configuration
- 📱 **Responsive** - Mobile-first design approach
- 🚀 **Photo Upload** - Drag-and-drop and file browser support with preview
- 📊 **Workspace Dashboard** - Project management interface with stats
- 🔄 **Routing** - React Router for seamless navigation

### Coming Soon
- 🤖 **AI-Powered Listings** - Generate compelling product descriptions
- ✂️ **Background Removal** - Professional photo editing
- 📤 **Cross-Posting** - Share to multiple marketplaces instantly
- 🔐 **Authentication** - User accounts and data management
- 💾 **Export/Download** - Save and share your listings

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Your app will be running at `http://localhost:5173`

## 📁 Project Structure

```
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Custom Tailwind theme
├── postcss.config.js               # PostCSS configuration
└── src/
    ├── main.jsx                    # React entry point with routing
    ├── index.css                   # Global styles + Tailwind
    ├── pages/
    │   ├── Landing.jsx             # Landing page component
    │   ├── Upload.jsx              # Photo upload with drag-and-drop
    │   └── Workspace.jsx           # Dashboard for project management
    └── assets/
        └── photo2profit-logo.svg   # Logo
```

## 🎨 Custom Theme

The starter includes a pre-configured rose-gold color palette:

- **Blush**: `#FAF6F2` - Background
- **Rose**: `#E6A4A4` - Primary accent
- **Rose Dark**: `#B76E79` - Headers and emphasis
- **Gold**: `#F5C26B` - Secondary accent
- **Dark**: `#3D2B2B` - Text

### Using Custom Colors

```jsx
// In Tailwind classes
<div className="bg-blush text-rose-dark">
  <button className="bg-rose hover:bg-gold">Click me</button>
</div>
```

## 🔤 Typography

- **Headers**: Cinzel Decorative (serif) - `font-diamond`
- **Body**: Montserrat (sans-serif) - `font-sans`

Google Fonts are loaded via CDN in `src/index.css`.

## 📦 Tech Stack

- **React**: ^18.3.1
- **React Router DOM**: ^6.28.0
- **Vite**: ^5.4.1
- **TailwindCSS**: ^3.4.14
- **PostCSS**: ^8.4.38
- **Autoprefixer**: ^10.4.19

## 🎯 Current Features

### Landing Page
- Beautiful hero section with logo and branding
- Call-to-action buttons for Upload and Workspace
- Responsive design with rose-gold theme

### Upload Page
- Drag-and-drop file upload
- File browser for image selection
- Live image preview
- Remove and process image options
- Feature cards explaining capabilities

### Workspace Dashboard
- Project statistics (total, processed, pending)
- Recent projects grid with thumbnails
- Project status badges
- Edit and export buttons (ready for integration)
- Navigation header with quick upload access

## 🚀 Next Development Steps

To complete the Photo2Profit application, implement these features:

1. **Background Removal API Integration**
   - Integrate with background removal service (remove.bg, etc.)
   - Add processing indicators and progress bars
   - Show before/after comparison

2. **AI-Powered Listing Generator**
   - Integrate with OpenAI/GPT API for product descriptions
   - Add form for product details (price, category, condition)
   - Generate optimized titles and descriptions

3. **Cross-Posting Integration**
   - Add marketplace connectors (eBay, Poshmark, Mercari, etc.)
   - Implement OAuth flows for authentication
   - Batch posting capability

4. **User Authentication**
   - Add Firebase Auth or Auth0
   - User profiles and settings
   - Secure API endpoints

5. **Backend API**
   - Set up Express/Node.js or Firebase backend
   - Store user projects and images
   - Handle API integrations securely

6. **Enhanced Image Editor**
   - Crop, rotate, and resize tools
   - Filters and adjustments
   - Text overlay for watermarks

## 🛠️ Customization

### Replace the Logo

Replace `src/assets/photo2profit-logo.svg` with your own logo:

```jsx
// The logo is imported in Landing.jsx
import logo from "../assets/photo2profit-logo.svg";
```

### Update Colors

Edit `tailwind.config.js` to customize the color palette:

```js
theme: {
  extend: {
    colors: {
      // Add your custom colors here
    }
  }
}
```

### Modify Typography

Update font imports in `src/index.css` and font families in `tailwind.config.js`.

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `/dist`)
- `npm run preview` - Preview production build locally

## 🚢 Deployment

The built files are static and can be deployed to any hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop the `/dist` folder
- **GitHub Pages**: Use the `/dist` folder as your site source

## 📄 License

See [LICENSE](LICENSE) for details.

---

**Built with 💎 for Photo2Profit**
