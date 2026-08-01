import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  price: { type: Number, default: 0, min: 0 },
  stock: { type: Number, default: 10, min: 0 }
});

const weightSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  value: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: 'g', trim: true },
  price: { type: Number, default: 0, min: 0 },
  stock: { type: Number, default: 10, min: 0 }
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, default: '' },
  altText: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true
    },
    brand: {
      type: String,
      default: 'Gajanan Pure & Homemade Services',
      trim: true
    },
    sku: {
      type: String,
      default: '',
      trim: true
    },

    basePrice: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    salePrice: {
      type: Number,
      default: 0,
      min: [0, 'Sale price cannot be negative']
    },

    sizes: [sizeSchema],
    weights: [weightSchema],

    images: [imageSchema],

    stock: {
      type: Number,
      default: 50,
      min: [0, 'Stock cannot be negative']
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'out-of-stock', 'archived'],
      default: 'published'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },

    // Extra fields to maintain 100% compatibility with existing UI
    descriptor: { type: String, default: '' },
    subcategory: { type: String, default: '' },
    ingredients: { type: String, default: '' },
    shelfLife: { type: String, default: '12 Months' },
    storageInstructions: { type: String, default: 'Store in a cool, dry place.' },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 90 },
    bestSeller: { type: Boolean, default: false },
    availableSizes: [
      {
        size: { type: String, default: 'Standard Pack' },
        price: { type: Number, default: 0 }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Virtual property for computed effective price
productSchema.virtual('price').get(function () {
  if (this.salePrice && this.salePrice > 0 && this.salePrice < this.basePrice) {
    return this.salePrice;
  }
  return this.basePrice;
});

// Configure JSON serialization
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
