'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Plus } from 'lucide-react'

interface Tool {
  id: string
  name: string
  description: string
  lastTested?: string
  status: 'ok' | 'error'
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([
    { id: 'search', name: 'Web Search', description: 'Search Google and return top results', status: 'ok' },
    { id: 'browse', name: 'Browse Page', description: 'Extract clean text and optional screenshot from a URL', status: 'ok' },
  ])
  const [testing, setTesting] = useState<string | null>(null)

  const testTool = async (toolId: string) => {
    setTesting(toolId)
    try {
      const res = await fetch('/api/tools/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId }),
      })
      if (res.ok) {
        alert('Tool test succeeded')
      } else {
        alert('Tool test failed')
      }
    } catch (error) {
      alert('Error testing tool')
    } finally {
      setTesting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
          <p className="text-muted-foreground">Design, test, and manage agent tools</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Tool
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{tool.name}</CardTitle>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                tool.status === 'ok' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {tool.status}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={() => testTool(tool.id)} disabled={testing === tool.id}>
                  <Play className="mr-2 h-3 w-3" />
                  {testing === tool.id ? 'Testing...' : 'Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
