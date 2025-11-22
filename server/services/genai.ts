import { GoogleGenAI } from '@google/genai';

let genAI: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable is required');
    }

    genAI = new GoogleGenAI({ apiKey });
  }

  return genAI;
}

function normalizeCode(rawCode: string): string {
  let normalized = rawCode.trim();

  // Remove markdown code blocks (```language ... ```)
  // Pattern 1: Remove opening code block with optional language identifier
  // Matches: ```cpp, ```python, ```javascript, etc. (with or without newline)
  normalized = normalized.replace(/^```[\w+-]*\n?/gm, '');
  
  // Pattern 2: Remove closing code blocks at the end
  // Matches: ``` at the end of the string (with optional whitespace)
  normalized = normalized.replace(/\n?```\s*$/gm, '');
  
  // Pattern 3: Remove standalone closing code blocks
  normalized = normalized.replace(/```$/gm, '');

  // Remove any leading/trailing whitespace
  normalized = normalized.trim();

  return normalized;
}

async function generateCode(prompt: string, language: string): Promise<string> {
  try {
    const genAIClient = getGenAIClient();
    const fullPrompt = `Generate ${language} code for the following prompt. Return only the code without any markdown formatting, explanations, or comments unless specifically requested:\n\n${prompt}`;

    const response = await genAIClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const rawCode = response.text;

    if (!rawCode) {
      throw new Error('No code generated in the response');
    }

    // Normalize the code to remove markdown formatting
    const normalizedCode = normalizeCode(rawCode);

    return normalizedCode;
  } catch (error) {
    console.error('Error generating code:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to generate code: ${error.message}` 
        : 'Failed to generate code'
    );
  }
}

export default {
  generateCode,
  normalizeCode,
};

