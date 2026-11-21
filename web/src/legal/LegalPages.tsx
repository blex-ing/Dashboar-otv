import { PageHeading } from '../observatory/common';
import { hasCompleteLegalIdentity, legalDocument, legalIdentity } from './legal-config';

type LegalPage = 'aviso-legal' | 'privacidad' | 'cookies';

function IdentityNotice() {
  if (hasCompleteLegalIdentity) return null;
  return <div className="legal-warning" role="status"><strong>Borrador no publicable.</strong> Falta confirmar la identidad y el contacto del responsable. La puerta de release impide llevar este texto incompleto a producción.</div>;
}

function Identity() {
  return <dl className="legal-identity">
    <div><dt>Responsable</dt><dd>{legalIdentity.controllerName || 'Pendiente de confirmación'}</dd></div>
    <div><dt>Naturaleza</dt><dd>{legalIdentity.legalNature}</dd></div>
    <div><dt>País del responsable</dt><dd>{legalIdentity.country}</dd></div>
    <div><dt>Identificación fiscal</dt><dd>{legalIdentity.taxStatus}</dd></div>
    <div><dt>Dirección de contacto</dt><dd>{legalIdentity.addressStatus}</dd></div>
    <div><dt>Privacidad y ejercicio de derechos</dt><dd>{legalIdentity.privacyEmail ? <a href={`mailto:${legalIdentity.privacyEmail}`}>{legalIdentity.privacyEmail}</a> : 'Pendiente de confirmación'}</dd></div>
  </dl>;
}

export function LegalPages({page}:{page:LegalPage}) {
  if (page === 'aviso-legal') return <article className="legal-page">
    <PageHeading eyebrow="INFORMACIÓN LEGAL" title="Aviso legal" text="Identificación, condiciones de uso y límites de este laboratorio ciudadano."/>
    <IdentityNotice/><section className="panel"><h2>Identificación del servicio</h2><Identity/><p>{legalDocument.serviceName} es un proyecto ciudadano sin ánimo de lucro gestionado bajo el nombre Ali Tio Tech. Es actualmente una demostración informativa con candidaturas, apoyos y documentos sintéticos. No es una administración pública, una autoridad electoral, una encuesta ni una publicación de resultados oficiales.</p></section>
    <section className="panel"><h2>Uso del contenido</h2><p>El contenido se ofrece para explorar un producto en desarrollo. No debe utilizarse como fuente electoral ni atribuirse a personas reales. Los enlaces externos se identifican como tales y no implican control sobre sus contenidos.</p><p>Antes de publicar información real se documentarán procedencia, licencia, fecha de consulta, criterios editoriales y mecanismo de rectificación.</p></section>
    <section className="panel"><h2>Responsabilidad y correcciones</h2><p>Se aplican controles razonables de seguridad y disponibilidad, pero no se garantiza un servicio ininterrumpido. Los errores o solicitudes de corrección podrán comunicarse al contacto del responsable indicado arriba.</p></section>
    <LegalVersion/>
  </article>;
  if (page === 'privacidad') return <article className="legal-page">
    <PageHeading eyebrow="PROTECCIÓN DE DATOS" title="Política de privacidad" text="Qué datos trata esta versión, para qué y qué derechos tienes."/>
    <IdentityNotice/><section className="panel"><h2>Resumen de esta versión</h2><p>Ali Tio Tech gestiona esta demostración sin ánimo de lucro desde Ecuador. La aplicación no ofrece cuentas, formularios ni votación real; no guarda preferencias políticas y no utiliza analítica publicitaria. La simulación de apoyo vive solo en la memoria de la pestaña y desaparece al recargar.</p></section>
    <section className="panel"><h2>Responsable del tratamiento</h2><Identity/></section>
    <section className="panel"><h2>Datos técnicos de infraestructura</h2><p>Para entregar y proteger la web, {legalDocument.hostingProvider} puede tratar datos técnicos de conexión, como dirección IP, fecha y hora, URL solicitada, agente de usuario e información de seguridad. La finalidad es prestar, proteger y diagnosticar el servicio. El detalle de conservación, destinatarios, transferencias y garantías deberá mantenerse alineado con la configuración y el contrato vigentes del proveedor.</p><p>Consulta la <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">política de privacidad de Cloudflare</a>.</p></section>
    <section className="panel"><h2>Finalidades, base y conservación</h2><ul><li>Entrega y seguridad técnica del sitio: prestación del servicio y, cuando corresponda, interés legítimo en mantenerlo seguro.</li><li>Atención de derechos y correcciones: cumplimiento de obligaciones legales y gestión de la solicitud.</li><li>No se toman decisiones automatizadas ni se elaboran perfiles políticos.</li></ul><p>La web no conserva datos personales de visitantes en su propia base de datos. Los registros técnicos del proveedor se conservarán únicamente durante el periodo configurado y necesario para seguridad y operación; debe verificarse antes de publicar esta política.</p></section>
    <section className="panel"><h2>Tus derechos</h2><p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad cuando proceda, acreditando tu identidad por el canal indicado. También puedes reclamar ante la <a href="https://www.aepd.es/" target="_blank" rel="noreferrer">Agencia Española de Protección de Datos</a>.</p></section>
    <LegalVersion/>
  </article>;
  return <article className="legal-page">
    <PageHeading eyebrow="TECNOLOGÍAS DE ALMACENAMIENTO" title="Política de cookies" text="Estado real de cookies y tecnologías similares en esta versión."/>
    <IdentityNotice/><section className="panel"><h2>Situación actual</h2><p><strong>OTV no instala cookies propias, analíticas ni publicitarias y no usa localStorage o sessionStorage.</strong> Por ello no se muestra un banner de consentimiento que no tendría nada que aceptar o rechazar.</p><p>El proveedor de infraestructura puede aplicar mecanismos estrictamente necesarios de red o seguridad. Si la configuración cambia, esta declaración y el inventario técnico deberán revisarse.</p></section>
    <section className="panel"><h2>Regla para futuras integraciones</h2><p>Una función opcional que utilice cookies, píxeles, almacenamiento local o identificadores no esenciales deberá permanecer bloqueada hasta obtener un consentimiento informado. Aceptar y rechazar tendrán la misma facilidad y el consentimiento podrá retirarse en cualquier momento.</p></section>
    <section className="panel"><h2>Inventario</h2><div className="legal-table" role="region" aria-label="Inventario de tecnologías" tabIndex={0}><table><thead><tr><th>Tecnología</th><th>Proveedor</th><th>Finalidad</th><th>Estado</th></tr></thead><tbody><tr><td>Cookies propias</td><td>OTV</td><td>No utilizadas</td><td>Inactivas</td></tr><tr><td>Almacenamiento web</td><td>OTV</td><td>No utilizado</td><td>Inactivo</td></tr><tr><td>Analítica o publicidad</td><td>—</td><td>No integrada</td><td>Inactiva</td></tr></tbody></table></div></section>
    <LegalVersion/>
  </article>;
}

function LegalVersion() {
  return <p className="legal-version">Versión {legalDocument.version} · Revisado el {legalDocument.reviewedOn}. Se revisará cuando cambien el responsable, el proveedor, las finalidades o las tecnologías utilizadas.</p>;
}
