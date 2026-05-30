'use client'
import { useState } from 'react'

export default function Home() {
  const [form, setForm] = useState({ niveau: 'CP', theme: '', difficulte: 'facile', longueur: 'courte' })
  const [story, setStory] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    const res = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setStory(data)
    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Histoires CP-CE1</h1>
      <div className="space-y-4 bg-white rounded-2xl shadow p-6">
        <select className="w-full border rounded-lg p-2" value={form.niveau} onChange={e => setForm({...form, niveau: e.target.value})}>
          <option>CP</option><option>CE1</option>
        </select>
        <input className="w-full border rounded-lg p-2" placeholder="Theme..." value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} />
        <select className="w-full border rounded-lg p-2" value={form.difficulte} onChange={e => setForm({...form, difficulte: e.target.value})}>
          <option value="facile">Facile</option><option value="moyen">Moyen</option><option value="difficile">Difficile</option>
        </select>
        <button onClick={generate} disabled={!form.theme || loading} className="w-full bg-blue-600 text-white rounded-lg p-3 disabled:opacity-50">
          {loading ? 'Generation...' : 'Generer une histoire'}
        </button>
      </div>
      {story && (
        <div className="mt-8 bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold">{story.titre}</h2>
          <p className="leading-relaxed">{story.histoire}</p>
          <h3 className="font-bold">Questions</h3>
          {story.questions.map((q: string, i: number) => <p key={i} className="bg-blue-50 rounded p-2">{q}</p>)}
          <h3 className="font-bold">Vrai ou Faux</h3>
          {story.vrai_faux.map((vf: any, i: number) => (
            <div key={i} className="bg-green-50 rounded p-2 flex justify-between">
              <span>{vf.question}</span><span>{vf.reponse ? 'Vrai' : 'Faux'}</span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
