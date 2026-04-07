'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface Lead {
  id: string
  source: string
  title: string
  company: string
  url: string
  location?: string
  salary?: string
  description?: string
  status: string
  fetchedAt: string
}

interface Application {
  id: string
  leadId: string
  platform: string
  sentAt: string
  status: string
  body?: string
}

export default function MarketerPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [bulkUrls, setBulkUrls] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchLeads = async () => {
    const res = await fetch('/api/marketer/leads')
    const data = await res.json()
    setLeads(data.leads || [])
  }

  const fetchApps = async () => {
    const res = await fetch('/api/marketer/applications')
    const data = await res.json()
    setApplications(data.applications || [])
  }

  useEffect(() => {
    fetchLeads()
    fetchApps()
  }, [])

  const importLeads = async () => {
    const urls = bulkUrls.split('\n').filter((u) => u.trim())
    const leadsToImport = urls.map((url) => ({ url: url.trim(), title: 'Imported Job', source: 'manual' }))
    const res = await fetch('/api/marketer/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadsToImport),
    })
    if (res.ok) {
      setMsg({ type: 'success', text: `Imported ${leadsToImport.length} leads` })
      setBulkUrls('')
      fetchLeads()
    } else {
      setMsg({ type: 'error', text: 'Failed to import leads' })
    }
  }

  const applySelected = async (selectedIds: string[]) => {
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch('/api/marketer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: selectedIds, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg({ type: 'success', text: `Applied to ${data.results.length} jobs` })
        fetchApps()
      } else {
        setMsg({ type: 'error', text: data.error || 'Apply failed' })
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  const [selected, setSelected] = useState<string[]>([])
  const [resumeText, setResumeText] = useState('')
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const generateCoverLetter = async () => {
    if (selected.length !== 1) {
      setMsg({ type: 'error', text: 'Select exactly one lead to generate cover letter' })
      return
    }
    const lead = leads.find(l => l.id === selected[0])
    if (!lead) return
    setGenerating(true)
    try {
      const res = await fetch('/api/marketer/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: lead.description || lead.title, resumeText })
      })
      const data = await res.json()
      if (res.ok) {
        setGeneratedLetter(data.letter)
        setMsg({ type: 'success', text: 'Cover letter generated' })
      } else {
        setMsg({ type: 'error', text: data.error || 'Generation failed' })
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Network error' })
    } finally {
      setGenerating(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketer Agent</h1>
        <p className="text-muted-foreground">Find leads, craft outreach, apply automatically</p>
      </div>

      {msg && <div className={`p-3 rounded ${msg.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>{msg.text}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Import Leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Job URLs (one per line)</Label>
              <textarea
                className="border rounded p-2 h-32"
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                placeholder="https://linkedin.com/jobs/..."
              />
            </div>
            <Button onClick={importLeads}>Import</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Apply to Selected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>LinkedIn Credentials</Label>
              <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button onClick={() => applySelected(selected)} disabled={loading || selected.length === 0}>
              {loading ? 'Applying...' : `Apply to ${selected.length} jobs`}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? leads.map(l => l.id) : [])} checked={selected.length === leads.length && leads.length > 0} /></th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Company</th>
                  <th className="p-2 text-left">Source</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Fetched</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/50">
                    <td className="p-2"><input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleSelect(lead.id)} /></td>
                    <td className="p-2 truncate max-w-md"><a href={lead.url} target="_blank" rel="noopener" className="text-blue-600 hover:underline">{lead.title}</a></td>
                    <td className="p-2">{lead.company}</td>
                    <td className="p-2">{lead.source}</td>
                    <td className="p-2">{lead.status}</td>
                    <td className="p-2">{new Date(lead.fetchedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cover Letter Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Your Resume (plain text)</Label>
            <textarea
              className="border rounded p-2 h-40"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
            />
          </div>
          <Button onClick={generateCoverLetter} disabled={generating || !resumeText}>
            {generating ? 'Generating...' : 'Generate Cover Letter'}
          </Button>
          {generatedLetter && (
            <div className="border p-4 rounded whitespace-pre-wrap text-sm">{generatedLetter}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground text-sm">No applications yet.</p>
          ) : (
            <ul className="space-y-2">
              {applications.map((app) => (
                <li key={app.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{app.platform}</div>
                      <div className="text-sm text-muted-foreground">{app.sentAt}</div>
                      {app.body && <div className="text-sm mt-1">{app.body}</div>}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${app.status === 'sent' ? 'bg-green-100 text-green-800' : app.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>{app.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
