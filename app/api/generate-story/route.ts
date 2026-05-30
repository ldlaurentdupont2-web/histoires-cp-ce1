import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request: Request) {
  const { niveau, theme, difficulte, longueur } = await request.json()

  const prompt = `Tu es un auteur jeunesse. Génère une histoire pour niveau ${niveau} sur : ${theme}. Difficulté : ${difficulte}. Longueur : ${longueur}. Réponds UNIQUEMENT avec du JSON brut sans markdown : {"titre":"...","histoire":"...","questions":["..."],"vrai_faux":[{"question":"...","reponse":true}]}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }

  const text = content.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const story = JSON.parse(text)
  return NextResponse.json(story)
}
