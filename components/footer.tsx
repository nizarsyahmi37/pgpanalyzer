import { Github, Shield, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-slate-800">PGP Analyzer</span>
            </div>
            <p className="text-slate-600 text-sm">
              A comprehensive tool for analyzing and visualizing PGP key structures 
              with detailed cryptographic information.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Key fingerprint analysis
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Subkey breakdown
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Usage flag inspection
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                User identity parsing
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Security</h3>
            <p className="text-sm text-slate-600 mb-4">
              All key analysis is performed client-side. Your keys never leave your browser.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Github className="h-4 w-4" />
              <span>Built with OpenPGP.js</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>&copy; 2025 PGP Key Anatomy Visualizer. Built for educational and analysis purposes.</p>
        </div>
      </div>
    </footer>
  );
}