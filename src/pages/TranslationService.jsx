/* eslint-env browser */
/* global setTimeout, alert, navigator */
import React, { useState } from 'react';

/**
 * Translation Service
 * Gemini-powered localization for listing descriptions
 * Inspired by Play Console's translation service
 */
export default function TranslationService() {
  const [sourceText, setSourceText] = useState('');
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(['es', 'fr']);

  const languages = [
    { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
    { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
    { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
    { code: 'it', name: 'Italian (Italiano)', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese (Português)', flag: '🇵🇹' },
    { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
  ];

  // Mock translation function (in production, this would call Gemini API)
  const mockTranslate = async (text, targetLang) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock translations for demo purposes
    const mockTranslations = {
      es: 'Vintage chaqueta de mezclilla en excelente condición. Color azul clásico con desgaste auténtico. Perfecta para un estilo casual.',
      fr: 'Veste en jean vintage en excellent état. Couleur bleue classique avec usure authentique. Parfait pour un style décontracté.',
      de: 'Vintage Jeansjacke in ausgezeichnetem Zustand. Klassische blaue Farbe mit authentischer Abnutzung. Perfekt für einen lässigen Stil.',
      it: 'Giacca di jeans vintage in ottime condizioni. Colore blu classico con usura autentica. Perfetto per uno stile casual.',
      pt: 'Jaqueta jeans vintage em excelente estado. Cor azul clássica com desgaste autêntico. Perfeito para um estilo casual.',
      ja: 'ビンテージデニムジャケット、優れた状態。クラシックなブルーカラーで本格的な風合い。カジュアルスタイルに最適。',
      ko: '빈티지 데님 재킷, 훌륭한 상태. 클래식 블루 컬러에 정통 마모감. 캐주얼 스타일에 완벽.',
      zh: '复古牛仔夹克，状况极佳。经典蓝色，真实磨损感。休闲风格的完美选择。',
    };

    return mockTranslations[targetLang] || text;
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      alert('Please enter text to translate');
      return;
    }

    if (selectedLanguages.length === 0) {
      alert('Please select at least one target language');
      return;
    }

    setIsTranslating(true);
    const newTranslations = {};

    for (const lang of selectedLanguages) {
      newTranslations[lang] = await mockTranslate(sourceText, lang);
    }

    setTranslations(newTranslations);
    setIsTranslating(false);
  };

  const toggleLanguage = (langCode) => {
    if (selectedLanguages.includes(langCode)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== langCode));
    } else {
      setSelectedLanguages([...selectedLanguages, langCode]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-blush p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => window.location.reload()}
          className="mb-4 text-rose-dark hover:underline"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-diamond text-rose-dark">Translation Service</h1>
            <span className="px-3 py-1 bg-gold text-dark text-xs font-semibold rounded-full">
              Powered by Gemini AI
            </span>
          </div>
          <p className="text-gray-600 mb-6">
            Reach a global audience with high-quality translations at no cost
          </p>

          {/* Source Text Input */}
          <div className="mb-6">
            <label htmlFor="source-text" className="block text-sm font-medium mb-2">
              Listing Description (English):
            </label>
            <textarea
              id="source-text"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter your listing description here... e.g., 'Vintage denim jacket in excellent condition. Classic blue color with authentic wear. Perfect for casual style.'"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-rose"
              disabled={isTranslating}
            />
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Select Target Languages:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  disabled={isTranslating}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedLanguages.includes(lang.code)
                      ? 'border-rose bg-rose text-white'
                      : 'border-gray-200 bg-white hover:border-rose'
                  } disabled:opacity-50`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-xs font-medium">{lang.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim() || selectedLanguages.length === 0}
            className="cta w-full py-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTranslating ? '🌍 Translating with Gemini AI...' : '🌍 Translate Now'}
          </button>

          {/* Translations Output */}
          {Object.keys(translations).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3">Translations:</h3>
              {selectedLanguages.map((langCode) => {
                const lang = languages.find(l => l.code === langCode);
                const translation = translations[langCode];
                
                if (!translation) return null;

                return (
                  <div
                    key={langCode}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-semibold">{lang.name}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(translation)}
                        className="text-xs px-3 py-1 bg-rose text-white rounded hover:bg-rose-dark"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{translation}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-blue-800">
              Listings with translations in multiple languages get up to 40% more engagement from
              international buyers. You can preview and edit translations before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
