import { type ComponentType } from 'react'
import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiCplusplus, 
  SiSharp, 
  SiGo, 
  SiRust 
} from 'react-icons/si'
import { DiJava } from 'react-icons/di'
import { FaCode } from 'react-icons/fa'

// eslint-disable-next-line react-refresh/only-export-components
export const languageIcons: Record<string, ComponentType<{ className?: string }>> = {
  'JavaScript': SiJavascript,
  'TypeScript': SiTypescript,
  'Python': SiPython,
  'Java': DiJava,
  'C++': SiCplusplus,
  'C#': SiSharp,
  'C': FaCode, // Using generic code icon for C
  'Go': SiGo,
  'Rust': SiRust,
  'R': FaCode, // Using generic code icon for R
}

interface LanguageIconProps {
  language: string
  className?: string
}

export function LanguageIcon({ language, className }: LanguageIconProps) {
  const Icon = languageIcons[language]
  if (!Icon) return null
  return <Icon className={className} />
}

// eslint-disable-next-line react-refresh/only-export-components
export function getLanguageIcon(language: string): ComponentType<{ className?: string }> | undefined {
  return languageIcons[language]
}

