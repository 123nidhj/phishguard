'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DocScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    prediction: string
    confidence: number
    extracted_text: string
  }>(null)

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('http://127.0.0.1:8000/scan/doc', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert('Failed to analyze document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">Document Scanner</h1>

          <div className="space-y-2">
            <Label htmlFor="file">Upload a PDF or DOCX</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? 'Scanning...' : 'Scan Document'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Prediction Result</h2>
            <p>
              <strong>Status:</strong>{' '}
              <span className={result.prediction === 'Legit' ? 'text-green-600' : 'text-red-600'}>
                {result.prediction}
              </span>
            </p>
            <p>
              <strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%
            </p>

            <h3 className="mt-4 font-medium">Extracted Text:</h3>
            <div className="max-h-64 overflow-y-auto whitespace-pre-wrap bg-gray-100 p-3 rounded border">
              {result.extracted_text}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
