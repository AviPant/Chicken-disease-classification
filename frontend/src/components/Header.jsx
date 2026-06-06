export default function Header() {
  return (
    <header className="header">
      <div className="header__badge">
        <span className="header__badge-dot"></span>
        AI-Powered Diagnostics
      </div>
      <h1 className="header__title">
        Chicken Disease<br />Classification
      </h1>
      <p className="header__subtitle">
        Upload a chicken fecal image to instantly detect Coccidiosis
        using our deep learning model powered by VGG16.
      </p>
    </header>
  );
}
