import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';

const router = Router();

interface HistoryQueryParams {
  page?: string;
  limit?: string;
  language?: string;
}

router.get('/history', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', language } = req.query as HistoryQueryParams;

    // Parse and validate pagination parameters
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10)); // Max 100 items per page
    const skip = (pageNumber - 1) * pageSize;

    // Build where clause for filtering
    const where: any = {};
    if (language) {
      where.language = (language as string).toLowerCase();
    }

    // Get total count for pagination metadata
    const totalCount = await prisma.generation.count({ where });

    // Fetch generations with pagination
    const generations = await prisma.generation.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        timestamp: 'desc', // Most recent first
      },
      include: {
        languageRelation: {
          select: {
            name: true,
            displayName: true,
          },
        },
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;

    res.json({
      success: true,

      data: generations.map((gen: { id: any; prompt: any; code: any; languageRelation: { displayName: any; }; language: any; timestamp: any; }) => ({
        id: gen.id,
        prompt: gen.prompt,
        code: gen.code,
        language: gen.languageRelation?.displayName || gen.language,
        timestamp: gen.timestamp,
      })),
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error('Error in /history endpoint:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch history',
    });
  }
});

export default router;

