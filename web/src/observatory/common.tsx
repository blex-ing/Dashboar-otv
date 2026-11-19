import { verdicts } from '../../../shared/catalog';
import type { CivicCandidate, Verdict } from '../../../shared/catalog';
export function time(seconds: number) { return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`; }
export function Avatar({candidate,large=false}:{candidate:CivicCandidate;large?:boolean}) {return <span aria-hidden="true" className={`avatar ${candidate.color} ${large?'large':''}`}>{candidate.initials}</span>;}
export function Badge({verdict}:{verdict:Verdict}) {return <span className={`verdict ${verdict}`}><span aria-hidden="true">●</span> {verdicts[verdict]}</span>;}
export function PageHeading({eyebrow,title,text}:{eyebrow:string;title:string;text:string}) {return <div className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div>;}
export function Empty({onReset}:{onReset:()=>void}) {return <div className="empty"><h2>No hay resultados</h2><p>Prueba otros filtros o vuelve al listado.</p><button className="secondary" onClick={onReset}>Restablecer</button></div>;}
