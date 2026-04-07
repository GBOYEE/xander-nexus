'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface Application {
  id: string
  platform: string
  jobUrl: string
  email: string
  success: boolean
  message: string
  screenshot?: string
  createdAt: string
}

export default function ApplicationsPage() {
  const [platform, setPlatform] = useState('linkedin')
  const [jobUrl, setJobUrl] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<Application[]>([])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      setHistory(data.applications || [])
    } catch (error) {
      console.error('Failed to fetch applications')
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleApply = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, jobUrl, email, password }),
      })
      const data = await res.json()
      setResult(data.result || data)
      fetchHistory() // refresh list
    } catch (error) {
      setResult({ success: false, message: 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
        <p className="text-muted-foreground">Automate applying to jobs via headless browser</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="platform">Platform</Label>
            <Select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="linkedin">LinkedIn Easy Apply</option>
              <option value="indeed">Indeed</option>
              <option value="glassdoor">Glassdoor</option>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input id="jobUrl" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button onClick={handleApply} disabled={loading}>
            {loading ? 'Applying...' : 'Apply Now'}
          </Button>
          {result && (
            <div className={`p-3 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <strong>{result.success ? 'Success' : 'Failed'}</strong>: {result.message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No applications yet.</p>
          ) : (
            <ul className="space-y-3">
              {history.map((app) => (
                <li key={app.id} className="border-b pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{app.platform}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-md">{app.jobUrl}</div>
                      <div className="text-xs text-muted-foreground">{new Date(app.createdAt).toLocaleString()}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${app.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {app.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  {app.message && <div className="text-sm mt-1">{app.message}</div>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
