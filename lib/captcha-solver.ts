/**
 * CAPTCHA solving utilities (stub integration).
 * Supports 2captcha.com API for reCAPTCHA and image CAPTCHAs.
 */

export interface SolveRecaptchaOptions {
  siteKey: string
  pageUrl: string
  apiKey?: string
}

export async function solveRecaptcha({ siteKey, pageUrl, apiKey = process.env.CAPTCHA_API_KEY }: SolveRecaptchaOptions): Promise<string> {
  if (!apiKey) {
    throw new Error('CAPTCHA_API_KEY not set')
  }

  // Submit CAPTCHA to 2captcha
  const submitRes = await fetch(`http://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${pageUrl}`)
  const submitText = await submitRes.text()
  if (!submitText.startsWith('OK|')) {
    throw new Error(`2captcha submit failed: ${submitText}`)
  }
  const captchaId = submitText.split('|')[1]

  // Poll for solution
  for (let i = 0; i < 40; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000))
    const res = await fetch(`http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`)
    const text = await res.text()
    if (text.startsWith('OK|')) {
      return text.split('|')[1]
    }
    if (!text.includes('CAPCHA_NOT_READY')) {
      break
    }
  }

  throw new Error('CAPTCHA solving timeout or error')
}
