'use client';

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function AdminPage() {
  const [url, setUrl] = useState('');

  const handleUpload = async () => {
    if (!url.trim()) return;
    await addDoc(collection(db, 'phishing_links'), { url });
    alert('Link added to DB!');
    setUrl('');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col gap-4 items-center justify-center">
      <h1 className="text-2xl font-bold">PhisGuard Admin</h1>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter phishing URL (e.g., bad.com)"
        className="border px-4 py-2 rounded w-full max-w-md"
      />
      <button
        onClick={handleUpload}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Upload Link
      </button>
    </div>
  );
}
