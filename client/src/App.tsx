import { useState } from 'react'
import { CodeGeneratorHeader } from '@/components/CodeGeneratorHeader'
import { CodeGeneratorForm } from '@/components/CodeGeneratorForm'
import { CodeDisplay } from '@/components/CodeDisplay'
import { HistoryPanel } from '@/components/HistoryPanel'
import { useCodeGenerator } from '@/hooks/useCodeGenerator'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

function App() {
  const [showHistory, setShowHistory] = useState(false)
  const {
    prompt,
    setPrompt,
    language,
    setLanguage,
    isLoading,
    generatedCode,
    handleSubmit,
  } = useCodeGenerator()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <CodeGeneratorHeader />
            <ModeToggle />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showHistory ? 'outline' : 'default'}
              onClick={() => setShowHistory(false)}
            >
              Generate Code
            </Button>
            <Button
              variant={showHistory ? 'default' : 'outline'}
              onClick={() => setShowHistory(true)}
            >
              View History
            </Button>
          </div>

          {showHistory ? (
            <HistoryPanel />
          ) : (
            <>
              <CodeGeneratorForm
                prompt={prompt}
                onPromptChange={setPrompt}
                language={language}
                onLanguageChange={setLanguage}
                isLoading={isLoading}
                onSubmit={handleSubmit}
              />
              {generatedCode && generatedCode.success && (
                <CodeDisplay
                  code={generatedCode.code}
                  language={generatedCode.language}
                  timestamp={generatedCode.timestamp}
                  generationId={generatedCode.generationId}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App