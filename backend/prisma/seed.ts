import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const products = [
  {
    name: 'Classic Salted Makhana',
    description: 'Our signature fox nuts lightly roasted and seasoned with Himalayan pink salt. A guilt-free snack that\'s crunchy, light and absolutely addictive.',
    price: 249,
    mrp: 299,
    imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
    category: 'Classic',
    tags: ['salted', 'classic', 'bestseller'],
    stock: 500,
    weight: '100g',
    flavour: 'Salted',
  },
  {
    name: 'Peri Peri Makhana',
    description: 'Bold peri peri spice blend meets the lightness of fox nuts. A fiery adventure in every bite that keeps you coming back for more.',
    price: 279,
    mrp: 329,
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800',
    category: 'Spicy',
    tags: ['spicy', 'peri-peri', 'popular'],
    stock: 400,
    weight: '100g',
    flavour: 'Peri Peri',
  },
  {
    name: 'Dark Chocolate Makhana',
    description: 'Premium Belgian dark chocolate coating over crispy makhana. The perfect blend of indulgence and nutrition for your sweet cravings.',
    price: 349,
    mrp: 399,
    imageUrl: 'https://images.unsplash.com/photo-1481391319555-9f4ac7b64b2e?w=800',
    category: 'Sweet',
    tags: ['chocolate', 'sweet', 'premium'],
    stock: 300,
    weight: '100g',
    flavour: 'Dark Chocolate',
  },
  {
    name: 'Cheese & Herbs Makhana',
    description: 'Savory cheddar cheese dust combined with aromatic Italian herbs. The perfect sharing snack for movie nights and gatherings.',
    price: 299,
    mrp: 349,
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800',
    category: 'Savory',
    tags: ['cheese', 'herbs', 'savory'],
    stock: 350,
    weight: '100g',
    flavour: 'Cheese & Herbs',
  },
  {
    name: 'Mango Chili Makhana',
    description: 'A tropical twist with sweet mango powder and fiery red chili. This sweet-hot combo is our most unique and exciting flavor profile.',
    price: 269,
    mrp: 319,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
    category: 'Spicy',
    tags: ['mango', 'chili', 'tropical', 'unique'],
    stock: 250,
    weight: '100g',
    flavour: 'Mango Chili',
  },
  {
    name: 'Butter Masala Makhana',
    description: 'Rich butter and aromatic Indian masalas create a flavor explosion. Reminiscent of your favorite butter chicken, now in snack form.',
    price: 289,
    mrp: 339,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
    category: 'Spicy',
    tags: ['butter', 'masala', 'indian', 'popular'],
    stock: 450,
    weight: '100g',
    flavour: 'Butter Masala',
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing products
  await prisma.product.deleteMany()
  console.log('  Cleared existing products')

  // Create products
  for (const product of products) {
    const p = await prisma.product.create({ data: product })
    console.log(`  ✅ Created: ${p.name}`)
  }

  console.log('\n🎉 Seeding complete!')
  console.log(`  Created ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
