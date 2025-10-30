# Photo2Profit 💎

Turn your photos into profit — AI-powered listings, background removal, and instant cross-posting.

A modern, luxe-themed React starter built with **Vite + TailwindCSS** featuring rose-gold branding and elegant typography.

## ✨ Features

- 🎨 **Rose-Gold Theme** - Custom color palette with blush, rose, and gold tones
- 💎 **Luxe Design** - Cinzel Decorative + Montserrat typography
- ⚡ **Vite** - Lightning-fast dev server and optimized builds
- ⚛️ **React 18** - Modern React with hooks
- 🎯 **TailwindCSS** - Utility-first styling with custom configuration
- 📱 **Responsive** - Mobile-first design approach
- 📦 **Export History & Download Center** - Generate and manage CSV exports for multiple platforms
- 🔄 **Weekly Automation** - Automated CSV generation and email notifications
- 🤖 **AI Market Insights** - AI-generated market trend summaries

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

## 📦 Export History & Download Center

The Export History & Download Center allows you to generate CSV exports for multiple resale platforms and manage your export history. See [docs/EXPORT_HISTORY.md](docs/EXPORT_HISTORY.md) for detailed documentation.

### Key Features:
- **Multi-Platform Support**: Mercari, Depop, Poshmark, eBay
- **Automated Exports**: Weekly CSV generation with email notifications
- **Export History**: Track and download all your exports
- **AI Market Trends**: Get weekly insights about your listings
- **Firebase Integration**: Secure storage and real-time updates

### Quick Access:
- Dashboard: Navigate to `/dashboard` after starting the dev server
- Documentation: See [docs/EXPORT_HISTORY.md](docs/EXPORT_HISTORY.md)

## 📁 Project Structure

```
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Custom Tailwind theme
├── postcss.config.js               # PostCSS configuration
├── .env.example                    # Firebase configuration template
├── docs/
│   └── EXPORT_HISTORY.md          # Export feature documentation
├── functions/
│   ├── package.json               # Cloud Functions dependencies
│   └── index.js                   # Weekly automation & exports
└── src/
    ├── main.jsx                    # React entry point
    ├── index.css                   # Global styles + Tailwind
    ├── config/
    │   └── firebase.js            # Firebase configuration
    ├── utils/
    │   ├── csvAdapters.js         # CSV generators for platforms
    │   └── exportService.js       # Export logic & Firebase API
    ├── components/
    │   └── ExportHistory.jsx      # Export history table
    ├── pages/
    │   ├── Landing.jsx            # Landing page component
    │   └── Dashboard.jsx          # Dashboard with export features
    └── assets/
        └── photo2profit-logo.svg   # Logo placeholder
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
- **Vite**: ^5.4.1
- **TailwindCSS**: ^3.4.14
- **PostCSS**: ^8.4.38
- **Autoprefixer**: ^10.4.19
- **Firebase**: ^11.0.0 (Auth, Firestore, Storage, Functions)
- **React Router**: ^7.0.0
- **PapaParse**: ^5.4.1 (CSV generation)
- **SendGrid**: ^8.0.0 (Email notifications)

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
