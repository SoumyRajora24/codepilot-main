import { useState } from 'react'
import { generateCode } from '@/api.clients'

interface GeneratedCodeResponse {
  success: boolean
  code: string
  language: string
  prompt: string
  generationId?: string
  timestamp?: string
}

export const useCodeGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCodeResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim() || !language) {
      return
    }

    setIsLoading(true)
    setGeneratedCode(null)
    try {
      const response = await generateCode(prompt, language)
      setGeneratedCode(response)
    } catch (error) {
      console.error('Error generating code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    prompt,
    setPrompt,
    language,
    setLanguage,
    isLoading,
    generatedCode,
    handleSubmit,
  }
}

