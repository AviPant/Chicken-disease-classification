import { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ResultCard from './components/ResultCard';
import InfoSection from './components/InfoSection';

const API_URL = 'http://localhost:8080';

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.detail || `Server error (${response.status})`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Make sure the FastAPI backend is running on port 8000.'
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="app-bg" />
      <div className="app-container">
        <Header />

        <UploadZone
          file={file}
          onFileSelect={handleFileSelect}
          onClear={handleClear}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {error && (
          <div className="error-banner" id="error-banner">
            <span className="error-banner__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </span>
            <span className="error-banner__text">{error}</span>
          </div>
        )}

        {result && (
          <ResultCard
            prediction={result.prediction}
            confidence={result.confidence}
          />
        )}

        <InfoSection />

        <footer className="footer">
          <p className="footer__text">
            Built with <span>VGG16</span> · FastAPI · React
          </p>
        </footer>
      </div>
    </>
  );
}
