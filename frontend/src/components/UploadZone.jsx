import { useRef, useState } from 'react';

export default function UploadZone({ onFileSelect, file, onClear, onAnalyze, isLoading }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileSelect(selected);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="upload-zone glass-card">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        id="file-upload-input"
      />

      {!file ? (
        <div
          className={`upload-dropzone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          id="upload-dropzone"
        >
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="upload-text-primary">Drop your image here</p>
          <p className="upload-text-secondary">
            or <span>browse files</span> — JPG, PNG, WebP
          </p>
        </div>
      ) : (
        <div className="upload-dropzone has-file">
          <div className="upload-preview">
            <div className="upload-preview__img-wrapper">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="upload-preview__img"
              />
            </div>
            <div className="upload-preview__details">
              <p className="upload-preview__name">{file.name}</p>
              <p className="upload-preview__size">{formatSize(file.size)}</p>
              <div className="upload-preview__actions">
                <button
                  className="btn btn-primary"
                  onClick={onAnalyze}
                  disabled={isLoading}
                  id="analyze-button"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Analyze Image
                    </>
                  )}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={onClear}
                  disabled={isLoading}
                  id="clear-button"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
