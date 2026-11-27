
import { useEffect, useState } from 'react';
import GalaxyHeroVisual from '../components/Astronomy/GalaxyHeroVisual';
import AstronomyBackground from '../components/Universe/AstronomyBackground';
import GalaxyImageViewer from '../components/Astronomy/GalaxyImageViewer';
import './GalaxiesProject.css';

const pipelineSteps = [
  {
    number: '01',
    title: 'Galaxy Matching',
    subtitle: 'GALAXY ZOO × DESI',
    description:
      'Cross-match Galaxy Zoo morphology records with DESI DR1 spectroscopic observations to create a unified galaxy catalogue.',
    input: 'Galaxy Zoo DESI Friendly Morphology Catalogue',
    output: '30,000 matched galaxies',
  },
  {
    number: '02',
    title: 'Image Processing',
    subtitle: 'LEGACY SURVEYS DR8',
    description:
      'Retrieve and prepare optical galaxy images using the g, r and z photometric bands.',
    input: 'Legacy Surveys grz image cutouts',
    output: '3-channel 128 × 128 galaxy images',
  },
  {
    number: '03',
    title: 'Spectral Processing',
    subtitle: 'DESI DR1 SPECTRA',
    description:
      'Retrieve DESI spectra and prepare wavelength, flux and inverse-variance information for model training.',
    input: 'DESI DR1 spectroscopic observations',
    output: '7,781-bin spectral representations',
  },
  {
    number: '04',
    title: 'Multimodal Learning',
    subtitle: 'THREE AUTOENCODERS',
    description:
      'Train separate image and spectral autoencoders, then combine their learned representations through a multimodal autoencoder.',
    input: 'Image and spectral representations',
    output: '32-dimensional joint latent space',
  },
  {
    number: '05',
    title: 'Anomaly Detection',
    subtitle: 'ISOLATION FOREST',
    description:
      'Evaluate reconstruction errors and joint latent representations to rank unusual galaxy candidates.',
    input: 'Learned latent representations',
    output: 'Ranked anomaly candidates',
  },
];
<GalaxyImageViewer />
const figures = [
  {
    title: 'Multimodal Anomaly Candidates',
    description:
      'A visual inspection gallery of highly ranked candidates identified using the combined representation.',
    image: '/images/galaxies/top_multimodal_anomalies_gallery.png',
    number: '01',
  },
  {
    title: 'Morphological Anomalies',
    description:
      'Galaxy images with unusual visual structures highlighted by the image-based model.',
    image: '/images/galaxies/top_image_anomalies_gallery.png',
    number: '02',
  },
  {
    title: 'Joint Latent Space',
    description:
      'A two-dimensional projection of the learned multimodal galaxy representations.',
    image: '/images/galaxies/joint_latent_space_projection.png',
    number: '03',
  },
  {
    title: 'Model Reconstructions',
    description:
      'A comparison of original inputs and reconstructed outputs from the multimodal learning pipeline.',
    image: '/images/galaxies/multimodal_reconstructions_comparison.png',
    number: '04',
  },
  {
    title: 'Anomaly Score Relationships',
    description:
      'A comparison of anomaly rankings across image-based, spectral and multimodal approaches.',
    image: '/images/galaxies/anomaly_score_correlations.png',
    number: '05',
  },
];

export default function GalaxiesProject() {
  const [activeStep, setActiveStep] = useState(0);
const [selectedFigure, setSelectedFigure] = useState(null);
useEffect(() => {
  if (!selectedFigure) return;

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      setSelectedFigure(null);
    }
  };

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  window.addEventListener('keydown', handleEscape);

  return () => {
    window.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = previousOverflow;
  };
}, [selectedFigure]);
  return (
    <main className="project-page galaxy-project-page">
  <div className="galaxy-background">
    <AstronomyBackground />
  </div>

      {/* HERO */}
      <section className="galaxy-hero">
        <div className="galaxy-hero-content">
          <p className="project-eyebrow">
            ASTRA / DEEP SPACE OBSERVATORY
          </p>

          <span className="galaxy-hero-label">
            PROJECT 02 — MULTIMODAL GALAXY AI
          </span>

          <h1>
            Discovering
            <span> the unusual.</span>
          </h1>

          <p className="galaxy-hero-description">
            Exploring the hidden diversity of galaxies through
            optical morphology, spectroscopic information and
            multimodal deep learning.
          </p>

          <div className="galaxy-hero-meta">
            <span>GALAXY ZOO</span>
            <span>LEGACY SURVEYS</span>
            <span>DESI DR1</span>
          </div>
        </div>

        <div className="galaxy-hero-art">
          <GalaxyHeroVisual />

          <div className="galaxy-orbit-label galaxy-label-top">
            <span>02 / SIGNAL</span>
            <strong>GALAXY DISCOVERY</strong>
          </div>

          <div className="galaxy-orbit-label galaxy-label-bottom">
            <span>OBSERVATION STATUS</span>
            <strong>30,000 GALAXIES ANALYSED</strong>
          </div>
        </div>

        <div className="galaxy-hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <span />
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="galaxy-overview">
        <div className="galaxy-section-heading">
          <span className="project-eyebrow">MISSION BRIEFING / 001</span>
          <span className="galaxy-section-status">
            <span className="galaxy-live-dot" />
            PROJECT OVERVIEW
          </span>
        </div>

        <div className="galaxy-overview-layout">
          <div className="galaxy-overview-main">
            <span className="galaxy-overview-number">01</span>

            <h2>
              Two perspectives.
              <span> One universe.</span>
            </h2>

            <p>
              Galaxies reveal their properties through both their
              visible structures and the light they emit. Images
              capture morphology, while spectra reveal information
              about their physical and chemical characteristics.
            </p>

            <p>
              This project combines these complementary sources
              using deep learning to identify galaxies that differ
              from the patterns learned across a large astronomical
              dataset.
            </p>
          </div>

          <div className="galaxy-overview-side">
            <div className="galaxy-modality-card">
              <span>MODALITY 01</span>
              <strong>OPTICAL MORPHOLOGY</strong>
              <p>Galaxy structures, shapes and visual patterns.</p>
              <div className="galaxy-modality-visual">
                <span>IMAGE ENCODER</span>
                <strong>64D</strong>
              </div>
            </div>

            <div className="galaxy-modality-card">
              <span>MODALITY 02</span>
              <strong>SPECTRAL INFORMATION</strong>
              <p>Wavelength-dependent astronomical signals.</p>
              <div className="galaxy-modality-visual spectral">
                <span>SPECTRAL ENCODER</span>
                <strong>64D</strong>
              </div>
            </div>

            <div className="galaxy-fusion-card">
              <span>JOINT REPRESENTATION</span>
              <strong>32D</strong>
              <p>Multimodal latent space</p>
            </div>
          </div>
        </div>

        <div className="galaxy-overview-footer">
          <span>OBSERVATION SYSTEM</span>
          <span>30K GALAXIES · IMAGE + SPECTRA · DEEP LEARNING</span>
        </div>
      </section>

      {/* DATASET */}
      <section className="galaxy-dataset">
        <div className="galaxy-section-heading">
          <div>
            <span className="project-eyebrow">DATA ACQUISITION / 002</span>
            <h2>
              A universe of
              <span> 30,000 galaxies.</span>
            </h2>
            <p>
              Three astronomical data sources brought together
              into one multimodal dataset.
            </p>
          </div>
          <span className="galaxy-section-index">DATASET PROFILE</span>
        </div>

        <div className="galaxy-stat-grid">
          <div className="galaxy-stat-card">
            <span>01 / SAMPLE SIZE</span>
            <strong>30,000</strong>
            <p>Cross-matched galaxies</p>
          </div>

          <div className="galaxy-stat-card">
            <span>02 / IMAGE DATA</span>
            <strong>128 × 128</strong>
            <p>Three-channel grz cutouts</p>
          </div>

          <div className="galaxy-stat-card">
            <span>03 / SPECTRAL DATA</span>
            <strong>7,781</strong>
            <p>Wavelength bins per spectrum</p>
          </div>

          <div className="galaxy-stat-card">
            <span>04 / REPRESENTATION</span>
            <strong>32D</strong>
            <p>Joint latent space</p>
          </div>
        </div>

        <div className="galaxy-source-grid">
          <div className="galaxy-source-card">
            <span>DATA SOURCE / 01</span>
            <h3>Galaxy Zoo</h3>
            <p>
              Galaxy morphology catalogue providing classifications
              and object information for cross-matching.
            </p>
            <small>MORPHOLOGY CATALOGUE</small>
          </div>

          <div className="galaxy-source-card">
            <span>DATA SOURCE / 02</span>
            <h3>Legacy Surveys DR8</h3>
            <p>
              Optical grz-band image cutouts used to represent
              the visual morphology of each galaxy.
            </p>
            <small>OPTICAL IMAGING</small>
          </div>

          <div className="galaxy-source-card">
            <span>DATA SOURCE / 03</span>
            <h3>DESI DR1</h3>
            <p>
              Spectroscopic observations providing wavelength
              and flux information for the matched galaxies.
            </p>
            <small>SPECTROSCOPY</small>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="galaxy-pipeline">
        <div className="galaxy-section-heading">
          <div>
            <span className="project-eyebrow">SYSTEM ARCHITECTURE / 003</span>
            <h2>
              From observation
              <span> to discovery.</span>
            </h2>
            <p>
              Explore the stages of the multimodal galaxy
              anomaly detection pipeline.
            </p>
          </div>

          <span className="galaxy-section-index">05 PROCESSING STAGES</span>
        </div>

        <div className="galaxy-pipeline-interface">
          <div className="galaxy-pipeline-steps">
            {pipelineSteps.map((step, index) => (
              <button
                key={step.number}
                className={`galaxy-pipeline-step ${
                  activeStep === index ? 'active' : ''
                }`}
                onClick={() => setActiveStep(index)}
              >
                <span>{step.number}</span>
                <div>
                  <strong>{step.title}</strong>
                  <small>{step.subtitle}</small>
                </div>
                <span className="galaxy-step-arrow">↗</span>
              </button>
            ))}
          </div>

          <div className="galaxy-pipeline-detail">
            <div className="galaxy-detail-top">
              <span>STAGE {pipelineSteps[activeStep].number}</span>
              <span>{pipelineSteps[activeStep].subtitle}</span>
            </div>

            <span className="galaxy-detail-symbol">
              {['◉', '▧', '⌁', '⌘', '◎'][activeStep]}
            </span>

            <h3>{pipelineSteps[activeStep].title}</h3>
            <p>{pipelineSteps[activeStep].description}</p>

            <div className="galaxy-data-flow">
              <div>
                <small>INPUT</small>
                <strong>{pipelineSteps[activeStep].input}</strong>
              </div>

              <span>↓</span>

              <div>
                <small>OUTPUT</small>
                <strong>{pipelineSteps[activeStep].output}</strong>
              </div>
            </div>

            <div className="galaxy-pipeline-navigation">
              <button
                onClick={() =>
                  setActiveStep((current) => Math.max(0, current - 1))
                }
                disabled={activeStep === 0}
              >
                ← Previous
              </button>

              <span>{activeStep + 1} / {pipelineSteps.length}</span>

              <button
                onClick={() =>
                  setActiveStep((current) =>
                    Math.min(pipelineSteps.length - 1, current + 1)
                  )
                }
                disabled={activeStep === pipelineSteps.length - 1}
              >
                Next stage →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="galaxy-results">
        <div className="galaxy-section-heading">
          <div>
            <span className="project-eyebrow">MODEL EVALUATION / 004</span>
            <h2>
              Different signals.
              <span> Different discoveries.</span>
            </h2>
            <p>
              Comparing anomaly rankings reveals how image and
              spectral information capture different aspects
              of unusual galaxies.
            </p>
          </div>
        </div>

        <div className="galaxy-result-highlight">
          <span>IMAGE–SPECTRUM RANK CORRELATION</span>
          <strong>−0.0050</strong>
          <p>
            Spearman rank correlation between image-based and
            spectral anomaly rankings across the evaluated sample.
          </p>
          <small>
            The near-zero correlation indicates that the two
            modalities produce substantially different rankings.
          </small>
        </div>

        <div className="galaxy-result-grid">
          <div>
            <span>01 / IMAGE MODEL</span>
            <strong>0.192659</strong>
            <p>Image autoencoder validation MSE</p>
          </div>

          <div>
            <span>02 / SPECTRAL MODEL</span>
            <strong>12.603201</strong>
            <p>Spectral autoencoder masked validation MSE</p>
          </div>

          <div>
            <span>03 / MULTIMODAL MODEL</span>
            <strong>0.4418</strong>
            <p>Multimodal autoencoder validation loss</p>
          </div>
        </div>

        <p className="galaxy-results-note">
          Reconstruction losses are calculated on different
          input representations and should not be compared
          directly as equivalent performance measures.
        </p>
      </section>

      {/* FIGURES */}
      <GalaxyImageViewer />
      <section className="galaxy-gallery">
        <div className="galaxy-section-heading">
          <div>
            <span className="project-eyebrow">OBSERVATION ARCHIVE / 005</span>
            <h2>
              Inside the
              <span> discovery archive.</span>
            </h2>
            <p>
              Visual outputs from the completed galaxy
              anomaly detection pipeline.
            </p>
          </div>

          <span className="galaxy-section-index">05 VISUALISATIONS</span>
        </div>

        <div className="galaxy-figure-grid">
          {figures.map((figure) => (
            <article className="galaxy-figure-card" key={figure.number}>
              <div
  className="galaxy-figure-image"
  onClick={() => setSelectedFigure(figure)}
  role="button"
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedFigure(figure);
    }
  }}
>
  <img
    src={figure.image}
    alt={figure.title}
    loading="lazy"
  />
  <span>{figure.number} / VIEW FIGURE ↗</span>
</div>

              <div className="galaxy-figure-caption">
                <h3>{figure.title}</h3>
                <p>{figure.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="galaxy-technologies">
        <div className="galaxy-section-heading">
          <div>
            <span className="project-eyebrow">MISSION SYSTEMS / 006</span>
            <h2>
              The technology
              <span> behind the mission.</span>
            </h2>
          </div>
        </div>

        <div className="galaxy-tech-grid">
          {[
            ['01', 'Python', 'Scientific programming'],
            ['02', 'PyTorch', 'Deep learning framework'],
            ['03', 'Astropy', 'Astronomical data analysis'],
            ['04', 'SPARCL', 'Spectral data access'],
            ['05', 'scikit-learn', 'Isolation Forest'],
            ['06', 'NumPy', 'Numerical computation'],
          ].map(([number, name, description]) => (
            <div className="galaxy-tech-card" key={number}>
              <span>{number}</span>
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
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
      {selectedFigure && (
        <div
          className="galaxy-lightbox"
          onClick={() => setSelectedFigure(null)}
          role="presentation"
        >
          <button
            className="galaxy-lightbox-close"
            onClick={() => setSelectedFigure(null)}
            aria-label="Close figure viewer"
          >
            ×
          </button>

          <div
            className="galaxy-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedFigure.image}
              alt={selectedFigure.title}
            />

            <div className="galaxy-lightbox-caption">
              <span>{selectedFigure.number} / FIGURE</span>
              <h2>{selectedFigure.title}</h2>
              <p>{selectedFigure.description}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

