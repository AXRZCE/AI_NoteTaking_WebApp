import React, { useState } from 'react';

const SettingsPanel = ({ 
  settings, 
  onUpdateSettings, 
  onClose 
}) => {
  const [localSettings, setLocalSettings] = useState({ ...settings });
  
  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Theme Setting */}
          <div>
            <h3 className="font-medium mb-2">Theme</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('theme', 'light')}
                className={`px-4 py-2 rounded-lg border ${
                  localSettings.theme === 'light' 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                aria-pressed={localSettings.theme === 'light'}
              >
                Light
              </button>
              <button
                onClick={() => handleChange('theme', 'dark')}
                className={`px-4 py-2 rounded-lg border ${
                  localSettings.theme === 'dark' 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                aria-pressed={localSettings.theme === 'dark'}
              >
                Dark
              </button>
              <button
                onClick={() => handleChange('theme', 'system')}
                className={`px-4 py-2 rounded-lg border ${
                  localSettings.theme === 'system' 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                aria-pressed={localSettings.theme === 'system'}
              >
                System
              </button>
            </div>
          </div>
          
          {/* Font Size Setting */}
          <div>
            <h3 className="font-medium mb-2">Font Size</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="12"
                max="20"
                step="1"
                value={localSettings.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full"
                aria-label="Font size"
              />
              <span className="text-gray-700 min-w-[2.5rem]">{localSettings.fontSize}px</span>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div>
            <h3 className="font-medium mb-2">Privacy</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.privacyLock}
                  onChange={(e) => handleChange('privacyLock', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Privacy Lock Mode</span>
              </label>
              <p className="text-sm text-gray-500 ml-6">
                When enabled, notes will be automatically cleared when you close the app.
              </p>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Auto-save Notes</span>
              </label>
              <p className="text-sm text-gray-500 ml-6">
                Automatically save notes as you type.
              </p>
            </div>
          </div>
          
          {/* Speech Recognition Settings */}
          <div>
            <h3 className="font-medium mb-2">Speech Recognition</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.defaultAppendMode}
                  onChange={(e) => handleChange('defaultAppendMode', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Default to Append Mode</span>
              </label>
              <p className="text-sm text-gray-500 ml-6">
                When enabled, new speech will be appended to existing notes by default.
              </p>
              
              <div>
                <label className="block mb-1">Language</label>
                <select
                  value={localSettings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
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
};

export default SettingsPanel;
