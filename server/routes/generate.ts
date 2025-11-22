import { Router, Request, Response } from 'express';
import genAIService from '../services/genai';
import prisma from '../prisma/client';

const router = Router();

interface GenerateRequest {
  prompt: string;
  language: string;
}

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, language }: GenerateRequest = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt is required and must be a string' 
      });
    }

    if (!language || typeof language !== 'string') {
      return res.status(400).json({ 
        error: 'Language is required and must be a string' 
      });
    }

    // Generate code using GenAI service
    const code = await genAIService.generateCode(prompt, language);

    // Find or create the language in the database
    const languageRecord = await prisma.language.upsert({
      where: { name: language.toLowerCase() },
      update: {},
      create: {
        name: language.toLowerCase(),
        displayName: language,
      },
    });

    // Save the generation to the database
    const generation = await prisma.generation.create({
      data: {
        prompt,
        code,
        language: language.toLowerCase(), // Denormalized for quick access
        languageId: languageRecord.id,
        timestamp: new Date(),
      },
      include: {
        languageRelation: true,
      },
    });

    res.json({
      success: true,
      code,
      language,
      prompt,
      generationId: generation.id,
      timestamp: generation.timestamp,
    });
  } catch (error) {
    console.error('Error in /generate endpoint:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate code'
    });
  }
});

export default router;

