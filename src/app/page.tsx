'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Surah, getSurahs } from '../lib/quran-api';

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    getSurahs().then(setSurahs);
  }, []);

  return (
    <main className="container py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Quran.com Clone</h1>
        <p className="text-gray-600">Your digital Quran companion</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {surahs.map((surah) => (
          <Link key={surah.number} href={`/surah/${surah.number}`}>
            <div className="card">
              <h2 className="text-xl font-bold">{surah.name}</h2>
              <p className="text-gray-500">{surah.englishName}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
