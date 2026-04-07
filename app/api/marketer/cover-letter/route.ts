import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/openrouter'

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, resumeText, tone = 'professional' } = await req.json()
    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: 'jobDescription and resumeText required' }, { status: 400 })
    }

    const prompt = `Write a personalized cover letter for the following job description. Use the provided resume to tailor the content. Tone: ${tone}.\n\nJob Description:\n${jobDescription}\n\nResume:\n${resumeText}`

    const letter = await generateText(prompt, 'You are an expert career coach and writer.')
    return NextResponse.json({ letter })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
