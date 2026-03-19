import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { optionalAuth } from '../middleware/auth'

const router = Router()

// GET /api/products?category=&search=&page=&limit=
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  const { category, search, page = '1', limit = '12', tags } = req.query

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
  const take = parseInt(limit as string)

  const where: any = { isActive: true }

  if (category) where.category = category as string
  if (search) {
    where.OR = [
      { name:        { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { flavour:     { contains: search as string, mode: 'insensitive' } },
    ]
  }
  if (tags) {
    const tagList = (tags as string).split(',')
    where.tags = { hasSome: tagList }
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { reviews: true } } },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      products,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / take),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { firstName: true, lastName: true, imageUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { reviews: true } },
      },
    })

    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// GET /api/products/category/list — get all unique categories
router.get('/category/list', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    })
    res.json(categories.map(c => c.category))
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// POST /api/products/:id/review
router.post('/:id/review', async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  if (!clerkId) return res.status(401).json({ error: 'Login required to review' })

  const { rating, comment } = req.body
  const { id: productId } = req.params

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const review = await prisma.review.upsert({
      where: { id: `${user.id}-${productId}` },
      update: { rating, comment },
      create: { userId: user.id, productId, rating, comment },
    })
    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' })
  }
})

export default router
