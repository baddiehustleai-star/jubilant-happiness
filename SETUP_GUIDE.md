# 🚀 Setup Guide for Photo2Profit

This guide will help you set up your local development environment and configure all necessary services.

## Prerequisites

- Node.js 18+ installed
- A GitHub account
- A Stripe account (for payment processing)
- A Firebase account (for backend services)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/baddiehustleai-star/jubilant-happiness.git
cd jubilant-happiness

# Install dependencies
npm install
```

This will automatically:

- Install all npm packages
- Set up Husky Git hooks
- Configure lint-staged for pre-commit linting

## Step 2: Set Up Environment Variables

### Create Your Local Environment File

```bash
# Copy the example file to create your local .env file
cp .env.example .env
```

### Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to Project Settings → General
4. Under "Your apps", add a web app if you haven't already
5. Copy the Firebase configuration values and add them to your `.env` file:

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Configure Stripe

#### Get Your Stripe Secret Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers → API keys
3. Copy your **Secret key** (it starts with `sk_test_` for test mode)
4. Add it to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

#### Create and Configure a Stripe Price ID

1. In the Stripe Dashboard, go to Products
2. Click "Add product"
3. Fill in product details:
   - Name: "Photo2Profit Monthly Subscription" (or your preferred name)
   - Description: Optional
   - Price: $9.99 (or your preferred price)
   - Billing period: Monthly
4. Click "Save product"
5. Copy the **Price ID** (it starts with `price_`)
6. Add it to your `.env` file:

```env
# This MUST be prefixed with VITE_ so Vite exposes it to the frontend
VITE_STRIPE_PRICE_ID=price_your_price_id_here
```

**Important:** The Stripe Price ID must be prefixed with `VITE_` so that Vite can expose it to the browser. The STRIPE*SECRET_KEY should NOT have the VITE* prefix as it should only be used server-side.

### Optional: Configure Additional Services

#### Remove.bg (for background removal)

1. Sign up at [remove.bg](https://www.remove.bg/api)
2. Get your API key
3. Add to `.env`:

```env
REMOVEBG_API_KEY=your_removebg_api_key
```

#### eBay API (for cross-posting)

1. Register at [eBay Developers Program](https://developer.ebay.com/)
2. Create an application
3. Get your credentials and add to `.env`:

```env
EBAY_APP_ID=your_ebay_app_id
EBAY_CERT_ID=your_ebay_cert_id
EBAY_DEV_ID=your_ebay_dev_id
EBAY_OAUTH_TOKEN=your_ebay_oauth_token
```

#### SendGrid (for email notifications)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Add to `.env`:

```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Step 3: Verify Your Setup

Run the setup validation script to check your configuration:

```bash
npm run validate-setup
```

This will check:

- ✓ All required environment variables are set
- ✓ Stripe configuration is valid
- ✓ Firebase configuration is valid
- ✓ Git hooks are installed properly

## Step 4: Start Development

```bash
# Start the development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your app!

## Step 5: Deploy to Vercel

### Initial Setup

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Configure Environment Variables in Vercel

1. In your Vercel project, go to Settings → Environment Variables
2. Add each environment variable from your `.env` file:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `STRIPE_SECRET_KEY` (⚠️ Keep this secret!)
   - `VITE_STRIPE_PRICE_ID`
   - Any optional API keys you're using

3. Click "Save" for each variable

### Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be live at your Vercel URL!

## Git Hooks (Pre-commit)

The project uses Husky and lint-staged to automatically lint and format your code before each commit:

- **Husky**: Manages Git hooks
- **lint-staged**: Runs linters only on staged files

When you run `git commit`, the pre-commit hook will:

1. Run Prettier to format your code
2. Run ESLint to check for code quality issues
3. Automatically fix fixable issues
4. Only commit if all checks pass

This ensures code quality and consistency across the project!

## Troubleshooting

### "STRIPE_SECRET_KEY is not defined"

Make sure you:

1. Created a `.env` file in the project root
2. Added `STRIPE_SECRET_KEY=sk_test_...` to the file
3. Restarted your development server

### "Cannot find module 'dotenv'"

Run `npm install` to ensure all dependencies are installed.

### Husky hooks not working

Run:

```bash
npm run prepare
```

This will reinstall Husky hooks.

### Build fails in Vercel

1. Check that all environment variables are set in Vercel
2. Make sure `VITE_STRIPE_PRICE_ID` has the `VITE_` prefix
3. Check the build logs for specific errors

## Need Help?

- 📧 Email: support@photo2profit.app
- 📖 Full documentation: See README.md
- 🐛 Issues: Open an issue on GitHub

---

**Happy coding! ✨**
