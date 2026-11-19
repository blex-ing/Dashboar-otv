import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CandidateProfiles } from './candidates/CandidateProfiles';
import { demoDirectory } from './candidates/profiles';
import './styles.css';

function App() {
  return (
    <>
      <a className="skip" href="#main">Saltar al contenido</a>
      <header><span className="brand">Dashboard OTV</span></header>
      <main id="main" tabIndex={-1}>
        <h1>Candidatos y propuestas</h1>
        <p className="intro">Selecciona un candidato para consultar sus propuestas por tema.</p>
        <p className="notice">Vista de demostración con candidaturas ficticias. La votación está cerrada.</p>
        <CandidateProfiles directory={demoDirectory} />
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
