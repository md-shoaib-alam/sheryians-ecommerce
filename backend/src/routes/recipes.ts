import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/recipes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(recipes)
  } catch {
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})

export default router
