
import { getAyahsOfSurah, getSurah } from '../../../lib/quran-api';
import Link from 'next/link';

export default async function SurahPage({ params }: { params: { surahNumber: string } }) {
  const surahNumber = parseInt(params.surahNumber, 10);
  const ayahs = await getAyahsOfSurah(surahNumber);
  const surah = await getSurah(surahNumber);

  const prevSurah = surahNumber > 1 ? surahNumber - 1 : null;
  const nextSurah = surahNumber < 114 ? surahNumber + 1 : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{surah.name} ({surah.englishName})</h1>
      <div className="flex justify-between mb-8">
        {prevSurah && (
          <Link href={`/surah/${prevSurah}`}>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Previous Surah
            </a>
          </Link>
        )}
        {nextSurah && (
          <Link href={`/surah/${nextSurah}`}>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Next Surah
            </a>
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {ayahs.map((ayah) => (
          <div key={ayah.number} className="p-4 border rounded-lg">
            <p className="text-lg">{ayah.text}</p>
            <p className="text-sm text-gray-500">Ayah {ayah.numberInSurah}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
