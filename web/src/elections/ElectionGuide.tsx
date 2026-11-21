import { PageHeading } from '../observatory/common';
import { otavaloElection } from './otavalo-2026';

export function ElectionGuide() {
  const election = otavaloElection;
  const primary = election.sources.find(source => source.id === 'cne-voto-informado');
  return <article className="electoral-guide" aria-labelledby="election-heading">
    <div id="election-heading">
      <PageHeading eyebrow="ELECCIONES SECCIONALES · 29 NOV 2026"
        title="Candidaturas a la Alcaldía de Otavalo"
        text="Directorio informativo y neutral para el período 2027–2031. Datos básicos contrastados con publicaciones locales; revisión documental de los planes todavía pendiente."/>
    </div>
    <div className="panel electoral-context">
      <p><strong>Información real, separada de la demostración.</strong> Estas candidaturas corresponden al proceso electoral, no a los perfiles ni apoyos ficticios del laboratorio OTV. No se muestran encuestas, rankings, recomendaciones de voto ni veredictos de promesas.</p>
      <p>Revisión: <time dateTime={election.reviewedOn}>21 de noviembre de 2026</time>. Los nombres y organizaciones se contrastaron con dos publicaciones periodísticas. El registro definitivo y los documentos presentados deben consultarse en el CNE.</p>
      {primary&&<a href={primary.url} target="_blank" rel="noopener noreferrer">Consultar Voto Informado del CNE ↗</a>}
    </div>
    <section aria-labelledby="election-candidates-title">
      <div className="section-title"><div><p className="eyebrow">ORDEN ALFABÉTICO · MISMA COBERTURA</p><h2 id="election-candidates-title">Las seis candidaturas</h2></div></div>
      <div className="electoral-grid">
        {election.candidates.map(candidate=><article className="panel electoral-card" key={candidate.id}>
          <p className="tiny">ALCALDÍA DE OTAVALO · 2027–2031</p>
          <h3>{candidate.name}</h3>
          <p className="group">{candidate.organisation}</p>
          <p className="subtle">Candidatura contrastada en prensa local. Identidad y organización sujetas al registro electoral definitivo del CNE.</p>
          <p><strong>Plan de trabajo:</strong> pendiente de lectura y contraste directo con el documento primario. No atribuimos propuestas sin esa revisión.</p>
          <div className="electoral-source-links">
            {candidate.sourceIds.map(sourceId=>{
              const source=election.sources.find(item=>item.id===sourceId);
              return source?<a href={source.url} key={source.id} rel="noopener noreferrer" target="_blank">{source.publisher} · {source.publishedOn} ↗</a>:null;
            })}
          </div>
        </article>)}
      </div>
    </section>
    <section className="panel electoral-method" aria-labelledby="election-method-title">
      <h2 id="election-method-title">Cómo publicaremos información contrastada</h2>
      <p>Una fuente electoral acredita que una propuesta fue presentada, pero no demuestra que sea factible ni que vaya a cumplirse. Cada futura ficha indicará documento, página o minuto, fecha, tipo de afirmación y qué parte sigue sin comprobarse.</p>
      <p>Las biografías, declaraciones, presupuestos y antecedentes administrativos requerirán evidencias identificables; no mostraremos puntuaciones de honestidad, predicciones ni apoyo simulado de personas reales.</p>
      <h3>Fuentes y procedencia</h3>
      <ul>{election.sources.map(source=><li key={source.id}>
        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.publisher}: {source.title}</a>
        <span className="subtle"> · {source.kind==='official-directory'?'Directorio oficial':'Prensa local'} · {source.publishedOn}</span>
      </li>)}</ul>
    </section>
  </article>;
}
