/**
 * Photo2Profit — Upload Listing Function
 * --------------------------------------
 * This script takes an uploaded photo, uses AI to generate
 * the title, description, and price tiers, then saves it
 * to your Firestore database under the "listings" collection.
 */

import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { saveListing, initializeFirebase } from "./firebase.js";
import { uploadToStorage, uploadMultipleImages } from "./firebase-storage.js";

// 🧠 AI Prompting (mock implementation - replace with actual AI service)
async function generateListingDetails(imagePath, userInputs = {}) {
  // In a real implementation, this would call OpenAI/Gemini with the image
  const filename = path.basename(imagePath).toLowerCase();
  
  // Mock AI analysis based on filename keywords
  let category = "General";
  let brand = "";
  let estimatedPrice = 25;
  let tags = ["resale", "secondhand"];
  
  if (filename.includes("denim") || filename.includes("jean")) {
    category = "Women > Bottoms";
    tags = ["denim", "jeans", "casual"];
    estimatedPrice = 35;
  } else if (filename.includes("jacket") || filename.includes("coat")) {
    category = "Women > Outerwear";
    tags = ["outerwear", "jacket", "style"];
    estimatedPrice = 45;
  } else if (filename.includes("dress")) {
    category = "Women > Dresses";
    tags = ["dress", "formal", "fashion"];
    estimatedPrice = 40;
  } else if (filename.includes("tool") || filename.includes("drill")) {
    category = "Electronics > Tools";
    tags = ["tools", "hardware", "DIY"];
    estimatedPrice = 60;
  } else if (filename.includes("vintage")) {
    tags.push("vintage", "retro");
    estimatedPrice += 15;
  }
  
  // Generate price tiers based on estimated price
  const suggestedPrices = {
    thrift: `$${Math.round(estimatedPrice * 0.8)}`,
    market: `$${estimatedPrice}`,
    retail: `$${Math.round(estimatedPrice * 1.3)}`
  };
  
  return {
    title: userInputs.title || `${tags[0] || 'Stylish'} ${category.split(' > ')[1] || 'Item'}`.replace(/^\w/, c => c.toUpperCase()),
    description: userInputs.description || `Great quality ${category.toLowerCase().split(' > ')[1] || 'item'} in excellent condition. Perfect for adding style to your wardrobe or collection.`,
    category: userInputs.category || category,
    tags: userInputs.tags || tags,
    brand: userInputs.brand || brand,
    size: userInputs.size || "",
    condition: userInputs.condition || "Used - Good",
    price: userInputs.price || `$${estimatedPrice}`,
    suggestedPrices
  };
}

// 🖼️ Upload image to Firebase Storage and get public URL
async function uploadImageToFirebase(imagePath, listingId, category) {
  try {
    console.log("📤 Uploading image to Firebase Storage...");
    const uploadResult = await uploadToStorage(imagePath, listingId, category);
    return uploadResult.url;
  } catch (error) {
    console.warn("⚠️ Firebase Storage upload failed, using mock URL:", error.message);
    // Fallback to mock URL for development/testing
    const filename = path.basename(imagePath);
    return `https://firebasestorage.googleapis.com/v0/b/photo2profit/o/uploads%2F${encodeURIComponent(category.replace(/\s*>\s*/g, '/'))}%2F${listingId}%2F${filename}?alt=media`;
  }
}

// 🎯 Enhanced listing validation
function validateListingData(data) {
  const required = ['title', 'description', 'price', 'category'];
  const missing = required.filter(field => !data[field] || data[field].trim() === '');
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate price format
  if (!data.price.match(/^\$\d+(\.\d{2})?$/)) {
    throw new Error('Price must be in format $XX or $XX.XX');
  }
  
  return true;
}

// 🪄 Main upload function with enhanced Firestore structure
export async function uploadListing(imagePath, userInputs = {}) {
  try {
    console.log("📸 Processing new listing upload...");
    
    // Verify image exists
    try {
      await fs.access(imagePath);
    } catch (error) {
      throw new Error(`Image file not found: ${imagePath}`);
    }
    
    // Step 1: Generate AI-powered listing details
    console.log("🧠 Generating listing details with AI...");
    const aiDetails = await generateListingDetails(imagePath, userInputs);
    
    // Step 2: Validate the data
    validateListingData(aiDetails);
    
    // Step 3: Generate listing ID first (needed for storage path)
    const listingId = uuidv4();
    
    // Step 4: Upload image to Firebase Storage with organized folders
    console.log("📤 Uploading image to Firebase Storage...");
    const imageURL = await uploadImageToFirebase(imagePath, listingId, aiDetails.category);
    
    // Step 5: Build complete listing object with enhanced schema
    const timestamp = new Date().toISOString();
    
    const listingData = {
      // Core listing information
      title: aiDetails.title,
      description: aiDetails.description,
      category: aiDetails.category,
      price: aiDetails.price,
      suggestedPrices: aiDetails.suggestedPrices,
      
      // Product details
      tags: aiDetails.tags,
      condition: aiDetails.condition,
      brand: aiDetails.brand,
      size: aiDetails.size,
      
      // Media and links
      imageURL: imageURL,
      platformLinks: {
        ebay: "",
        poshmark: "",
        mercari: "",
        facebook: "",
        depop: "",
        vinted: ""
      },
      
      // Metadata and timestamps
      createdAt: timestamp,
      updatedAt: timestamp,
      lastPriceUpdate: timestamp,
      
      // Analytics and performance tracking
      views: 0,
      likes: 0,
      messages: 0,
      sold: false,
      soldDate: null,
      soldPrice: null,
      
      // AI and automation metadata
      aiGenerated: true,
      lastOptimized: timestamp,
      optimizationScore: Math.floor(Math.random() * 20) + 80, // Mock score 80-100
      
      // Optional multi-user support
      ownerId: userInputs.ownerId || "default_user"
    };
    
    // Step 6: Save to Firestore
    console.log("💾 Saving listing to Firestore database...");
    await saveListing(listingId, listingData);
    
    // Step 7: Log success with organized storage path
    console.log("✅ Listing uploaded successfully!");
    console.log(`📋 Title: ${listingData.title}`);
    console.log(`💰 Price: ${listingData.price} (AI suggested: ${listingData.suggestedPrices.market})`);
    console.log(`🏷️ Category: ${listingData.category}`);
    console.log(`📁 Storage path: uploads/${listingData.category.replace(/\s*>\s*/g, '/')}/${listingId}/`);
    console.log(`🔗 Listing ID: ${listingId}`);
    
    return { ...listingData, id: listingId };
    
  } catch (error) {
    console.error("❌ Error uploading listing:", error.message);
    throw error;
  }
}

// 🔄 Bulk upload function for multiple images
export async function uploadMultipleListings(imagePaths, commonInputs = {}) {
  console.log(`📸 Starting bulk upload of ${imagePaths.length} listings...`);
  
  const results = [];
  const errors = [];
  
  for (const [index, imagePath] of imagePaths.entries()) {
    try {
      console.log(`\n📸 Processing ${index + 1}/${imagePaths.length}: ${path.basename(imagePath)}`);
      const result = await uploadListing(imagePath, commonInputs);
      results.push(result);
    } catch (error) {
      console.error(`❌ Failed to upload ${imagePath}:`, error.message);
      errors.push({ imagePath, error: error.message });
    }
  }
  
  console.log(`\n✅ Bulk upload complete! ${results.length} successful, ${errors.length} failed`);
  
  return { results, errors };
}

// 🖼️ Enhanced upload with multiple images per listing
export async function uploadListingWithMultipleImages(imagePaths, userInputs = {}) {
  try {
    console.log(`📸 Creating listing with ${imagePaths.length} images...`);
    
    // Verify all images exist
    for (const imagePath of imagePaths) {
      try {
        await fs.access(imagePath);
      } catch (error) {
        throw new Error(`Image file not found: ${imagePath}`);
      }
    }
    
    // Generate AI details from first image
    const aiDetails = await generateListingDetails(imagePaths[0], userInputs);
    validateListingData(aiDetails);
    
    // Generate listing ID
    const listingId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Upload all images to Firebase Storage
    console.log(`📤 Uploading ${imagePaths.length} images to Firebase Storage...`);
    const uploadResult = await uploadMultipleImages(imagePaths, listingId, aiDetails.category);
    
    if (uploadResult.errors.length > 0) {
      console.warn(`⚠️ ${uploadResult.errors.length} images failed to upload`);
    }
    
    // Build listing data with multiple images
    const imageURLs = uploadResult.results.map(result => result.url);
    const primaryImageURL = imageURLs[0] || `https://example.com/placeholder.jpg`;
    
    const listingData = {
      // Core listing information
      title: aiDetails.title,
      description: aiDetails.description,
      category: aiDetails.category,
      price: aiDetails.price,
      suggestedPrices: aiDetails.suggestedPrices,
      
      // Product details
      tags: aiDetails.tags,
      condition: aiDetails.condition,
      brand: aiDetails.brand,
      size: aiDetails.size,
      
      // Media and links (enhanced for multiple images)
      imageURL: primaryImageURL,
      imageURLs: imageURLs,
      imageCount: imageURLs.length,
      platformLinks: {
        ebay: "",
        poshmark: "",
        mercari: "",
        facebook: "",
        depop: "",
        vinted: ""
      },
      
      // Metadata and timestamps
      createdAt: timestamp,
      updatedAt: timestamp,
      lastPriceUpdate: timestamp,
      
      // Analytics and performance tracking
      views: 0,
      likes: 0,
      messages: 0,
      sold: false,
      soldDate: null,
      soldPrice: null,
      
      // AI and automation metadata
      aiGenerated: true,
      lastOptimized: timestamp,
      optimizationScore: Math.floor(Math.random() * 20) + 80,
      
      // Optional multi-user support
      ownerId: userInputs.ownerId || "default_user"
    };
    
    // Save to Firestore
    await saveListing(listingId, listingData);
    
    console.log("✅ Multi-image listing uploaded successfully!");
    console.log(`📋 Title: ${listingData.title}`);
    console.log(`🖼️ Images: ${imageURLs.length} uploaded`);
    console.log(`💰 Price: ${listingData.price}`);
    console.log(`🔗 Listing ID: ${listingId}`);
    
    return { ...listingData, id: listingId };
    
  } catch (error) {
    console.error("❌ Error uploading multi-image listing:", error.message);
    throw error;
  }
}

// 📊 Generate sample listings for testing
export async function generateSampleListings() {
  console.log("🎯 Generating sample listings for testing...");
  
  const sampleItems = [
    {
      title: "Vintage Levi's 501 Jeans",
      description: "Classic high-waisted denim in excellent condition. Size 28, perfect for that Y2K aesthetic.",
      category: "Women > Bottoms",
      price: "$42",
      tags: ["vintage", "denim", "y2k", "highwaisted"],
      brand: "Levi's",
      size: "28",
      condition: "Used - Excellent"
    },
    {
      title: "Designer Blazer",
      description: "Sophisticated black blazer perfect for office or evening wear. Excellent craftsmanship.",
      category: "Women > Outerwear", 
      price: "$68",
      tags: ["blazer", "professional", "designer", "black"],
      brand: "Zara",
      size: "M",
      condition: "Used - Like New"
    },
    {
      title: "Dewalt Cordless Drill Set",
      description: "Professional-grade cordless drill with battery, charger, and bit set. Works perfectly.",
      category: "Electronics > Tools",
      price: "$85",
      tags: ["tools", "drill", "dewalt", "cordless"],
      brand: "Dewalt",
      size: "",
      condition: "Used - Good"
    }
  ];
  
  const results = [];
  
  for (const item of sampleItems) {
    try {
      const listingId = uuidv4();
      const timestamp = new Date().toISOString();
      
      const listingData = {
        ...item,
        suggestedPrices: {
          thrift: `$${Math.round(parseFloat(item.price.replace('$', '')) * 0.8)}`,
          market: item.price,
          retail: `$${Math.round(parseFloat(item.price.replace('$', '')) * 1.3)}`
        },
        imageURL: `https://firebasestorage.googleapis.com/v0/b/photo2profit/o/uploads%2F${encodeURIComponent(item.category.replace(/\s*>\s*/g, '/'))}%2F${listingId}%2F${item.title.toLowerCase().replace(/\s+/g, '-')}.jpg?alt=media`,
        platformLinks: {
          ebay: "",
          poshmark: "",
          mercari: "",
          facebook: "",
          depop: "",
          vinted: ""
        },
        createdAt: timestamp,
        updatedAt: timestamp,
        lastPriceUpdate: timestamp,
        views: Math.floor(Math.random() * 50) + 10,
        likes: Math.floor(Math.random() * 20) + 2,
        messages: Math.floor(Math.random() * 5),
        sold: false,
        soldDate: null,
        soldPrice: null,
        aiGenerated: false,
        lastOptimized: timestamp,
        optimizationScore: Math.floor(Math.random() * 20) + 80,
        ownerId: "default_user"
      };
      
      await saveListing(listingId, listingData);
      results.push({ ...listingData, id: listingId });
      
      console.log(`✅ Created sample listing: ${item.title}`);
      
    } catch (error) {
      console.error(`❌ Failed to create sample listing ${item.title}:`, error.message);
    }
  }
  
  console.log(`🎉 Generated ${results.length} sample listings!`);
  return results;
}

// --- CLI Usage ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === "sample") {
    // Generate sample listings
    initializeFirebase().then(() => {
      generateSampleListings().catch(console.error);
    });
  } else if (command === "multi" && process.argv[3]) {
    // Upload multiple images as one listing
    const imagePaths = process.argv.slice(3);
    initializeFirebase().then(() => {
      uploadListingWithMultipleImages(imagePaths).catch(console.error);
    });
  } else if (command === "bulk" && process.argv[3]) {
    // Upload multiple single-image listings
    const imagePaths = process.argv.slice(3);
    initializeFirebase().then(() => {
      uploadMultipleListings(imagePaths).catch(console.error);
    });
  } else if (command && !["sample", "multi", "bulk"].includes(command)) {
    // Upload single image
    const imagePath = command;
    initializeFirebase().then(() => {
      uploadListing(imagePath).catch(console.error);
    });
  } else {
    console.log(`
📸 Photo2Profit Upload Tool

Usage:
  node scripts/upload-listing.js [image-path]           # Upload single image
  node scripts/upload-listing.js sample                # Generate sample listings
  node scripts/upload-listing.js multi [images...]     # Multiple images, one listing
  node scripts/upload-listing.js bulk [images...]      # Multiple single-image listings

Examples:
  node scripts/upload-listing.js ./photo.jpg
  node scripts/upload-listing.js sample
  node scripts/upload-listing.js multi ./front.jpg ./back.jpg ./detail.jpg
  node scripts/upload-listing.js bulk ./item1.jpg ./item2.jpg ./item3.jpg
    `);
  }
}