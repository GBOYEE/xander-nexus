import { chromium } from 'playwright'
import { applyLinkedIn } from './linkedin-apply'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, baseDelay = 1000): Promise<T> {
  let lastError: Error | undefined
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}

export interface ApplicationResult {
  platform: string
  jobUrl: string
  success: boolean
  message: string
  screenshot?: string
}

export async function applyJob(platform: string, jobUrl: string, credentials: { email: string; password: string }, resumePath?: string): Promise<ApplicationResult> {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return applyLinkedIn(jobUrl, credentials.email, credentials.password)
    // future: indeed, glassdoor
    default:
      return { platform, jobUrl, success: false, message: `Unsupported platform: ${platform}` }
  }
}
