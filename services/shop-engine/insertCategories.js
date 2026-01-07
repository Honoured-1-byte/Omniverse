require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const Category = require('./models/category')

async function insertUniqueCategories() {
  const categories = [
    { title: 'Electronics', slug: 'electronics' },
    { title: 'Books', slug: 'books' },
    { title: 'Clothing', slug: 'clothing' }
  ]

  for (let cat of categories) {
    const exists = await Category.findOne({ slug: cat.slug })
    if (!exists) {
      await Category.create(cat)
      console.log(`✅ Inserted ${cat.title}`)
    } else {
      console.log(`⏭️ Skipped existing: ${cat.title}`)
    }
  }

  mongoose.connection.close()
}

insertUniqueCategories().catch(err => {
  console.error('❌ Failed:', err)
  mongoose.connection.close()
})
