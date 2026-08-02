import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import vm from 'vm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (e) {
        resolve({})
      }
    })
  })
}

function localProductDevPlugin() {
  const productsFilePath = path.resolve(__dirname, 'src/data/products.js')
  const srcAssetsDir = path.resolve(__dirname, 'src/assets/products')
  const publicAssetsDir = path.resolve(__dirname, 'public/assets/products')

  const dbJsonFilePath = path.resolve(__dirname, 'backend/data/db.json')
  const srcAssetsGalleryDir = path.resolve(__dirname, 'src/assets/gallery')
  const publicAssetsGalleryDir = path.resolve(__dirname, 'public/assets/gallery')

  // Ensure dirs exist
  if (!fs.existsSync(srcAssetsDir)) {
    fs.mkdirSync(srcAssetsDir, { recursive: true })
  }
  if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(publicAssetsDir, { recursive: true })
  }
  if (!fs.existsSync(srcAssetsGalleryDir)) {
    fs.mkdirSync(srcAssetsGalleryDir, { recursive: true })
  }
  if (!fs.existsSync(publicAssetsGalleryDir)) {
    fs.mkdirSync(publicAssetsGalleryDir, { recursive: true })
  }

  const getDB = () => {
    try {
      if (!fs.existsSync(dbJsonFilePath)) return { galleryItems: [] }
      const content = fs.readFileSync(dbJsonFilePath, 'utf8')
      return JSON.parse(content) || { galleryItems: [] }
    } catch (e) {
      return { galleryItems: [] }
    }
  }

  const saveDB = (data) => {
    try {
      fs.writeFileSync(dbJsonFilePath, JSON.stringify(data, null, 2), 'utf8')
    } catch (e) {}
  }

  const getProductsList = () => {
    try {
      if (!fs.existsSync(productsFilePath)) return []
      const fileContent = fs.readFileSync(productsFilePath, 'utf8')
      const arrayStr = fileContent.replace(/^\s*export\s+const\s+products\s*=\s*/, '')
      return vm.runInNewContext(arrayStr) || []
    } catch (e) {
      console.error('Error reading products list:', e)
      return []
    }
  }

  const saveProductsList = (list) => {
    try {
      const code = `export const products = ${JSON.stringify(list, null, 2)};\n`
      fs.writeFileSync(productsFilePath, code, 'utf8')
    } catch (e) {
      console.error('Error saving products list:', e)
    }
  }

  const categoriesFilePath = path.resolve(__dirname, 'src/data/categories.js')

  const getCategoriesList = () => {
    try {
      if (!fs.existsSync(categoriesFilePath)) return []
      const fileContent = fs.readFileSync(categoriesFilePath, 'utf8')
      const match = fileContent.match(/export\s+const\s+categories\s*=\s*(\[[\s\S]*?\]);/)
      if (match && match[1]) {
        return vm.runInNewContext(match[1]) || []
      }
      return []
    } catch (e) {
      console.error('Error reading categories list:', e)
      return []
    }
  }

  const saveCategoriesList = (list) => {
    try {
      const code = `export const categories = ${JSON.stringify(list, null, 2)};\n
export const addCategory = (category) => {
  const slug = category.name
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, '-')
    .replace(/[^\\w\\-]+/g, '');

  const newCat = {
    id: \`cat-\${slug}\`,
    slug,
    name: category.name,
    description: category.description || '',
    image: category.image || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    icon: category.icon || "Sparkles"
  };

  categories.push(newCat);

  if (typeof window !== 'undefined') {
    fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCat)
    }).catch(err => console.error("Error writing category to categories.js:", err));
  }

  return newCat;
};

export const updateCategory = (id, updatedData) => {
  const index = categories.findIndex(c => c.id === id || c.slug === id);
  if (index >= 0) {
    const slug = updatedData.name
      .toLowerCase()
      .trim()
      .replace(/\\s+/g, '-')
      .replace(/[^\\w\\-]+/g, '');

    categories[index] = {
      ...categories[index],
      ...updatedData,
      slug
    };

    if (typeof window !== 'undefined') {
      fetch(\`/api/categories/\${id}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categories[index])
      }).catch(err => console.error("Error updating category in categories.js:", err));
    }
    return categories[index];
  }
  return null;
};

export const deleteCategory = (id) => {
  const index = categories.findIndex(c => c.id === id || c.slug === id);
  if (index >= 0) {
    const deleted = categories.splice(index, 1)[0];

    if (typeof window !== 'undefined') {
      fetch(\`/api/categories/\${id}\`, {
        method: 'DELETE'
      }).catch(err => console.error("Error deleting category from categories.js:", err));
    }
    return deleted;
  }
  return null;
};\n`
      fs.writeFileSync(categoriesFilePath, code, 'utf8')
    } catch (e) {
      console.error('Error saving categories list:', e)
    }
  }

  return {
    name: 'local-product-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url

        // Categories persistence API
        if (url === '/api/categories' && req.method === 'POST') {
          const body = await getRequestBody(req)
          const categoriesList = getCategoriesList()
          
          const exists = categoriesList.some(c => c.slug === body.slug)
          if (!exists) {
            categoriesList.push(body)
            saveCategoriesList(categoriesList)
            res.writeHead(201, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Category added to file successfully', data: body }))
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Category already exists in file', data: body }))
          }
          return
        }

        if (url.startsWith('/api/categories/') && req.method === 'PUT') {
          const parts = url.split('/')
          const id = parts[parts.length - 1]?.split('?')[0]
          const body = await getRequestBody(req)
          const categoriesList = getCategoriesList()
          
          const index = categoriesList.findIndex(c => c.id === id || c.slug === id)
          if (index >= 0) {
            categoriesList[index] = {
              ...categoriesList[index],
              name: body.name,
              slug: body.slug || categoriesList[index].slug,
              description: body.description,
              image: body.image,
              icon: body.icon
            }
            saveCategoriesList(categoriesList)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Category updated successfully', data: categoriesList[index] }))
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Category not found' }))
          }
          return
        }

        if (url.startsWith('/api/categories/') && req.method === 'DELETE') {
          const parts = url.split('/')
          const id = parts[parts.length - 1]?.split('?')[0]
          
          const categoriesList = getCategoriesList()
          const filtered = categoriesList.filter(c => c.id !== id && c.slug !== id)
          
          if (categoriesList.length !== filtered.length) {
            saveCategoriesList(filtered)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Category deleted successfully' }))
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Category not found' }))
          }
          return
        }

        if (url === '/api/categories' && req.method === 'GET') {
          const categoriesList = getCategoriesList()
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true, data: categoriesList }))
          return
        }

        // 1. Authenticate Admin
        if (url === '/api/auth/login' && req.method === 'POST') {
          const body = await getRequestBody(req)
          if (body.email === 'admin@gajananservices.com' && body.password === 'admin123') {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              success: true,
              data: {
                token: 'gajanan-token-local',
                _id: 'usr-admin-local',
                name: 'Admin Gajanan',
                email: 'admin@gajananservices.com',
                role: 'superadmin'
              }
            }))
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }))
          }
          return
        }

        if (url === '/api/auth/me' && req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            success: true,
            data: {
              _id: 'usr-admin-local',
              name: 'Admin Gajanan',
              email: 'admin@gajananservices.com',
              role: 'superadmin'
            }
          }))
          return
        }

        // 2. Fetch products
        if (url.startsWith('/api/products') && req.method === 'GET') {
          // Check if it's product details by ID or Slug
          const products = getProductsList()
          
          if (url.includes('/slug/')) {
            const slug = url.split('/slug/')[1]?.split('?')[0]
            const product = products.find(p => p.slug === slug)
            if (product) {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: true, data: product }))
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: false, message: 'Product not found' }))
            }
            return
          }

          // Check if it is /api/products/:id
          const parts = url.split('/')
          const lastPart = parts[parts.length - 1]?.split('?')[0]
          
          if (lastPart && lastPart !== 'products') {
            const product = products.find(p => p.id === lastPart || p._id === lastPart)
            if (product) {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: true, data: product }))
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: false, message: 'Product not found' }))
            }
            return
          }

          // Otherwise get all products
          const searchParams = new URL(req.url, 'http://localhost').searchParams
          const category = searchParams.get('category')
          
          let filtered = products
          if (category && category !== 'all') {
            filtered = products.filter(p => p.category === category.toLowerCase())
          }

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            success: true,
            data: filtered,
            pagination: { page: 1, limit: 100, total: filtered.length, totalPages: 1 }
          }))
          return
        }

        // 3. Create product
        if (url === '/api/products' && req.method === 'POST') {
          const body = await getRequestBody(req)
          const products = getProductsList()

          const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
          const id = body.id || `prod-${slug}`

          // Handle uploaded images
          const imagePaths = []
          if (body.newImages && Array.isArray(body.newImages)) {
            body.newImages.forEach((img, idx) => {
              const ext = img.type.split('/')[1] || 'jpg'
              const filename = `${slug}-${Date.now()}-${idx}.${ext}`
              const buffer = Buffer.from(img.base64, 'base64')

              // Save to both src/assets/products and public/assets/products
              fs.writeFileSync(path.resolve(srcAssetsDir, filename), buffer)
              fs.writeFileSync(path.resolve(publicAssetsDir, filename), buffer)

              imagePaths.push(`/assets/products/${filename}`)
            })
          }

          const existingImages = body.images || []
          const combinedImages = [...imagePaths, ...existingImages.map(img => typeof img === 'string' ? img : img.url)]

          const newProduct = {
            id,
            slug,
            name: body.name,
            descriptor: body.descriptor || 'Pure & Authentic',
            category: body.category || 'spices',
            subcategory: body.subcategory || '',
            shortDescription: body.shortDescription || '',
            fullDescription: body.description || '',
            images: combinedImages,
            price: Number(body.basePrice) || 0,
            originalPrice: Number(body.salePrice) || Number(body.basePrice),
            discount: body.salePrice ? Math.round(((Number(body.basePrice) - Number(body.salePrice)) / Number(body.basePrice)) * 100) : 0,
            availableSizes: Array.isArray(body.sizes) ? body.sizes.map(s => ({ size: s.label, price: Number(s.price) })) : [],
            ingredients: body.ingredients || '',
            rating: 5.0,
            reviewCount: 0,
            stock: Number(body.stock) || 50,
            featured: body.isFeatured || false,
            bestSeller: body.bestSeller || false,
            sku: body.sku || '',
            shelfLife: body.shelfLife || '12 Months',
            storageInstructions: body.storageInstructions || '',
            createdAt: new Date().toISOString()
          }

          products.unshift(newProduct)
          saveProductsList(products)

          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true, message: 'Product created successfully', data: newProduct }))
          return
        }

        // 4. Update product
        if (url.startsWith('/api/products/') && req.method === 'PUT') {
          const parts = url.split('/')
          const id = parts[parts.length - 1]?.split('?')[0]

          const body = await getRequestBody(req)
          const products = getProductsList()
          const index = products.findIndex(p => p.id === id || p._id === id)

          if (index >= 0) {
            const existingProduct = products[index]
            const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')

            // Handle uploaded images
            const imagePaths = []
            if (body.newImages && Array.isArray(body.newImages)) {
              body.newImages.forEach((img, idx) => {
                const ext = img.type.split('/')[1] || 'jpg'
                const filename = `${slug}-${Date.now()}-${idx}.${ext}`
                const buffer = Buffer.from(img.base64, 'base64')

                // Save to both src/assets/products and public/assets/products
                fs.writeFileSync(path.resolve(srcAssetsDir, filename), buffer)
                fs.writeFileSync(path.resolve(publicAssetsDir, filename), buffer)

                imagePaths.push(`/assets/products/${filename}`)
              })
            }

            const existingImages = body.images || []
            const combinedImages = [...imagePaths, ...existingImages.map(img => typeof img === 'string' ? img : img.url)]

            const updatedProduct = {
              ...existingProduct,
              slug,
              name: body.name,
              descriptor: body.descriptor || existingProduct.descriptor,
              category: body.category || existingProduct.category,
              subcategory: body.subcategory || existingProduct.subcategory,
              shortDescription: body.shortDescription || existingProduct.shortDescription,
              fullDescription: body.description || existingProduct.fullDescription,
              images: combinedImages,
              price: Number(body.basePrice) || existingProduct.price,
              originalPrice: Number(body.salePrice) || Number(body.basePrice) || existingProduct.originalPrice,
              discount: body.salePrice ? Math.round(((Number(body.basePrice) - Number(body.salePrice)) / Number(body.basePrice)) * 100) : existingProduct.discount,
              availableSizes: Array.isArray(body.sizes) ? body.sizes.map(s => ({ size: s.label, price: Number(s.price) })) : existingProduct.availableSizes,
              ingredients: body.ingredients || existingProduct.ingredients,
              stock: Number(body.stock) || existingProduct.stock,
              featured: body.isFeatured !== undefined ? body.isFeatured : existingProduct.featured,
              bestSeller: body.bestSeller !== undefined ? body.bestSeller : existingProduct.bestSeller,
              sku: body.sku || existingProduct.sku,
              shelfLife: body.shelfLife || existingProduct.shelfLife,
              storageInstructions: body.storageInstructions || existingProduct.storageInstructions,
              updatedAt: new Date().toISOString()
            }

            products[index] = updatedProduct
            saveProductsList(products)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Product updated successfully', data: updatedProduct }))
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Product not found' }))
          }
          return
        }

        // 5. Delete product
        if (url.startsWith('/api/products/') && req.method === 'DELETE') {
          const parts = url.split('/')
          const id = parts[parts.length - 1]?.split('?')[0]

          const products = getProductsList()
          const filtered = products.filter(p => p.id !== id && p._id !== id)

          if (products.length !== filtered.length) {
            saveProductsList(filtered)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Product deleted successfully' }))
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Product not found' }))
          }
          return
        }

        // 6. Get gallery items
        if (url === '/api/gallery' && req.method === 'GET') {
          const db = getDB()
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true, data: db.galleryItems || [] }))
          return
        }

        // 7. Create gallery item
        if (url === '/api/gallery' && req.method === 'POST') {
          const body = await getRequestBody(req)
          const db = getDB()
          if (!db.galleryItems) db.galleryItems = []

          let finalImageUrl = body.imageUrl || ''
          if (body.imageBase64) {
            const ext = body.imageType ? (body.imageType.split('/')[1] || 'jpg') : 'jpg'
            const filename = `gallery-${Date.now()}.${ext}`
            const buffer = Buffer.from(body.imageBase64, 'base64')

            fs.writeFileSync(path.resolve(srcAssetsGalleryDir, filename), buffer)
            fs.writeFileSync(path.resolve(publicAssetsGalleryDir, filename), buffer)

            finalImageUrl = `/assets/gallery/${filename}`
          }

          const newItem = {
            _id: `gal-${Date.now()}`,
            title: body.title ? body.title.trim() : '',
            description: body.description ? body.description.trim() : '',
            imageUrl: finalImageUrl,
            createdAt: new Date().toISOString()
          }

          db.galleryItems.unshift(newItem)
          saveDB(db)

          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true, message: 'Gallery image uploaded successfully', data: newItem }))
          return
        }

        // 8. Update gallery item
        if (url.startsWith('/api/gallery/') && req.method === 'PUT') {
          const parts = url.split('/')
          const id = parts[parts.length - 1]?.split('?')[0]
          const body = await getRequestBody(req)
          const db = getDB()
          if (!db.galleryItems) db.galleryItems = []

          const index = db.galleryItems.findIndex(g => (g._id === id || g.id === id))
          if (index >= 0) {
            const current = db.galleryItems[index]
            let finalImageUrl = current.imageUrl

            if (body.imageBase64) {
              const ext = body.imageType ? (body.imageType.split('/')[1] || 'jpg') : 'jpg'
              const filename = `gallery-${Date.now()}.${ext}`
              const buffer = Buffer.from(body.imageBase64, 'base64')

              fs.writeFileSync(path.resolve(srcAssetsGalleryDir, filename), buffer)
              fs.writeFileSync(path.resolve(publicAssetsGalleryDir, filename), buffer)

              finalImageUrl = `/assets/gallery/${filename}`
            } else if (body.imageUrl) {
              finalImageUrl = body.imageUrl
            }

            const updated = {
              ...current,
              title: body.title !== undefined ? body.title.trim() : current.title,
              description: body.description !== undefined ? body.description.trim() : current.description,
              imageUrl: finalImageUrl,
              updatedAt: new Date().toISOString()
            }

            db.galleryItems[index] = updated
            saveDB(db)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Gallery item updated successfully', data: updated }))
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Gallery item not found' }))
          }
          return
        }

        // 9. Delete gallery item
        if (url.startsWith('/api/gallery/') && req.method === 'DELETE') {
          const parts = url.split('/')
          const id = parts[parts.length - 1]?.split('?')[0]
          const db = getDB()
          if (!db.galleryItems) db.galleryItems = []

          const initialLen = db.galleryItems.length
          db.galleryItems = db.galleryItems.filter(g => g._id !== id && g.id !== id)

          if (db.galleryItems.length !== initialLen) {
            saveDB(db)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, message: 'Gallery item deleted successfully' }))
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Gallery item not found' }))
          }
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localProductDevPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        },
      },
    },
  },
})
