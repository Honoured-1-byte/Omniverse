require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const Product = require('./models/product')
const Category = require('./models/category')

async function seedProducts() {
  try {
    const electronics = await Category.findOne({ slug: 'electronics' })
    const books = await Category.findOne({ slug: 'books' })
    const clothing = await Category.findOne({ slug: 'clothing' })

    const dummyProducts = [
      {
        productCode: 'ELEC001',
        title: 'Smartphone X',
        price: 299,
        description: 'Latest smartphone with AI features',
        imagePath: '/images/products/phone1.jpg',
        category: electronics._id,
        available: true
      },
      {
        productCode: 'ELEC002',
        title: 'Wireless Earbuds',
        price: 49,
        description: 'Noise-cancelling earbuds',
        imagePath: '/images/products/earbuds.jpg',
        category: electronics._id,
        available: true
      },
      {
        productCode: 'BOOK001',
        title: 'Sci-Fi Novel',
        price: 15,
        description: 'Award-winning science fiction book',
        imagePath: '/images/products/book1.jpg',
        category: books._id,
        available: true
      },
      {
        productCode: 'CLOT001',
        title: 'Hoodie XL',
        price: 25,
        description: 'Comfortable oversized hoodie',
        imagePath: '/images/products/hoodie.jpg',
        category: clothing._id,
        available: true
      },
      {
        productCode: 'ELEC003',
        title: 'Laptop Pro',
        price: 899,
        description: 'High-performance laptop for work and gaming',
        imagePath: '/images/products/laptop.jpg',
        category: electronics._id,
        available: false
      },
      {
        productCode: 'BOOK002',
        title: 'Fantasy Book',
        price: 20,
        description: 'Bestselling fantasy novel',
        imagePath: '/images/products/book2.jpg',
        category: books._id,
        available: true
      }
    ]

    await Product.insertMany(dummyProducts)
    console.log('✅ Products added successfully')
  } catch (err) {
    console.error('❌ Error inserting products:', err)
  } finally {
    mongoose.connection.close()
  }
}

seedProducts()
