import { Shield, Key } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <Key className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">PGP Analyzer</h2>
            <p className="text-sm text-slate-500">Cryptographic Key Inspector</p>
          </div>
        </div>
      </div>
    </header>
  );
}