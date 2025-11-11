# Photo2Profit Branding System

A comprehensive design system for the Photo2Profit application featuring elegant rose-gold branding, AI-powered reselling platform UI components, and consistent visual identity.

## 🎨 Brand Identity

**Firebase Project:** 758851214311

### Color Palette

- **Primary:** Rose (#E11D48) - Passionate, energetic selling
- **Secondary:** Gold (#F59E0B) - Premium, profitable outcomes
- **Accent:** Cream (#FEF7CD) - Warm, approachable
- **Neutral:** Dark (#1F2937) - Professional, trustworthy

### Typography

- **Headings:** "Playfair Display" - Elegant, premium feel
- **Body:** "Inter" - Clean, readable interface text
- **Brand:** "Diamond" - Distinctive logo typography

### Design Principles

1. **Luxury & Accessibility:** Premium feel that's approachable
2. **Trust & Reliability:** Professional interface for business users
3. **Energy & Success:** Motivational colors and animations
4. **Clarity & Focus:** Clean layouts that guide user actions

## 🚀 Quick Start

```jsx
import { BrandButton, BrandCard, BrandHeading, BrandText, Logo } from '../components/branding';

function MyComponent() {
  return (
    <BrandCard variant="luxury" padding="lg">
      <Logo size="md" />
      <BrandHeading level={2} gradient>
        Photo2Profit
      </BrandHeading>
      <BrandText size="lg" variant="secondary">
        AI-powered reselling made simple
      </BrandText>
      <BrandButton variant="primary" size="lg">
        Get Started
      </BrandButton>
    </BrandCard>
  );
}
```

## 📦 Component Library

### Layout Components

#### `BrandContainer`

Responsive container with consistent padding and max-widths.

```jsx
<BrandContainer size="default">
  <BrandHeading level={1}>Welcome to Photo2Profit</BrandHeading>
</BrandContainer>
```

**Props:**

- `size`: 'sm' | 'default' | 'lg' | 'fluid'
- `className`: Additional CSS classes

#### `BrandSection`

Page sections with consistent spacing and backgrounds.

```jsx
<BrandSection background="gradient" padding="xl">
  <BrandContainer>
    <BrandHeading level={1} variant="white">
      Hero Section
    </BrandHeading>
  </BrandContainer>
</BrandSection>
```

**Props:**

- `background`: 'default' | 'white' | 'rose' | 'gold' | 'gradient' | 'cream'
- `padding`: 'none' | 'sm' | 'default' | 'lg' | 'xl'

### UI Components

#### `BrandButton`

Consistent button styling with multiple variants.

```jsx
<BrandButton variant="primary" size="lg" onClick={handleClick}>
  Start Free Trial
</BrandButton>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'default' | 'lg'
- `disabled`: boolean

#### `BrandCard`

Flexible card component with multiple styles.

```jsx
<BrandCard variant="luxury" padding="lg" hover>
  <BrandHeading level={3}>Feature Card</BrandHeading>
  <BrandText>Description of the feature</BrandText>
</BrandCard>
```

**Props:**

- `variant`: 'default' | 'luxury' | 'glass' | 'minimal'
- `padding`: 'none' | 'sm' | 'default' | 'lg' | 'xl'
- `hover`: boolean (adds hover effects)

#### `BrandInput`

Form input with consistent styling and validation.

```jsx
<BrandInput
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helper="We'll never share your email"
/>
```

**Props:**

- `label`: string
- `error`: string (error message)
- `helper`: string (help text)
- Standard input props

### Typography Components

#### `BrandHeading`

Responsive headings with consistent hierarchy.

```jsx
<BrandHeading level={1} variant="primary" gradient>
  Main Page Title
</BrandHeading>
```

**Props:**

- `level`: 1-6 (h1-h6)
- `variant`: 'default' | 'primary' | 'gold' | 'white' | 'light'
- `gradient`: boolean (applies gradient text)

#### `BrandText`

Body text with consistent styling.

```jsx
<BrandText size="lg" weight="semibold" variant="secondary">
  Important description text
</BrandText>
```

**Props:**

- `size`: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
- `variant`: 'default' | 'primary' | 'secondary' | 'light' | 'white' | 'gold'
- `weight`: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'

### Navigation Components

#### `BrandNavigation`

Application header with logo, navigation, and actions.

```jsx
<BrandNavigation
  navigation={[
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/pricing' },
  ]}
  actions={[
    { label: 'Sign In', variant: 'outline', onClick: signIn },
    { label: 'Get Started', variant: 'primary', onClick: getStarted },
  ]}
  fixed
/>
```

**Props:**

- `logo`: boolean (show/hide logo)
- `navigation`: Array of navigation items
- `actions`: Array of action buttons
- `variant`: 'default' | 'transparent' | 'solid' | 'dark'
- `fixed`: boolean (fixed positioning)

#### `BrandFooter`

Application footer with links and branding.

```jsx
<BrandFooter
  links={[
    {
      title: 'Product',
      items: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
      ],
    },
  ]}
  social={[{ name: 'Twitter', href: '#', icon: <TwitterIcon /> }]}
/>
```

### Brand Assets

#### `Logo`

Main Photo2Profit logo with variants.

```jsx
<Logo size="lg" variant="white" />
<LogoWithIcon size="md" />
<LogoMark size="sm" />
```

**Props:**

- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'default' | 'white' | 'dark'

## 🎨 Design Tokens

### Colors

All brand colors are available as Tailwind CSS classes:

```css
/* Primary Brand Colors */
.text-rose-500     /* Primary rose */
.bg-rose-50        /* Light rose background */
.border-rose-500   /* Rose borders */

/* Gold Accents */
.text-gold-600     /* Gold text */
.bg-gold-100       /* Light gold background */

/* Gradients */
.bg-brand-gradient    /* Rose to gold gradient */
.bg-luxury-gradient   /* Premium background */
.bg-gold-gradient     /* Gold accent gradient */
```

### Spacing

Consistent spacing scale:

- `xs`: 0.5rem (8px)
- `sm`: 1rem (16px)
- `default`: 1.5rem (24px)
- `lg`: 2rem (32px)
- `xl`: 3rem (48px)

### Shadows

Brand-specific shadow utilities:

```css
.shadow-brand     /* Primary brand shadow */
.shadow-brand-lg  /* Larger brand shadow */
.shadow-gold      /* Gold accent shadow */
```

## 💫 Animations

### Hover Effects

- `card-hover`: Subtle lift and shadow on hover
- `button-hover`: Scale and shadow animations
- `transition-brand`: Consistent transition timing

### Loading States

```jsx
<BrandSpinner size="lg" />
```

## 📱 Responsive Design

All components are mobile-first and responsive:

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1280px+

## 🔧 Customization

### Extending Colors

Add custom colors in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-rose': '#YOUR_COLOR',
      },
    },
  },
};
```

### Custom Components

Create new branded components:

```jsx
import { BrandCard, BrandText } from '../components/branding';

const CustomFeatureCard = ({ feature }) => (
  <BrandCard variant="luxury" padding="lg" hover>
    <div className="text-4xl mb-4">{feature.icon}</div>
    <BrandText weight="semibold" className="mb-2">
      {feature.title}
    </BrandText>
    <BrandText variant="secondary">{feature.description}</BrandText>
  </BrandCard>
);
```

## 📋 Best Practices

1. **Consistent Spacing**: Use the spacing scale (sm, default, lg, xl)
2. **Color Hierarchy**: Primary for actions, secondary for content
3. **Typography Scale**: Use appropriate heading levels and text sizes
4. **Interactive States**: Always include hover, focus, and disabled states
5. **Mobile First**: Design for mobile, enhance for desktop
6. **Accessibility**: Include proper ARIA labels and keyboard navigation

## 🌟 Examples

### Landing Page Hero

```jsx
<BrandSection background="gradient" padding="xl">
  <BrandContainer>
    <div className="text-center">
      <Logo size="xl" variant="white" className="mx-auto mb-8" />
      <BrandHeading level={1} variant="white" className="mb-6">
        Turn Your Photos Into Profit
      </BrandHeading>
      <BrandText variant="white" size="xl" className="mb-8">
        AI-powered listings, background removal, and cross-platform posting
      </BrandText>
      <BrandButton size="lg" variant="white">
        Start Free Trial
      </BrandButton>
    </div>
  </BrandContainer>
</BrandSection>
```

### Feature Cards Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {features.map((feature, index) => (
    <BrandCard key={index} variant="default" padding="lg" hover>
      <div className="text-center">
        <div className="text-4xl mb-4">{feature.icon}</div>
        <BrandHeading level={4} className="mb-3">
          {feature.title}
        </BrandHeading>
        <BrandText variant="secondary">{feature.description}</BrandText>
      </div>
    </BrandCard>
  ))}
</div>
```

### Form Example

```jsx
<BrandCard variant="glass" padding="lg">
  <form onSubmit={handleSubmit}>
    <BrandInput label="Email" type="email" value={email} onChange={setEmail} required />
    <BrandInput
      label="Password"
      type="password"
      value={password}
      onChange={setPassword}
      helper="Minimum 8 characters"
      required
    />
    <BrandButton type="submit" variant="primary" className="w-full">
      Sign In
    </BrandButton>
  </form>
</BrandCard>
```

## 🔄 Updates & Maintenance

The branding system is designed to be:

- **Scalable**: Easy to add new components
- **Maintainable**: Centralized styling and tokens
- **Flexible**: Customizable without breaking consistency
- **Future-proof**: Built with modern CSS and React patterns

For updates or new component requests, follow the established patterns and maintain consistency with the Photo2Profit brand identity.
