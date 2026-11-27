
import { useEffect, useMemo, useState } from 'react';
import AladinViewer from '../components/Astronomy/AladinViewer';
import AstronomyBackground from '../components/Universe/AstronomyBackground';
import AstronomyHeroVisual from '../components/Astronomy/AstronomyHeroVisual';
import DeepSpaceMap from '../components/Astronomy/DeepSpaceMap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const pipelineSteps = [
  {
    number: '01',
    title: 'Data Collection',
    subtitle: 'GAIA DR3',
    description:
      'Retrieve astronomical sources and measurements from the Gaia Data Release 3 catalogue.',
    input: 'Gaia DR3 astronomical catalogue',
    output: '50,000 initial astronomical sources',
    colour: '#7dd3fc',
    notebooks: ['02_data_acquisition.ipynb'],
  },
  {
    number: '02',
    title: 'Data Preprocessing',
    subtitle: 'CLEAN & FILTER',
    description:
      'Evaluate data quality, filter unreliable measurements and prepare astronomical data for analysis.',
    input: 'Raw Gaia catalogue measurements',
    output: 'Clean astronomical dataset',
    colour: '#a78bfa',
    notebooks: ['03_data_quality.ipynb'],
  },
  {
    number: '03',
    title: 'Feature Extraction',
    subtitle: 'MULTIMODAL FEATURES',
    description:
      'Extract astrometric, photometric and temporal characteristics to represent each astronomical object.',
    input: 'Clean astronomical measurements',
    output: 'Multimodal astronomical features',
    colour: '#67e8f9',
    notebooks: [
      '04_feature_engineering.ipynb',
      '07_light_curves.ipynb',
    ],
  },
  {
    number: '04',
    title: 'Neural Networks',
    subtitle: 'AUTOENCODERS & FUSION',
    description:
      'Develop baseline anomaly detection, train neural autoencoders and combine information from multiple data modalities.',
    input: 'Multimodal feature representations',
    output: 'Reconstruction errors and anomaly scores',
    colour: '#c4b5fd',
    notebooks: [
      '05_baseline_anomaly.ipynb',
      '06_autoencoder_architecture.ipynb',
      '08_multimodal_fusion.ipynb',
    ],
  },
  {
    number: '05',
    title: 'Candidate Ranking',
    subtitle: 'ANALYSIS & RESULTS',
    description:
      'Visualise anomaly results, inspect selected astronomical candidates and prepare model outputs for export.',
    input: 'Model anomaly scores',
    output: 'Ranked astronomical candidates',
    colour: '#f0abfc',
    notebooks: [
      '10_visualizations.ipynb',
      '11_candidate_analysis.ipynb',
      '12_model_export.ipynb',
    ],
  },
];


function formatValue(value, digits = 4) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const number = Number(value);

  return Number.isFinite(number) ? number.toFixed(digits) : String(value);
}

export default function AstronomyProject() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score-desc');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
const [notebookLoading, setNotebookLoading] = useState(false);
const [notebookError, setNotebookError] = useState('');

  useEffect(() => {
    async function loadCandidates() {
      try {
        const response = await fetch(`${API_URL}/api/candidates`);

        if (!response.ok) {
          throw new Error(`Backend returned status ${response.status}`);
        }

        const data = await response.json();
        setCandidates(data.candidates ?? []);
      } catch (err) {
        setError(
          'Could not load astronomy data. Make sure your ASTRA backend is running.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, []);

  const loadCandidateDetails = async (sourceId) => {
    try {
      setDetailsLoading(true);
      setCandidateDetails(null);

      const response = await fetch(
        `${API_URL}/api/candidates/${sourceId}`
      );

      if (!response.ok) {
        throw new Error('Could not load candidate details');
      }

      const data = await response.json();
      setCandidateDetails(data);
    } catch (error) {
      console.error('Error loading candidate details:', error);
      setCandidateDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };
const openNotebook = async (notebookName) => {
  setSelectedNotebook(null);
  setNotebookError('');
  setNotebookLoading(true);

  try {
    const response = await fetch(
      `${API_URL}/api/notebooks/${encodeURIComponent(notebookName)}`
    );

    if (!response.ok) {
      throw new Error(`Could not load ${notebookName}`);
    }

    const notebookData = await response.json();

    setSelectedNotebook({
      name: notebookName,
      data: notebookData,
    });
  } catch (error) {
    setNotebookError(error.message);
  } finally {
    setNotebookLoading(false);
  }
};
  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return candidates
      .filter((candidate) =>
        Object.values(candidate).some((value) =>
          String(value ?? '').toLowerCase().includes(query)
        )
      )
      .sort((a, b) => {
        if (sortBy === 'score-desc') {
          return Number(b.Anomaly_Score) - Number(a.Anomaly_Score);
        }

        if (sortBy === 'score-asc') {
          return Number(a.Anomaly_Score) - Number(b.Anomaly_Score);
        }

        if (sortBy === 'source-asc') {
          return String(a.source_id).localeCompare(String(b.source_id));
        }

        if (sortBy === 'source-desc') {
          return String(b.source_id).localeCompare(String(a.source_id));
        }

        return 0;
      });
  }, [candidates, search, sortBy]);

  return (
    <>
      <div className="astronomy-background-layer" aria-hidden="true">
        <AstronomyBackground />
      </div>

      <main className="project-page astronomy-project-page">

  <section className="astronomy-hero">

    <div className="astronomy-hero-content">

      <p className="project-eyebrow">
        ASTRA / DEEP SPACE OBSERVATORY
      </p>

      <span className="astronomy-hero-label">
        PROJECT 01 — MULTIMODAL AI
      </span>

      <h1>
        Discovering the
        <span> Unusual Universe.</span>
      </h1>

      <p className="project-description">
        Exploring the astronomical unknown through Gaia DR3,
        neural autoencoders and multimodal anomaly detection.
      </p>

      <div className="astronomy-hero-meta">
        <span>GAIA DR3</span>
        <span>NEURAL NETWORKS</span>
        <span>ASTRONOMY AI</span>
      </div>

    </div>

    <div className="astronomy-hero-art">
      <AstronomyHeroVisual />

      <div className="hero-orbit-label hero-label-top">
        <span>01 / SIGNAL</span>
        <strong>ANOMALY DETECTION</strong>
      </div>

      <div className="hero-orbit-label hero-label-bottom">
        <span>OBSERVATORY STATUS</span>
        <strong>SCANNING THE COSMOS</strong>
      </div>
    </div>

    <div className="astronomy-hero-scroll">
      <span>SCROLL TO EXPLORE</span>
      <span className="scroll-line" />
    </div>

  </section>

        <section className="astronomy-overview">

  <div className="overview-heading">
    <span className="project-eyebrow">MISSION BRIEFING / 001</span>
    <span className="overview-status">
      <span className="results-live-dot" />
      PROJECT OVERVIEW
    </span>
  </div>

  <div className="overview-layout">

    <div className="overview-main">
      <span className="overview-number">01</span>

      <h2>
        Looking beyond
        <span> the ordinary.</span>
      </h2>

      <p>
        The universe contains objects whose properties do not
        always follow familiar astronomical patterns. This
        project explores those unusual signals using Gaia DR3
        data and multimodal neural anomaly detection.
      </p>

      <p>
        By combining astrometric and photometric information
        with simulated temporal features, the system identifies
        candidates that stand out from the wider dataset.
      </p>
    </div>

    <div className="overview-side">

      <div className="overview-map-container">
  <DeepSpaceMap />

  <div className="map-overlay-label map-label-top">
    <span>STAR FIELD</span>
    <strong>DEEP SPACE SURVEY</strong>
  </div>

  <div className="map-overlay-label map-label-bottom">
    <span>OBJECT IDENTIFICATION</span>
    <strong>ANOMALY SCANNING</strong>
  </div>

  <div className="map-coordinate-label">
    SKY REGION / J2000
  </div>
</div>

      <div className="overview-dimensions">
        <div>
          <span>01</span>
          <strong>ASTROMETRY</strong>
          <small>Motion and distance</small>
        </div>

        <div>
          <span>02</span>
          <strong>PHOTOMETRY</strong>
          <small>Brightness and colour</small>
        </div>

        <div>
          <span>03</span>
          <strong>TEMPORAL</strong>
          <small>Simulated variability</small>
        </div>
      </div>

    </div>

  </div>

  <div className="overview-footer">
    <span>OBSERVATION SYSTEM</span>
    <span>GAIA DR3 · MULTIMODAL ANALYSIS · NEURAL NETWORKS</span>
  </div>

</section>

        <section className="astronomy-systems">
  <div className="systems-heading">
    <div>
      <span className="project-eyebrow">MISSION SYSTEMS / 002</span>
      <h2>Inside the <span>observatory.</span></h2>
      <p>
        The tools and technologies powering the multimodal
        anomaly detection pipeline.
      </p>
    </div>

    <span className="systems-index">05 CORE COMPONENTS</span>
  </div>

  <div className="systems-grid">
    <div className="system-card">
      <span className="system-number">01</span>
      <span className="system-symbol">⌘</span>
      <h3>Python</h3>
      <p>Data processing and pipeline orchestration.</p>
      <span className="system-category">PROGRAMMING</span>
    </div>

    <div className="system-card">
      <span className="system-number">02</span>
      <span className="system-symbol">◈</span>
      <h3>PyTorch</h3>
      <p>Neural autoencoders and anomaly scoring.</p>
      <span className="system-category">DEEP LEARNING</span>
    </div>

    <div className="system-card">
      <span className="system-number">03</span>
      <span className="system-symbol">✳</span>
      <h3>Astropy</h3>
      <p>Astronomical coordinates and scientific data analysis.</p>
      <span className="system-category">ASTRONOMY</span>
    </div>

    <div className="system-card">
      <span className="system-number">04</span>
      <span className="system-symbol">◎</span>
      <h3>Gaia DR3</h3>
      <p>Astrometric and photometric catalogue data.</p>
      <span className="system-category">DATA SOURCE</span>
    </div>

    <div className="system-card">
      <span className="system-number">05</span>
      <span className="system-symbol">⌬</span>
      <h3>Neural Networks</h3>
      <p>Multimodal representation learning and anomaly detection.</p>
      <span className="system-category">AI ARCHITECTURE</span>
    </div>
  </div>
</section>
<section className="astronomy-pipeline">
  <div className="pipeline-heading">
    <div>
      <span className="project-eyebrow">SYSTEM ARCHITECTURE / 003</span>
      <h2>From raw data to <span>discovery.</span></h2>
      <p>Explore how astronomical data moves through the anomaly detection pipeline.</p>
    </div>

    <span className="pipeline-index">05 PROCESSING STAGES</span>
  </div>

  <div className="pipeline-interface">
    <div className="pipeline-steps">
      {pipelineSteps.map((step, index) => (
        <button
          key={step.number}
          className={`pipeline-step ${
            activePipelineStep === index ? 'active' : ''
          }`}
          onClick={() => setActivePipelineStep(index)}
        >
          <span className="pipeline-step-number">{step.number}</span>

          <span className="pipeline-step-info">
            <strong>{step.title}</strong>
            <small>{step.subtitle}</small>
          </span>

          <span className="pipeline-step-arrow">↗</span>
        </button>
      ))}
    </div>

    <div className="pipeline-detail">
      <div className="pipeline-detail-top">
        <span>STAGE {pipelineSteps[activePipelineStep].number}</span>
        <span>{pipelineSteps[activePipelineStep].subtitle}</span>
      </div>

      <div
        className="pipeline-detail-icon"
        style={{ color: pipelineSteps[activePipelineStep].colour }}
      >
        {['◈', '⌁', '◉', '⌘', '◎'][activePipelineStep]}
      </div>

      <h3>{pipelineSteps[activePipelineStep].title}</h3>

      <p>{pipelineSteps[activePipelineStep].description}</p>

      <div className="pipeline-data-flow">
        <div>
          <small>INPUT</small>
          <strong>{pipelineSteps[activePipelineStep].input}</strong>
        </div>

        <span className="pipeline-flow-arrow">↓</span>

        <div>
          <small>OUTPUT</small>
          <strong>{pipelineSteps[activePipelineStep].output}</strong>
        </div>
      </div>
      
<div className="pipeline-notebooks">
  <div className="pipeline-notebooks-heading">
    <span>IMPLEMENTATION FILES</span>
    <small>
      {pipelineSteps[activePipelineStep].notebooks.length} NOTEBOOK(S)
    </small>
  </div>

  <div className="pipeline-notebook-list">
  {pipelineSteps[activePipelineStep].notebooks.map((notebook) => (
    <button
      className="pipeline-notebook"
      key={notebook}
      type="button"
      onClick={() => openNotebook(notebook)}
    >
      <span className="pipeline-notebook-icon">▤</span>
      <span>{notebook}</span>
      <span className="pipeline-notebook-type">OPEN ↗</span>
    </button>
  ))}
</div>
</div>

      <div className="pipeline-navigation">
        <button
          onClick={() =>
            setActivePipelineStep((current) => Math.max(0, current - 1))
          }
          disabled={activePipelineStep === 0}
        >
          ← Previous
        </button>

        <span>
          {activePipelineStep + 1} / {pipelineSteps.length}
        </span>

        <button
          onClick={() =>
            setActivePipelineStep((current) =>
              Math.min(pipelineSteps.length - 1, current + 1)
            )
          }
          disabled={activePipelineStep === pipelineSteps.length - 1}
        >
          Next stage →
        </button>
      </div>
    </div>
  </div>
</section>
        <section className="astronomy-candidate-explorer">
  <div className="candidate-explorer-heading">
    <div>
      <span className="project-eyebrow">
        OBSERVATORY TERMINAL / 003
      </span>

      <h2>
        Anomaly <span>Candidate Explorer.</span>
      </h2>

      <p>
        Inspect unusual astronomical objects identified by the
        multimodal detection pipeline. Select a source to open
        its detailed astronomical profile.
      </p>
    </div>

    <div className="candidate-terminal-status">
      <span className="results-live-dot" />
      <span>GAIA DR3 / LIVE CATALOGUE</span>
    </div>
  </div>

          <div className="candidate-stats">
            <div className="candidate-stat-card">
              <div className="stat-topline">
                <span className="stat-indicator" />
                <span>CATALOGUE STATUS</span>
              </div>
              <strong>
                {loading ? '...' : error ? 'OFFLINE' : 'ONLINE'}
              </strong>
              <p>Gaia DR3 candidate catalogue</p>
            </div>

            <div className="candidate-stat-card">
              <div className="stat-topline">
                <span className="stat-icon">✦</span>
                <span>TOTAL CANDIDATES</span>
              </div>
              <strong>{loading ? '—' : candidates.length}</strong>
              <p>Available catalogue records</p>
            </div>

            <div className="candidate-stat-card">
              <div className="stat-topline">
                <span className="stat-icon">⌕</span>
                <span>SEARCH RESULTS</span>
              </div>
              <strong>
                {loading ? '—' : filteredCandidates.length}
              </strong>
              <p>Matching candidates</p>
            </div>
          </div>

          {loading && <p>Connecting to the astronomy backend…</p>}

          {error && (
            <p role="alert" className="candidate-error">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="candidate-search-container">
                <label
                  className="candidate-search-box"
                  htmlFor="candidate-search"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="21"
                    height="21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                  </svg>

                  <input
                    id="candidate-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search Gaia source ID, score or coordinates..."
                  />

                  {search && (
                    <button
                      type="button"
                      className="candidate-search-clear"
                      onClick={() => setSearch('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </label>

                <span className="candidate-search-shortcut">
                  GAIA DR3 / CATALOGUE SEARCH
                </span>
              </div>

              <div className="candidate-sort-container">
                <label htmlFor="candidate-sort">SORT CATALOGUE</label>

                <select
                  id="candidate-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="score-desc">Highest anomaly score</option>
                  <option value="score-asc">Lowest anomaly score</option>
                  <option value="source-asc">Source ID — A to Z</option>
                  <option value="source-desc">Source ID — Z to A</option>
                </select>
              </div>

              <div className="candidate-results-status">
                <span className="results-live-dot" />
                <span>
                  DISPLAYING <strong>{filteredCandidates.length}</strong>
                  {' '}OF <strong>{candidates.length}</strong> OBJECTS
                </span>
                <span className="results-catalogue-label">GAIA DR3</span>
              </div>

              {filteredCandidates.length === 0 ? (
                <p>No candidates match your search.</p>
              ) : (
                <div className="candidate-table-wrapper">
                  <table className="candidate-table">
                    <thead>
                      <tr>
                        <th>Source ID</th>
                        <th>Anomaly score</th>
                        <th>Right ascension</th>
                        <th>Declination</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCandidates.map((candidate, index) => {
                        const sourceId =
                          candidate.source_id ??
                          candidate.sourceId ??
                          `candidate-${index}`;

                        const score =
                          candidate.Anomaly_Score ??
                          candidate.score_All_Fused ??
                          candidate.anomaly_score ??
                          candidate.score;

                        const ra = candidate.ra ?? candidate.ra_deg;
                        const dec = candidate.dec ?? candidate.dec_deg;

                        const isSelected =
                          selectedCandidate === candidate;

                        return (
                          <>
                            <tr
                              key={`${sourceId}-${index}`}
                              className={
                                isSelected ? 'selected-candidate' : ''
                              }
                            >
                              <td>
                                <button
                                  type="button"
                                  className="candidate-select-button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedCandidate(null);
                                      setCandidateDetails(null);
                                    } else {
                                      setSelectedCandidate(candidate);
                                      loadCandidateDetails(candidate.source_id);
                                    }
                                  }}
                                  aria-expanded={isSelected}
                                >
                                  {sourceId}
                                  <span className="expand-indicator">
                                    {isSelected ? ' −' : ' +'}
                                  </span>
                                </button>
                              </td>

                              <td>
                                <div className="anomaly-score-cell">
                                  <strong>{formatValue(score, 3)}</strong>
                                  {score !== undefined &&
                                    score !== null &&
                                    score !== '' &&
                                    Number.isFinite(Number(score)) && (
                                      <div className="anomaly-score-track">
                                        <div
                                          className="anomaly-score-fill"
                                          style={{
                                            width: `${Math.max(
                                              0,
                                              Math.min(
                                                100,
                                                Number(score) * 100
                                              )
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                    )}
                                </div>
                              </td>

                              <td>{ra ?? '—'}</td>
                              <td>{dec ?? '—'}</td>
                            </tr>

                            {isSelected && (
                              <tr className="candidate-expanded-row">
                                <td colSpan={4}>
                                  <div className="candidate-inline-panel">
                                    {detailsLoading && (
                                      <p className="profile-loading">
                                        Loading astronomical object profile...
                                      </p>
                                    )}

                                    {!detailsLoading && candidateDetails && (
                                      <div className="candidate-profile">
                                        <div className="candidate-inline-header">
                                          <div>
                                            <span className="project-eyebrow">
                                              GAIA DR3 · OBJECT PROFILE
                                            </span>
                                            <h3>
                                              {candidateDetails.identity.source_id}
                                            </h3>
                                          </div>
                                          <span className="expand-indicator">
                                            ● PROFILE LOADED
                                          </span>
                                        </div>

                                        <section className="profile-section">
                                          <h4>01 — Object identity</h4>
                                          <div className="candidate-detail-grid">
                                            <ProfileItem label="Gaia source ID" value={candidateDetails.identity.source_id} />
                                            <ProfileItem label="Right ascension" value={candidateDetails.identity.ra} />
                                            <ProfileItem label="Declination" value={candidateDetails.identity.dec} />
                                            <ProfileItem label="Sky coordinates" value={candidateDetails.identity.coordinates} />
                                          </div>
                                        </section>

                                        <section className="profile-section">
                                          <h4>02 — Anomaly detection</h4>
                                          <div className="candidate-detail-grid">
                                            <ProfileItem label="Final anomaly score" value={candidateDetails.anomaly.final_score} />
                                            <ProfileItem label="Astrometry score" value={candidateDetails.anomaly.astrometry_score} />
                                            <ProfileItem label="Photometry score" value={candidateDetails.anomaly.photometry_score} />
                                            <ProfileItem label="Temporal score" value={candidateDetails.anomaly.temporal_score} />
                                            <ProfileItem label="Astro-photometry score" value={candidateDetails.anomaly.astro_photo_score} />
                                            <ProfileItem label="Multimodal fused score" value={candidateDetails.anomaly.fused_score} />
                                          </div>
                                        </section>

                                        <section className="profile-section">
                                          <h4>03 — Astrometric properties</h4>
                                          <div className="candidate-detail-grid">
                                            <ProfileItem label="Proper motion" value={candidateDetails.astrometry.proper_motion_total} />
                                            <ProfileItem label="Tangential velocity" value={candidateDetails.astrometry.tangential_velocity} />
                                            <ProfileItem label="Parallax signal-to-noise" value={candidateDetails.astrometry.parallax_snr} />
                                          </div>
                                        </section>

                                        <section className="profile-section">
                                          <h4>04 — Photometric properties</h4>
                                          <div className="candidate-detail-grid">
                                            <ProfileItem label="Absolute G magnitude" value={candidateDetails.photometry.absolute_magnitude_g} />
                                            <ProfileItem label="BP − RP colour" value={candidateDetails.photometry.bp_rp} />
                                          </div>
                                        </section>

                                        <section className="profile-section">
                                          <h4>05 — Temporal characteristics</h4>
                                          <p className="profile-note">
                                            {candidateDetails.temporal.data_type} — these features are simulated,
                                            not actual Gaia time-series observations.
                                          </p>
                                          <div className="candidate-detail-grid">
                                            <ProfileItem label="Light curve mean" value={candidateDetails.temporal.lc_mean} />
                                            <ProfileItem label="Standard deviation" value={candidateDetails.temporal.lc_std} />
                                            <ProfileItem label="Amplitude" value={candidateDetails.temporal.lc_amplitude} />
                                            <ProfileItem label="Skewness" value={candidateDetails.temporal.lc_skew} />
                                            <ProfileItem label="Kurtosis" value={candidateDetails.temporal.lc_kurtosis} />
                                            <ProfileItem label="Period" value={candidateDetails.temporal.lc_period} />
                                            <ProfileItem label="Maximum power" value={candidateDetails.temporal.lc_max_power} />
                                          </div>
                                        </section>

                                        <section className="profile-section">
                                          <h4>06 — SIMBAD cross-match</h4>
                                          <div className="candidate-detail-grid">
                                            <ProfileItem label="SIMBAD object ID" value={candidateDetails.simbad.object_id} />
                                            <ProfileItem label="Object type" value={candidateDetails.simbad.object_type} />
                                            <ProfileItem label="Known object" value={candidateDetails.simbad.known_object} />
                                            <ProfileItem label="Match status" value={candidateDetails.simbad.match_status} />
                                          </div>
                                          <p className="profile-note">
                                            A missing SIMBAD match within 2 arcseconds does not establish
                                            that an object is previously undiscovered.
                                          </p>
                                        </section>

                                        <section className="profile-section">
                                          <h4>07 — Dataset availability</h4>
                                          <div className="candidate-detail-grid">
                                            <ProfileItem label="Validated dataset" value={candidateDetails.dataset_records.validated ? 'Available' : 'Unavailable'} />
                                            <ProfileItem label="Multimodal dataset" value={candidateDetails.dataset_records.multimodal ? 'Available' : 'Unavailable'} />
                                            <ProfileItem label="Feature matrix" value={candidateDetails.dataset_records.feature_matrix ? 'Available' : 'Unavailable'} />
                                          </div>
                                        </section>

                                        <section className="profile-section">
                                          <h4>08 — Explore this object in the sky</h4>
                                          <AladinViewer
                                            ra={candidateDetails.identity.ra}
                                            dec={candidateDetails.identity.dec}
                                            sourceId={candidateDetails.identity.source_id}
                                          />
                                        </section>
                                      </div>
                                    )}

                                    {!detailsLoading && !candidateDetails && (
                                      <p className="profile-error">
                                        Could not load this object's profile. Check the backend terminal.
                                      </p>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>

        <button
  className="back-button orbital-back-button"
  onClick={() => window.history.back()}
  aria-label="Return to the Universe"
>
  <span className="back-orbit">
    <span className="back-orbit-ring" />
    <span className="back-arrow">↗</span>
  </span>

  <span className="back-button-text">
    <small>LEAVE OBSERVATORY</small>
    <strong>Return to Universe</strong>
  </span>
</button>
      </main>
      {(notebookLoading || notebookError || selectedNotebook) && (
  <div className="notebook-viewer-overlay">
    <div className="notebook-viewer">
      <div className="notebook-viewer-header">
        <div>
          <span className="project-eyebrow">
            ASTRA / NOTEBOOK VIEWER
          </span>
          <h2>
            {selectedNotebook?.name || 'Loading notebook...'}
          </h2>
        </div>

        <button
          type="button"
          className="notebook-viewer-close"
          onClick={() => {
            setSelectedNotebook(null);
            setNotebookError('');
            setNotebookLoading(false);
          }}
        >
          ✕
        </button>
      </div>

      {notebookLoading && (
        <p className="notebook-viewer-message">
          Loading notebook...
        </p>
      )}

      {notebookError && (
        <p className="notebook-viewer-error">
          {notebookError}
        </p>
      )}

      {selectedNotebook && (
        <div className="notebook-content">
          {selectedNotebook.data.cells.map((cell, index) => (
            <div className="notebook-cell" key={index}>
              {cell.cell_type === 'markdown' ? (
  <div className="notebook-markdown">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {Array.isArray(cell.source)
        ? cell.source.join('')
        : cell.source}
    </ReactMarkdown>
  </div>
) : (
                <>
                  <div className="notebook-cell-label">
                    In [{cell.execution_count ?? ' '}]:
                  </div>

                  <pre className="notebook-code">
                    {Array.isArray(cell.source)
                      ? cell.source.join('')
                      : cell.source}
                  </pre>
                  {cell.outputs?.map((output, outputIndex) => (
  <div className="notebook-output" key={outputIndex}>
    {output.output_type === 'stream' && (
      <pre className="notebook-output-text">
        {Array.isArray(output.text)
          ? output.text.join('')
          : output.text}
      </pre>
    )}

    {output.output_type === 'execute_result' &&
      output.data?.['text/plain'] && (
        <pre className="notebook-output-text">
          {Array.isArray(output.data['text/plain'])
            ? output.data['text/plain'].join('')
            : output.data['text/plain']}
        </pre>
      )}

    {output.output_type === 'display_data' &&
      output.data?.['text/plain'] && (
        <pre className="notebook-output-text">
          {Array.isArray(output.data['text/plain'])
            ? output.data['text/plain'].join('')
            : output.data['text/plain']}
        </pre>
      )}
      {/* PNG charts and images */}
{(output.output_type === 'display_data' ||
  output.output_type === 'execute_result') &&
  output.data?.['image/png'] && (
    <img
      className="notebook-output-image"
      src={`data:image/png;base64,${Array.isArray(output.data['image/png'])
        ? output.data['image/png'].join('')
        : output.data['image/png']}`}
      alt="Notebook chart or visualisation"
      loading="lazy"
    />
  )}

{/* JPEG charts and images */}
{(output.output_type === 'display_data' ||
  output.output_type === 'execute_result') &&
  output.data?.['image/jpeg'] && (
    <img
      className="notebook-output-image"
      src={`data:image/jpeg;base64,${Array.isArray(output.data['image/jpeg'])
        ? output.data['image/jpeg'].join('')
        : output.data['image/jpeg']}`}
      alt="Notebook image"
      loading="lazy"
    />
  )}

    {output.output_type === 'error' && (
      <pre className="notebook-output-error">
        {output.ename}: {output.evalue}
      </pre>
    )}
  </div>
))}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
    </>
  );
}

function ProfileItem({ label, value }) {
  const displayValue =
    value === null || value === undefined || value === ''
      ? 'Not available'
      : typeof value === 'number'
        ? value.toLocaleString('en-US', {
            maximumFractionDigits: 6,
          })
        : String(value);

  return (
    <div className="candidate-detail-item">
      <span>{label}</span>
      <strong>{displayValue}</strong>
    
    </div>
  );

}
