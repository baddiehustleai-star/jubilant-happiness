// Photo2Profit Content & Marketing Agent Setup

// Goals:
// 1. Automate creation of launch content (emails, tweets, social posts)
// 2. Repurpose branded materials from Photo2Profit brand kit
// 3. Help schedule, track, and optimize posts using markdown and AI tools

export const brand = {
  name: 'Photo2Profit',
  domain: 'photo2profit.online',
  tagline: 'Turn your camera roll into cashflow.',
  heroCTA: 'Upload photos. Earn daily.',
  demoVideo: 'https://yourlink.com/demo.mp4',
};

export const marketingAgent = {
  tools: {
    copywriter: true,
    imagePostGenerator: true,
    newsletterWriter: true,
    tweetThreadWriter: true,
    productHuntLaunch: true,
    seoPageGenerator: true,
    contentScheduler: false, // requires integration
  },
  tone: 'confident, clever, baddie-energy, founder-forward',
  structure: [
    'createBrandPost()',
    'generateLaunchEmail()',
    'generateTweetThread()',
    'generateSEOPage()',
    'generateNewsletter()',
    'renderInstagramVisual()',
  ],
};

// Example: Launch Tweet Thread Generator
export function generateTweetThread() {
  return [
    '🚨 Just launched: Photo2Profit',
    'Got 5,000+ photos on your phone? Time to turn those into cash.',
    "Here's how it works 👇",
    "1. Upload your camera roll (we'll sort them)",
    '2. We match your best pics to paid stock photo buyers',
    '3. You get paid. Daily.',
    'No followers. No editing. Just cash for your content.',
    `🎥 Demo: ${brand.demoVideo}`,
    `Launch site: https://${brand.domain}`,
    'Tag someone sitting on 10k+ photos 💰',
    '#photo2profit #creatorincome #sidehustle',
  ];
}

// Generate Launch Email
export function generateLaunchEmail() {
  return {
    subject: `${brand.name} is live — Turn photos into profit 💰`,
    preheader: 'Your camera roll is worth more than you think.',
    body: `
Hi there,

We just launched ${brand.name}, and I'm excited to share it with you.

${brand.tagline}

If you're like most people, you have thousands of photos sitting on your phone doing nothing. What if those photos could earn you money — every single day?

That's exactly what ${brand.name} does.

Here's how it works:
1. Upload your camera roll (we'll sort them)
2. We match your best pics to paid stock photo buyers
3. You get paid. Daily.

No editing. No followers. No hassle.

🎥 Watch the demo: ${brand.demoVideo}
🚀 ${brand.heroCTA}: https://${brand.domain}

Turn your camera roll into cashflow today.

Cheers,
The ${brand.name} Team
    `.trim(),
  };
}

// Generate SEO Page Content
export function generateSEOPage() {
  return {
    title: `${brand.name} | ${brand.tagline}`,
    metaDescription:
      'Turn your camera roll into passive income. Upload photos, get matched with buyers, earn daily. No editing, no followers required.',
    h1: brand.tagline,
    h2: 'How It Works',
    content: `
## How It Works

### 1. Upload Your Photos
Simply upload your camera roll. We'll automatically sort and organize your best shots.

### 2. Get Matched with Buyers
Our AI matches your photos with paid stock photo buyers looking for authentic content.

### 3. Earn Daily
Get paid every day for your photos. No followers, no editing, just cash.

## Why ${brand.name}?

- **Passive Income**: Earn money from photos you've already taken
- **No Experience Needed**: We handle the matching and sales
- **Daily Payments**: Get paid every single day
- **Zero Editing**: Use photos straight from your camera roll

## Ready to Start Earning?

${brand.heroCTA}
    `.trim(),
    cta: {
      text: brand.heroCTA,
      url: `https://${brand.domain}`,
    },
  };
}

// Generate Newsletter Content
export function generateNewsletter() {
  return {
    subject: '📸 This Week in Photo2Profit',
    sections: [
      {
        title: "🎉 What's New",
        content: `We're constantly improving ${brand.name} to help you earn more from your photos. This week's updates focus on better matching and faster payments.`,
      },
      {
        title: '💡 Creator Tip',
        content:
          'Did you know? Photos with natural lighting and authentic moments perform 3x better with buyers. Keep shooting what you love — authenticity sells.',
      },
      {
        title: '📊 Your Impact',
        content:
          'Our community has uploaded over 1 million photos this month. Join thousands of creators turning their camera rolls into cashflow.',
      },
      {
        title: '🚀 Get Started',
        content: `Haven't uploaded yet? ${brand.heroCTA} and start earning today.`,
        cta: {
          text: 'Upload Photos Now',
          url: `https://${brand.domain}`,
        },
      },
    ],
  };
}

// Create Brand Post (Generic Social Media Post)
export function createBrandPost(platform = 'instagram') {
  const posts = {
    instagram: {
      caption: `💰 ${brand.tagline}\n\n${brand.heroCTA}\n\nLink in bio 👆\n\n#photo2profit #creatoreconomy #passiveincome #sidehustle #contentcreator`,
      hashtags: [
        'photo2profit',
        'creatoreconomy',
        'passiveincome',
        'sidehustle',
        'contentcreator',
      ],
    },
    facebook: {
      text: `Introducing ${brand.name} 📸\n\n${brand.tagline}\n\nGot thousands of photos on your phone? Time to turn them into daily income.\n\n✨ No editing required\n✨ No followers needed\n✨ Just upload and earn\n\n${brand.heroCTA}\n👉 ${brand.domain}`,
    },
    linkedin: {
      text: `Excited to announce the launch of ${brand.name}!\n\nWe're solving a simple problem: Most people have thousands of photos that could generate income, but no easy way to monetize them.\n\n${brand.name} changes that.\n\nOur platform automatically matches your photos with buyers, handles the sales process, and pays you daily.\n\nNo editing. No followers. Just upload and earn.\n\nCheck it out: https://${brand.domain}`,
    },
  };

  return posts[platform] || posts.instagram;
}

// Render Instagram Visual Data (for design tools)
export function renderInstagramVisual() {
  return {
    format: 'instagram-post',
    dimensions: { width: 1080, height: 1080 },
    background: '#FAF6F2', // blush color
    elements: [
      {
        type: 'logo',
        position: 'center-top',
        size: 'large',
      },
      {
        type: 'headline',
        text: brand.tagline,
        font: 'Cinzel Decorative',
        color: '#B76E79', // rose-dark
        position: 'center',
        size: 48,
      },
      {
        type: 'cta',
        text: brand.heroCTA,
        font: 'Montserrat',
        color: '#3D2B2B', // dark
        position: 'center-bottom',
        size: 32,
      },
      {
        type: 'decoration',
        style: 'rose-gold-gradient',
        opacity: 0.3,
      },
    ],
    callToAction: brand.domain,
  };
}

// Export all marketing functions for easy access
export const marketingFunctions = {
  generateTweetThread,
  generateLaunchEmail,
  generateSEOPage,
  generateNewsletter,
  createBrandPost,
  renderInstagramVisual,
};
