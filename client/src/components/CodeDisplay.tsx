import { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/components/theme-provider'
import { LanguageIcon } from '@/utils/languageIcons'

interface CodeDisplayProps {
  code: string
  language: string
  timestamp?: string
  generationId?: string
}

// Map common language names to Prism language identifiers
const languageMap: Record<string, string> = {
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'Python': 'python',
  'Java': 'java',
  'C++': 'cpp',
  'C': 'c',
  'C#': 'csharp',
  'Go': 'go',
  'Rust': 'rust',
  'R': 'r',
}

export function CodeDisplay({ code, language, timestamp }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { theme } = useTheme()
  
  // Get the Prism language identifier, default to 'text' if not found
  const prismLanguage = languageMap[language] || language.toLowerCase() || 'text'
  
  // Track the actual applied theme by checking the document element
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    // Initial check
    checkDarkMode()
    
    // Watch for changes in system theme preference (for 'system' theme)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        checkDarkMode()
      }
    }
    
    // Watch for class changes on document element
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])
  
  // Determine the syntax highlighting style based on theme
  const syntaxStyle = isDarkMode ? oneDark : oneLight

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return null
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return null
    }
  }

  const formattedTimestamp = formatTimestamp(timestamp)

  return (
    <div className="w-full mt-6">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2 bg-muted border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LanguageIcon language={language} className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">{language}</span>
            {formattedTimestamp && (
              <span className="text-xs text-muted-foreground">
                Generated: {formattedTimestamp}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={prismLanguage}
            style={syntaxStyle}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
            showLineNumbers
            wrapLines
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}

