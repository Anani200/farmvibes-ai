import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/utils/constants';
import { setClientUrl } from '@/services/api';

export function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('apiUrl') || API_BASE_URL;
  });
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = () => {
    localStorage.setItem('apiUrl', apiUrl);
    setClientUrl(apiUrl);
    setSavedMessage('Settings saved!');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const handleReset = () => {
    setApiUrl(API_BASE_URL);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Configure FarmVibes.AI frontend preferences.</p>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              API Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-sm text-gray-600 mt-2">
              The base URL for the FarmVibes.AI REST API (e.g., http://localhost:31108/v0)
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Default URL:</span> {API_BASE_URL}
            </p>
          </div>

          {savedMessage && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-sm text-green-900">✓ {savedMessage}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition font-medium"
            >
              Save Settings
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition font-medium"
            >
              Reset to Default
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Environment Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Frontend Version</dt>
              <dd className="text-gray-600">0.1.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">API Version</dt>
              <dd className="text-gray-600">v0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Current API URL</dt>
              <dd className="text-gray-600 font-mono">{apiUrl}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Environment</dt>
              <dd className="text-gray-600">
                {import.meta.env.VITE_API_URL ? 'Fixed' : 'Dynamic'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
