'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

export default function EmailScanForm() {
  const [textContent, setTextContent] = useState('')
  const [senderDomain, setSenderDomain] = useState('')
  const [result, setResult] = useState<null | { prediction: string; confidence: number }>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('http://localhost:8000/scan/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_content: textContent,
          sender_domain: senderDomain,
        }),
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert('Error scanning email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Email Fake/Legit Checker</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <Textarea
            placeholder="Paste email content here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={6}
          />
          <Input
            placeholder="Sender domain (e.g., internship-google.com)"
            value={senderDomain}
            onChange={(e) => setSenderDomain(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Scanning...' : 'Check Email'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold">
            Result: <span className={result.prediction === 'Legit' ? 'text-green-600' : 'text-red-600'}>
              {result.prediction}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">Confidence: {result.confidence * 100}%</p>
        </div>
      )}
    </div>
  )
}
