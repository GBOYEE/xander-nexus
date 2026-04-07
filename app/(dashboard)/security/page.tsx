'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, CheckCircle, Play } from 'lucide-react'

interface ScanResult {
  id: string
  timestamp: string
  status: 'passed' | 'failed' | 'warning'
  findings: number
  summary: string
}

export default function SecurityPage() {
  const [scans, setScans] = useState<ScanResult[]>([])
  const [running, setRunning] = useState(false)

  const runScan = async () => {
    setRunning(true)
    try {
      const res = await fetch('/api/security/scans', { method: 'POST' })
      if (res.ok) {
        alert('Scan started successfully')
        fetchScans()
      }
    } catch (error) {
      alert('Failed to start scan')
    } finally {
      setRunning(false)
    }
  }

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/security/scans')
      if (res.ok) {
        const data = await res.json()
        setScans(data.scans)
      }
    } catch (error) {
      console.error('Failed to fetch scans:', error)
    }
  }

  useEffect(() => {
    fetchScans()
    const interval = setInterval(fetchScans, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Hub</h1>
          <p className="text-muted-foreground">Vulnerability scans and alignment audits</p>
        </div>
        <Button onClick={runScan} disabled={running}>
          <Play className="mr-2 h-4 w-4" />
          {running ? 'Scanning...' : 'Run Scan'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {scans.filter((s) => s.status === 'failed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {scans.filter((s) => s.status === 'passed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <p className="text-muted-foreground text-sm">No scans yet. Run your first security scan.</p>
          ) : (
            <div className="space-y-4">
              {scans.slice(0, 5).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <div className="font-medium">{scan.status.toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">{scan.summary}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(scan.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-lg font-bold">{scan.findings} findings</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
