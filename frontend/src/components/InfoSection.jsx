export default function InfoSection() {
  return (
    <div className="info-section glass-card">
      <div className="info-section__header">
        <div className="info-section__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <h3 className="info-section__title">About This Model</h3>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <p className="info-item__label">Architecture</p>
          <p className="info-item__value">VGG16 (Transfer Learning)</p>
        </div>
        <div className="info-item">
          <p className="info-item__label">Input Size</p>
          <p className="info-item__value">224 × 224 px</p>
        </div>
        <div className="info-item">
          <p className="info-item__label">Classes</p>
          <p className="info-item__value">Healthy · Coccidiosis</p>
        </div>
        <div className="info-item">
          <p className="info-item__label">Pretrained On</p>
          <p className="info-item__value">ImageNet</p>
        </div>
      </div>
    </div>
  );
}
