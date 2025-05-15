import React, { useState, useEffect } from 'react';

export default function SettingsPanel({ open, onClose, settings, onUpdateSettings }) {
  const [localSettings, setLocalSettings] = useState(settings || {
    theme: 'system',
    fontSize: 16,
    privacyLock: false,
    autoSave: true,
    defaultAppendMode: true,
    language: 'en-US'
  });

  // Update local settings when props change
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (onUpdateSettings) {
      onUpdateSettings(localSettings);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40 transition-opacity duration-200">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[360px] max-w-full max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button
            className="text-gray-400 hover:text-gray-700 transition-colors"
            onClick={onClose}
            aria-label="Close settings"
          >
            &#10005;
          </button>
        </header>

        <div className="space-y-6">
          {/* Theme Setting */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('theme', 'light')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  localSettings.theme === 'light'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                aria-pressed={localSettings.theme === 'light'}
              >
                Light
              </button>
              <button
                onClick={() => handleChange('theme', 'dark')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  localSettings.theme === 'dark'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                aria-pressed={localSettings.theme === 'dark'}
              >
                Dark
              </button>
              <button
                onClick={() => handleChange('theme', 'system')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  localSettings.theme === 'system'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
                aria-pressed={localSettings.theme === 'system'}
              >
                System
              </button>
            </div>
          </div>

          {/* Font Size Setting */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Font Size</label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Small</span>
              <input
                type="range"
                min="12"
                max="20"
                step="1"
                value={localSettings.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full accent-blue-600"
                aria-label="Font size"
              />
              <span className="text-sm text-gray-500">Large</span>
              <span className="text-gray-700 min-w-[2rem] text-right">{localSettings.fontSize}px</span>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Privacy</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.privacyLock}
                  onChange={(e) => handleChange('privacyLock', e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>Privacy Lock Mode</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                When enabled, notes will be automatically cleared when you close the app.
              </p>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>Auto-save Notes</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Automatically save notes as you type.
              </p>
            </div>
          </div>

          {/* Speech Recognition Settings */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Speech Recognition</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.defaultAppendMode}
                  onChange={(e) => handleChange('defaultAppendMode', e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>Default to Append Mode</span>
              </label>

              <div>
                <label className="block mb-1 text-sm">Language</label>
                <select
                  value={localSettings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="it-IT">Italian</option>
                  <option value="ja-JP">Japanese</option>
                  <option value="ko-KR">Korean</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
