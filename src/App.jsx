
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SpaceScene from './components/Universe/SpaceScene';
import AstronomyProject from './pages/AstronomyProject';
import GalaxiesProject from './pages/GalaxiesProject';
import './index.css';


function UniversePage() {
  return (
    <main className="universe">
      <SpaceScene />

      <div className="universe-interface">

        {/* TOP BAR */}
        <header className="universe-header">
          <Link to="/" className="astra-brand">
            <span className="astra-brand-symbol">✳</span>
            <strong>ASTRA</strong>
          </Link>

          <span className="theme-icon">☼</span>
        </header>

        {/* HERO TEXT */}
        <section className="universe-intro" id="explore">
          <h1>
            Beyond the
            <br />
            known <span>universe</span>
          </h1>

          <p>
            Explore celestial mysteries, uncover
            <br />
            hidden patterns, and venture further into space.
          </p>

          <a href="#missions" className="explore-button">
            <span className="explore-icon">♧</span>
            Click to Explore
            <span className="explore-arrow">›</span>
          </a>
        </section>

        {/* ACTIVE MISSIONS */}
        <section className="universe-bottom" id="missions">
          <div className="mission-panel">

            <div className="mission-panel-header">
              <h2>
                <span>✦</span> Active Missions
              </h2>
              <Link to="/galaxies">View All <span>→</span></Link>
            </div>

            <div className="mission-panel-content">
              <div className="mission-thumbnail">✧</div>

              <div className="mission-description">
                <strong>Galaxy Anomaly Detection</strong>
                <small>Discover unusual galaxies in deep space</small>
              </div>

              <div className="mission-progress">
                <span className="mission-status">● In Progress</span>
                <div className="progress-track">
                  <div className="progress-fill" />
                </div>
              </div>

              <span className="progress-percentage">78%</span>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UniversePage />} />
        <Route path="/astronomy" element={<AstronomyProject />} />
        <Route path="/galaxies" element={<GalaxiesProject />} />
      </Routes>
    </BrowserRouter>
  );
}
