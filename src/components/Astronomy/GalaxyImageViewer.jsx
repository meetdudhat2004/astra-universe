import { useState } from 'react';

const galaxies = [
  {
    id: '506276_3135',
    name: 'Galaxy 506276_3135',
    category: 'Possible Starburst / AGN',
    image: '/images/galaxies/viewer/506276_3135.png',
    source: 'Legacy Survey',
    bands: 'g · r · z',
  },
  {
    id: '401423_1736',
    name: 'Galaxy 401423_1736',
    category: 'Merger Candidate',
    image: '/images/galaxies/viewer/401423_1736.png',
    source: 'Legacy Survey',
    bands: 'g · r · z',
  },
  {
    id: '574709_236',
    name: 'Galaxy 574709_236',
    category: 'Possible CCD Artifact',
    image: '/images/galaxies/viewer/574709_236.png',
    source: 'Legacy Survey',
    bands: 'g · r · z',
  },
  {
    id: '634321_483',
    name: 'Galaxy 634321_483',
    category: 'Possible Instrumental Artifact',
    image: '/images/galaxies/viewer/634321_483.png',
    source: 'Legacy Survey',
    bands: 'g · r · z',
  },
];

export default function GalaxyImageViewer() {
  const [selectedGalaxy, setSelectedGalaxy] = useState(galaxies[0]);
const [selectedIndex, setSelectedIndex] = useState(0);
const [imageExpanded, setImageExpanded] = useState(false);
  return (
    <section className="galaxy-image-viewer">
      <div className="galaxy-viewer-heading">
        <span className="galaxy-section-label">
          DATA EXPLORER / 01
        </span>

        <h2>Galaxy Image Viewer</h2>

        <p>
          Explore real galaxy observations from the Legacy Surveys
          dataset used in this project.
        </p>
      </div>
<div className="galaxy-selector">
  {galaxies.map((galaxy, index) => (
    <button
      key={galaxy.id}
      className={`galaxy-selector-button ${
        selectedIndex === index ? 'active' : ''
      }`}
      onClick={() => {
        setSelectedIndex(index);
        setSelectedGalaxy(galaxy);
      }}
    >
      <span>0{index + 1}</span>
      {galaxy.id}
    </button>
  ))}
</div>
      <div className="galaxy-viewer-panel">
        <div className="galaxy-viewer-image">
         <img
  src={selectedGalaxy.image}
  alt={selectedGalaxy.name}
  onClick={() => setImageExpanded(true)}
  title="Click to enlarge"
/>
        </div>

        <div className="galaxy-viewer-details">
          <span className="galaxy-section-label">
            SELECTED OBJECT
          </span>

          <h3>{selectedGalaxy.name}</h3>

          <p>Image source: {selectedGalaxy.source}</p>
          <p>Photometric bands: {selectedGalaxy.bands}</p>
          <p>Image dimensions: 128 × 128 pixels</p>
        </div>
      </div>
      {imageExpanded && (
  <div
    className="galaxy-image-lightbox"
    onClick={() => setImageExpanded(false)}
  >
    <button
      className="galaxy-image-lightbox-close"
      onClick={() => setImageExpanded(false)}
      aria-label="Close enlarged image"
    >
      ×
    </button>

    <div
      className="galaxy-image-lightbox-content"
      onClick={(event) => event.stopPropagation()}
    >
      <img
        src={selectedGalaxy.image}
        alt={selectedGalaxy.name}
      />

      <p>{selectedGalaxy.name}</p>
    </div>
  </div>
)}
    </section>
  );
}