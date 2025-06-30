'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseKey } from '@/lib/pgp-parser';
import type { ParsedKeyData } from '@/types/pgp';

interface KeyUploaderProps {
  onKeyParsed: (data: ParsedKeyData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function KeyUploader({ onKeyParsed, isLoading, setIsLoading }: KeyUploaderProps) {
  const [keyText, setKeyText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleKeyAnalysis = useCallback(async (keyContent: string) => {
    if (!keyContent.trim()) {
      setError('Please provide a PGP key to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedData = await parseKey(keyContent);
      onKeyParsed(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PGP key');
    } finally {
      setIsLoading(false);
    }
  }, [onKeyParsed, setIsLoading]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setKeyText(content);
      handleKeyAnalysis(content);
    };
    reader.readAsText(file);
  }, [handleKeyAnalysis]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Upload Your PGP Key
            </h2>
            <p className="text-slate-600">
              Drag and drop a key file or paste the key content below
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">
              Drop your PGP key file here, or{' '}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                browse files
                <input
                  type="file"
                  className="hidden"
                  accept=".asc,.gpg,.pgp,.key,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </label>
            </p>
            <p className="text-sm text-slate-500">
              Supports .asc, .gpg, .pgp, .key, and .txt files
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              <span className="text-slate-700 font-medium">Or paste key content:</span>
            </div>
            
            <Textarea
              placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;&#10;Paste your PGP key here...&#10;&#10;-----END PGP PUBLIC KEY BLOCK-----"
              value={keyText}
              onChange={(e) => setKeyText(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none"
            />
            
            <Button
              onClick={() => handleKeyAnalysis(keyText)}
              disabled={isLoading || !keyText.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
            >
              {isLoading ? 'Analyzing Key...' : 'Analyze PGP Key'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}