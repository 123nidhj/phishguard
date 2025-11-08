// components/LinkScanForm.tsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function LinkScanForm() {
  const [link, setLink] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8000/scan/link", {
        url: link,
      });
      setResult(res.data);
    } catch (err) {
      alert("Error scanning link");
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">🔗 Scan Link</h2>
      <input
        type="text"
        placeholder="Enter suspicious link"
        className="w-full border rounded p-2 mb-2"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
        Scan Link
      </button>

      {result && (
        <div className="mt-4">
          <p><strong>Prediction:</strong> {result.prediction}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
}
