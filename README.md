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

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Recommended)

Open this repository in GitHub Codespaces for a fully configured development environment:

1. Click the **Code** button on GitHub
2. Select the **Codespaces** tab
3. Click **Create codespace on [branch]**

The environment will automatically:
- Install all dependencies
- Configure VS Code extensions for React and TailwindCSS
- Set up port forwarding for the dev server

Once the codespace is ready, run:
```bash
npm run dev
```

### Option 2: Local Development

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
    ├── main.jsx                    # React entry point
    ├── index.css                   # Global styles + Tailwind
    ├── pages/
    │   └── Landing.jsx             # Landing page component
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
