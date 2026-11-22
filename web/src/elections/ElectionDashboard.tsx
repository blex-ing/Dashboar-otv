import {otavaloElection} from './otavalo-2026';

function candidateLink(id:string):string {
 return `?lugar=otavalo&vista=elecciones&c=${encodeURIComponent(id)}`;
}
/** First-party presentation only: no vote data, prediction or ranked ordering. */
export function ElectionDashboard(){
 const candidates=otavaloElection.candidates;
 return <div className="real-election-dashboard">
  <section className="hero real-election-hero">
   <p className="eyebrow">OTAVALO · ELECCIONES SECCIONALES 29 NOV 2026</p>
   <h1>Otavalo: conoce las candidaturas</h1>
   <p>Seis candidaturas a la Alcaldía para 2027–2031. Consulta sus fichas y fuentes públicas. Esta página no es una encuesta ni una estimación electoral.</p>
   <div className="hero-actions"><a className="primary real-election-action" href="?lugar=otavalo&vista=elecciones">Explorar las seis candidaturas ↗</a></div>
  </section>
  <section className="stats" aria-label="Información electoral documentada">
   <div><strong>{candidates.length}</strong><span>Candidaturas identificadas en prensa</span></div>
   <div><strong>29/11</strong><span>Fecha de elección 2026</span></div>
   <div><strong>2027–31</strong><span>Período electoral</span></div>
   <div><strong>2</strong><span>Fuentes periodísticas por ficha</span></div>
  </section>
  <section className="panel real-participation-notice" aria-label="Estado de participación">
   <p className="eyebrow">PARTICIPACIÓN CIUDADANA · SIN RECUENTOS</p>
   <h2>Votación no habilitada</h2>
   <p>No se han recogido apoyos reales. Por tanto, no hay cifras, porcentajes ni podio electoral que mostrar. La participación está pendiente de garantías legales y de seguridad.</p>
  </section>
  <section className="panel real-participation-notice" aria-label="Otros temas ciudadanos"><p className="eyebrow">OBSERVATORIO · MOVILIDAD Y COMUNIDAD</p><h2>Seguridad vial: E35 · Eugenio Espejo</h2><p>Consulta el expediente del cruce semaforizado, diez vistas históricas, siete puntos por investigar y los siniestros documentados.</p><a className="real-directory-link" href="?lugar=otavalo&vista=seguridad-vial">Abrir estudio vial ↗</a></section>
  <section aria-labelledby="otavalo-directory-title">
   <div className="section-title"><div><p className="eyebrow">CANDIDATURAS · ORDEN ALFABÉTICO</p><h2 id="otavalo-directory-title">Las personas candidatas</h2></div><a className="real-directory-link" href="?lugar=otavalo&vista=elecciones">Directorio y fuentes ↗</a></div>
   <div className="real-candidate-grid">
    {candidates.map(c=><article className="panel real-candidate-card" key={c.id}>
     <span className="real-initials" aria-hidden="true">{c.name.split(' ').slice(0,2).map(part=>part[0]).join('')}</span>
     <p className="tiny">ALCALDÍA DE OTAVALO · CANDIDATURA PUBLICADA</p>
     <h3>{c.name}</h3>
     <p className="group">{c.organisation}</p>
     <p className="subtle">Plan de trabajo: revisión de la fuente primaria pendiente.</p>
     <a href={candidateLink(c.id)} className="real-profile-action">Consultar ficha ↗</a>
    </article>)}
   </div>
  </section>
  <p className="subtle">Fuente: publicaciones de La Hora y Diario El Norte. Identidades y organizaciones sujetas a cotejo individual con <a href="https://votoinformado.cne.gob.ec/" target="_blank" rel="noopener noreferrer">Voto Informado del CNE</a>. Actualización documental: 21/11/2026.</p>
 </div>;
}
