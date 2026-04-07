import { chromium, Browser, Page } from 'playwright'

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

export async function applyLinkedIn(jobUrl: string, email: string, password: string): Promise<{ success: boolean; message: string; screenshot?: string }> {
  let browser: Browser | undefined
  try {
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      viewport: { width: 1280, height: 800 },
      locale: 'en-US',
      timezoneId: 'America/New_York'
    })
    const page = await context.newPage()

    // Optional: login first (simplified)
    await page.goto('https://www.linkedin.com/login', { timeout: 30000 })
    await page.fill('input[name="session_key"]', email)
    await page.fill('input[name="session_password"]', password)
    await page.click('button[type="submit"]')
    await withRetry(async () => {
      await page.waitForURL('**/feed/**', { timeout: 15000 }).catch(() => {})
    })

    // Navigate to job
    await withRetry(async () => {
      await page.goto(jobUrl, { timeout: 30000 })
    })

    // Click Easy Apply button
    await withRetry(async () => {
      try {
        await page.click('button[data-control-name="easy_apply_button"]', { timeout: 10000 })
      } catch (e1) {
        try {
          await page.click('button:has-text("Easy Apply")', { timeout: 5000 })
        } catch (e2) {
          throw new Error('Could not find Easy Apply button')
        }
      }
    })

    // Wait for modal
    await page.waitForSelector('div[role="dialog"]', { timeout: 15000 })

    // Simple auto-fill for common fields
    const fields = await page.$$('input[required], textarea[required], select[required]')
    for (const field of fields) {
      const name = (await field.getAttribute('name')) || ''
      const type = (await field.getAttribute('type')) || ''
      const label = await field.evaluate((el) => (el as HTMLElement).closest('label')?.innerText?.toLowerCase() || '')
      if (name.includes('phone') || type === 'tel' || label.includes('phone')) {
        await field.fill('+1234567890')
      } else if (name.includes('email') || type === 'email' || label.includes('email')) {
        await field.fill(email)
      } else if (type === 'file') {
        // skip resume upload for now
      } else {
        await field.fill('Yes')
      }
    }

    // Submit
    await page.click('button[type="submit"], button:has-text("Submit application")', { timeout: 10000 }).catch(() => {})
    await page.waitForTimeout(2000)

    const screenshot = await page.screenshot({ fullPage: false })
    await browser.close()
    return { success: true, message: 'Application submitted', screenshot: `data:image/png;base64,${screenshot.toString('base64')}` }
  } catch (error) {
    if (browser) await browser.close().catch(() => {})
    return { success: false, message: error instanceof Error ? error.message : String(error) }
  }
}
