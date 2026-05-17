'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Suppress UNSAFE_componentWillReceiveProps warning from swagger-ui-react
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('UNSAFE_componentWillReceiveProps')
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    fetch('/api/swagger')
      .then((res) => res.json())
      .then((data) => setSpec(data));

    return () => {
      console.error = originalError;
    };
  }, []);

  if (!spec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Načítání API dokumentace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">API Dokumentace</h1>
          <p className="text-gray-300">Kompletní dokumentace REST API endpointů</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <SwaggerUI spec={spec} />
        </div>
      </div>
    </div>
  );
}
