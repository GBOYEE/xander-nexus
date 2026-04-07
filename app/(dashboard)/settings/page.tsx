'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure Xander Nexus integrations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">OpenClaw Gateway</div>
              <div className="text-sm text-muted-foreground">localhost:18789</div>
            </div>
            <Button variant="outline" size="sm">Test</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">aiopsx</div>
              <div className="text-sm text-muted-foreground">localhost:8080</div>
            </div>
            <Button variant="outline" size="sm">Test</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">HiveSec</div>
              <div className="text-sm text-muted-foreground">localhost:9000</div>
            </div>
            <Button variant="outline" size="sm">Test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
