const DISEASE_INFO = {
  Healthy: {
    title: 'No Disease Detected',
    description:
      'The fecal sample appears normal. No signs of Coccidiosis parasites were identified. Continue regular health monitoring and maintain good sanitation practices.',
  },
  Coccidiosis: {
    title: 'Coccidiosis Detected',
    description:
      'The sample shows signs consistent with Coccidiosis — a parasitic disease caused by Eimeria protozoa. Immediate veterinary consultation is recommended. Treatment typically involves anticoccidial medications and improved hygiene.',
  },
};

export default function ResultCard({ prediction, confidence }) {
  const isHealthy = prediction === 'Healthy';
  const variant = isHealthy ? 'healthy' : 'disease';
  const info = DISEASE_INFO[prediction];

  return (
    <div className={`result-card glass-card ${variant}`} id="result-card">
      <div className="result__header">
        <div className={`result__icon-wrapper ${variant}`}>
          {isHealthy ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>
        <div className="result__label-group">
          <p className="result__label-tag">Diagnosis Result</p>
          <h2 className={`result__label ${variant}`}>{prediction}</h2>
        </div>
      </div>

      <div className="confidence">
        <div className="confidence__header">
          <span className="confidence__text">Model Confidence</span>
          <span className={`confidence__value ${variant}`}>{confidence}%</span>
        </div>
        <div className="confidence__bar">
          <div
            className={`confidence__fill ${variant}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="result__info">
        <p className="result__info-title">{info.title}</p>
        <p className="result__info-text">{info.description}</p>
      </div>
    </div>
  );
}
