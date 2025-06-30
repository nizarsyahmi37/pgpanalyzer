'use client';

import { useState } from 'react';
import { KeyUploader } from '@/components/key-uploader';
import { KeyAnalysis } from '@/components/key-analysis';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import type { ParsedKeyData } from '@/types/pgp';

export default function Home() {
  const [keyData, setKeyData] = useState<ParsedKeyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            PGP Key Anatomy Visualizer
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Upload your PGP key to get a comprehensive breakdown of its structure, 
            including fingerprints, key IDs, user identities, subkeys, and usage flags.
          </p>
        </div>

        <div className="space-y-8">
          <KeyUploader 
            onKeyParsed={setKeyData} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          
          {keyData && (
            <KeyAnalysis keyData={keyData} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}