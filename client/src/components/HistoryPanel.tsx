import { useState, useEffect } from 'react'
import { getHistory, HistoryItem, HistoryResponse } from '@/api.clients'
import { Button } from '@/components/ui/button'
import { CodeDisplay } from './CodeDisplay'

interface HistoryPanelProps {
  onSelectGeneration?: (generation: HistoryItem) => void
}

export function HistoryPanel({ onSelectGeneration }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selectedGeneration, setSelectedGeneration] = useState<HistoryItem | null>(null)
  const limit = 10

  const fetchHistory = async (pageNum: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistory(pageNum, limit)
      setHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory(page)
  }, [page])

  const formatTimestamp = (timestamp: string) => {
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
      return timestamp
    }
  }

  const handleSelectGeneration = (generation: HistoryItem) => {
    setSelectedGeneration(generation)
    onSelectGeneration?.(generation)
  }

  if (selectedGeneration) {
    return (
      <div className="w-full space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedGeneration(null)}
          className="mb-4"
        >
          ← Back to History
        </Button>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Prompt:</h3>
            <p className="text-sm text-foreground">{selectedGeneration.prompt}</p>
          </div>
        </div>
        <CodeDisplay
          code={selectedGeneration.code}
          language={selectedGeneration.language}
          timestamp={selectedGeneration.timestamp}
        />
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generation History</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchHistory(page)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading && !history && (
        <div className="text-center py-8 text-muted-foreground">
          Loading history...
        </div>
      )}

      {history && history.data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No generation history found.
        </div>
      )}

      {history && history.data.length > 0 && (
        <>
          <div className="space-y-2">
            {history.data.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectGeneration(item)}
                className="rounded-lg border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded bg-muted">
                        {item.language}
                      </span>
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.code.length} chars
                  </div>
                </div>
              </div>
            ))}
          </div>

          {history.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!history.pagination.hasPreviousPage || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {history.pagination.page} of {history.pagination.totalPages} 
                ({history.pagination.totalCount} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!history.pagination.hasNextPage || loading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

