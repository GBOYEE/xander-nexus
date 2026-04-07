'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Square, RefreshCw } from 'lucide-react'

interface Agent {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error'
  uptime: number
  lastActive: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/agents')
      if (res.ok) {
        const data = await res.json()
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 5000)
    return () => clearInterval(interval)
  }, [])

  const startAgent = async (id: string) => {
    await fetch(`/api/agents/${id}/start`, { method: 'POST' })
    fetchAgents()
  }

  const stopAgent = async (id: string) => {
    await fetch(`/api/agents/${id}/stop`, { method: 'POST' })
    fetchAgents()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">Manage your autonomous AI agents</p>
        </div>
        <Button onClick={fetchAgents} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : agents.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No agents found. Start an agent from the OpenClaw gateway.
            </CardContent>
          </Card>
        ) : (
          agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{agent.name}</CardTitle>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    agent.status === 'running'
                      ? 'bg-green-500/10 text-green-500'
                      : agent.status === 'error'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {agent.status}
                </span>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime</span>
                    <span>{Math.floor(agent.uptime / 3600)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Active</span>
                    <span>{new Date(agent.lastActive).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button size="sm" variant="outline" onClick={() => startAgent(agent.id)} disabled={agent.status === 'running'}>
                      <Play className="mr-2 h-3 w-3" />
                      Start
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => stopAgent(agent.id)} disabled={agent.status !== 'running'}>
                      <Square className="mr-2 h-3 w-3" />
                      Stop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
