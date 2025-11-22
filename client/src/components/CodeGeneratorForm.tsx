import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PROGRAMMING_LANGUAGES } from '@/constants/programmingLanguages'
import { LanguageIcon, getLanguageIcon } from '@/utils/languageIcons'

interface CodeGeneratorFormProps {
  prompt: string
  onPromptChange: (value: string) => void
  language: string
  onLanguageChange: (value: string) => void
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function CodeGeneratorForm({
  prompt,
  onPromptChange,
  language,
  onLanguageChange,
  isLoading,
  onSubmit,
}: CodeGeneratorFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="prompt"
          className="text-sm font-medium text-foreground"
        >
          Prompt
        </label>
        <Input
          id="prompt"
          type="text"
          placeholder="e.g., Create a function that calculates the factorial of a number"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="language"
          className="text-sm font-medium text-foreground"
        >
          Programming Language
        </label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger id="language" className="w-full">
            <div className="flex items-center gap-2">
              {language && (
                <>
                  <LanguageIcon language={language} className="h-4 w-4" />
                  <SelectValue placeholder="Select a programming language">
                    {language}
                  </SelectValue>
                </>
              )}
              {!language && (
                <SelectValue placeholder="Select a programming language" />
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            {PROGRAMMING_LANGUAGES.map((lang) => {
              const LanguageIconComponent = getLanguageIcon(lang)
              return (
                <SelectItem 
                  key={lang} 
                  value={lang}
                  icon={LanguageIconComponent ? <LanguageIconComponent className="h-4 w-4" /> : undefined}
                >
                  {lang}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !prompt.trim() || !language}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </form>
  )
}

