import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// POST /api/orders — Create a new order from cart
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { items, addressId, paymentMethod = 'COD', notes } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must have at least one item' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Validate & fetch products
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: 'One or more products not found' })
    }

    // Check stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) continue
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = products.find(p => p.id === item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    const shippingCost = subtotal >= 499 ? 0 : 49
    const total = subtotal + shippingCost

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          addressId: addressId || null,
          paymentMethod,
          notes,
          subtotal,
          shippingCost,
          total,
          items: {
            create: items.map((item: any) => {
              const product = products.find(p => p.id === item.productId)!
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                name: product.name,
              }
            }),
          },
        },
        include: { items: true },
      })

      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    res.status(201).json({ success: true, order })
  } catch (error) {
    console.error('Order creation error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// GET /api/orders — Get all orders for logged-in user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { page = '1', limit = '10' } = req.query

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
  const take = parseInt(limit as string)

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        include: {
          items: { include: { product: { select: { name: true, imageUrl: true } } } },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.order.count({ where: { userId: user.id } }),
    ])

    res.json({ orders, total, page: parseInt(page as string), pages: Math.ceil(total / take) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /api/orders/:id — Get single order
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { id } = req.params

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const order = await prisma.order.findFirst({
      where: { id, userId: user.id },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    })

    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// PATCH /api/orders/:id/cancel — Cancel a pending order
router.patch('/:id/cancel', requireAuth, async (req: Request, res: Response) => {
  const clerkId = (req as any).clerkId
  const { id } = req.params

  try {
    const user = await prisma.user.findUnique({ where: { clerkUserId: clerkId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const order = await prisma.order.findFirst({ where: { id, userId: user.id } })
    if (!order) return res.status(404).json({ error: 'Order not found' })

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })
    res.json({ success: true, order: updatedOrder })
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' })
  }
})

export default router
