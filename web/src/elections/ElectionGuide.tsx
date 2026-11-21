import { PageHeading } from '../observatory/common';
import { otavaloElection } from './otavalo-2026';
import type { ElectoralCandidate } from './otavalo-2026';

function electionHref(id?:string) {
 const q=new URLSearchParams({lugar:'otavalo',vista:'elecciones'});
 if(id)q.set('c',id);
 return `?${q.toString()}`;
}

function VerifiedSources({candidate}:{candidate:ElectoralCandidate}) {
 return <div className="electoral-source-links">
  {candidate.sourceIds.map(sourceId=>{
   const source=otavaloElection.sources.find(item=>item.id===sourceId);
   return source?<a href={source.url} key={source.id} rel="noopener noreferrer" target="_blank">{source.publisher} · {source.publishedOn} ↗</a>:null;
  })}
 </div>;
}

function PublicParticipation({detail=false}:{detail?:boolean}) {
 return <section className="panel electoral-participation" aria-labelledby="public-participation-title">
  <h2 id="public-participation-title">Participación pública</h2>
  <p><strong>Votación no habilitada.</strong> La participación real está pendiente de controles legales, protección de datos y pruebas de seguridad. OTV no registra preferencias políticas en esta vista.</p>
  <p>{detail?'Sin datos de apoyos reales.':'No hay recuentos reales disponibles.'} No se publica un podio de candidaturas ni se presenta una selección simulada como intención de voto.</p>
  {detail&&<button className="secondary" type="button" disabled>Votar en OTV</button>}
  <p className="subtle">El laboratorio con cifras ficticias se mantiene separado. Cualquier futura encuesta ciudadana deberá aclarar su carácter no representativo y no equivale a resultados oficiales.</p>
 </section>;
}

function CandidateDetail({candidate}:{candidate:ElectoralCandidate}) {
 const primary=otavaloElection.sources.find(s=>s.id==='cne-voto-informado');
 return <article className="electoral-guide electoral-profile">
  <a href={electionHref()} className="electoral-back">← Volver a las seis candidaturas</a>
  <PageHeading eyebrow="FICHA ELECTORAL · OTAVALO 2026" title={candidate.name}
    text="Información documental en revisión. No es un perfil ficticio ni contiene pronósticos electorales."/>
  <section className="panel">
   <h2>Datos de candidatura</h2>
   <dl className="legal-identity">
    <div><dt>Organización publicada</dt><dd>{candidate.organisation}</dd></div>
    <div><dt>Dignidad</dt><dd>{otavaloElection.office}</dd></div>
    <div><dt>Proceso electoral</dt><dd>29 de noviembre de 2026 · período {otavaloElection.term}</dd></div>
    <div><dt>Estado del plan</dt><dd>Lectura y cotejo con el documento original del CNE pendientes</dd></div>
   </dl>
   <p>Identidad y organización contrastadas con prensa local; el registro definitivo debe cotejarse individualmente con el Consejo Nacional Electoral.</p>
   <VerifiedSources candidate={candidate}/>
   {primary&&<p><a href={primary.url} rel="noopener noreferrer" target="_blank">Consultar Voto Informado del CNE ↗</a></p>}
  </section>
  <PublicParticipation detail/>
 </article>;
}

export function ElectionGuide() {
 const election = otavaloElection;
 const primary = election.sources.find(source => source.id === 'cne-voto-informado');
 const id=new URLSearchParams(location.search).get('c');
 const selected=id?election.candidates.find(c=>c.id===id):undefined;
 if(id && !selected) return <section className="electoral-guide empty">
  <h1>Candidatura no encontrada</h1>
  <p>La ficha solicitada no existe en el registro documental de esta edición.</p>
  <a href={electionHref()}>Volver a las seis candidaturas</a>
 </section>;
 if(selected) return <CandidateDetail candidate={selected}/>;
 return <article className="electoral-guide">
  <PageHeading eyebrow="ELECCIONES SECCIONALES · 29 NOV 2026"
   title="Candidaturas a la Alcaldía de Otavalo"
   text="Directorio informativo y neutral para el período 2027–2031. Datos básicos contrastados con publicaciones locales; revisión documental de los planes todavía pendiente."/>
  <div className="panel electoral-context">
   <p><strong>Información real, separada de la demostración.</strong> Estas candidaturas corresponden al proceso electoral, no a los perfiles ni apoyos ficticios del laboratorio OTV. No se muestran encuestas, rankings, recomendaciones de voto ni veredictos de promesas.</p>
   <p>Revisión: <time dateTime={election.reviewedOn}>21 de noviembre de 2026</time>. Los nombres y organizaciones se contrastaron con dos publicaciones periodísticas. El registro definitivo y los documentos presentados deben consultarse en el CNE.</p>
   {primary&&<a href={primary.url} target="_blank" rel="noopener noreferrer">Consultar Voto Informado del CNE ↗</a>}
  </div>
  <PublicParticipation/>
  <section aria-labelledby="election-candidates-title">
   <div className="section-title"><div><p className="eyebrow">ORDEN ALFABÉTICO · MISMA COBERTURA</p><h2 id="election-candidates-title">Las seis candidaturas</h2></div></div>
   <div className="electoral-grid">
    {election.candidates.map(candidate=><article className="panel electoral-card" key={candidate.id}>
     <p className="tiny">ALCALDÍA DE OTAVALO · 2027–2031</p>
     <h3>{candidate.name}</h3>
     <p className="group">{candidate.organisation}</p>
     <p className="subtle">Candidatura contrastada en prensa local. Identidad y organización sujetas al registro electoral definitivo del CNE.</p>
     <p><strong>Plan de trabajo:</strong> pendiente de lectura y contraste directo con el documento primario. No atribuimos propuestas sin esa revisión.</p>
     <a className="electoral-profile-link" href={electionHref(candidate.id)}>Consultar ficha</a>
     <VerifiedSources candidate={candidate}/>
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
