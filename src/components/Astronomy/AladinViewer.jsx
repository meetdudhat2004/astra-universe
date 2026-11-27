
import { useEffect, useRef, useState } from 'react';

const WWT_ORIGIN = 'https://web.wwtassets.org';

function AladinViewer({ ra, dec, sourceId }) {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    const raValue = Number(ra);
    const decValue = Number(dec);

    if (
      !Number.isFinite(raValue) ||
      !Number.isFinite(decValue)
    ) return;

    const iframeWindow = iframeRef.current?.contentWindow;

    if (!iframeWindow) return;

    let interval;

    const handleMessage = (event) => {
      console.log('WWT message received:', event.origin, event.data);
      if (event.origin !== WWT_ORIGIN) return;
      if (event.source !== iframeWindow) return;

      if (
        event.data?.type === 'wwt_ping_pong' &&
        event.data?.threadId === 'astra-init'
      ) {
        clearInterval(interval);

        iframeWindow.postMessage(
          {
            event: 'center_on_coordinates',
            ra: raValue,
            dec: decValue,
            fov: 0.15,
            instant: false,
          },
          WWT_ORIGIN
        );
      }
    };

    window.addEventListener('message', handleMessage);

    interval = window.setInterval(() => {
      iframeWindow.postMessage(
        {
          type: 'wwt_ping_pong',
          threadId: 'astra-init',
        },
        WWT_ORIGIN
      );
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, [loaded, ra, dec]);

  return (
    <div className="aladin-viewer-section">
      <div className="aladin-viewer-header">
        <div>
          <span className="project-eyebrow">
            INTERACTIVE SKY EXPLORER
          </span>
          <h4>Celestial position</h4>
          <p>Gaia DR3 source: {sourceId}</p>
        </div>

        <span className="aladin-live-indicator">
          WORLDWIDE TELESCOPE
        </span>
      </div>

      <iframe
        ref={iframeRef}
        title={`WorldWide Telescope view of Gaia source ${sourceId}`}
        src={`https://web.wwtassets.org/research/latest/?origin=${encodeURIComponent(window.location.origin)}`}
        className="aladin-viewer"
        allow="accelerometer; clipboard-write; gyroscope"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '450px',
          border: 0,
        }}
      />

      <p className="aladin-viewer-caption">
        WorldWide Telescope · Target coordinates: {ra}, {dec}
      </p>
    </div>
  );
}

export default AladinViewer;
