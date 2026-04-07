import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const APPS_PATH = join(process.cwd(), 'data', 'applications.json')

export interface ApplicationRecord {
  id: string
  platform: string
  jobUrl: string
  email: string
  success: boolean
  message: string
  screenshot?: string
  createdAt: string
}

function loadApps(): ApplicationRecord[] {
  try {
    const data = readFileSync(APPS_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function saveApps(apps: ApplicationRecord[]) {
  writeFileSync(APPS_PATH, JSON.stringify(apps, null, 2))
}

export function addApplication(app: ApplicationRecord) {
  const apps = loadApps()
  apps.unshift(app)
  // Keep last 500
  if (apps.length > 500) apps.pop()
  saveApps(apps)
}

export function getApplications(): ApplicationRecord[] {
  return loadApps()
}
