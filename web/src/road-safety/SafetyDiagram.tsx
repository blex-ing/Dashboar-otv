/** Diagram from the user-supplied v0.1 reference, adapted as accessible responsive SVG.
 * All lane/sidewalk/bridge positions are illustrative only. */
export function SafetyDiagram(){
 return <figure className="safety-diagram-figure">
  <svg viewBox="0 0 800 470" role="img" aria-labelledby="safety-diagram-title safety-diagram-description">
   <title id="safety-diagram-title">Lectura conceptual de la Panamericana E35, accesos, semáforos y pasarela</title>
   <desc id="safety-diagram-description">Esquema sin escala. La carretera horizontal presenta mediana, intersección, accesos locales, grupos semafóricos y una pasarela dibujada de forma ilustrativa.</desc>
   <defs><pattern id="safety-diagram-grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#3d6366" strokeWidth=".7"/></pattern></defs>
   <rect width="800" height="470" fill="#16353c"/><rect width="800" height="470" fill="url(#safety-diagram-grid)" opacity=".5"/>
   <g opacity=".75" fill="#31585a"><rect x="40" y="50" width="140" height="82" rx="7"/><rect x="220" y="39" width="90" height="93" rx="7"/><rect x="504" y="42" width="115" height="86" rx="7"/><rect x="651" y="49" width="109" height="84" rx="7"/><rect x="45" y="345" width="130" height="86" rx="7"/><rect x="208" y="349" width="100" height="74" rx="7"/><rect x="516" y="344" width="102" height="88" rx="7"/><rect x="654" y="348" width="110" height="80" rx="7"/></g>
   <rect x="335" y="0" width="128" height="470" fill="#263d49"/><rect x="0" y="149" width="800" height="180" fill="#2c3945"/><rect x="0" y="235" width="800" height="11" fill="#5e7361"/>
   <path d="M0 182H800 M0 293H800" fill="none" stroke="#d6e1e2" strokeWidth="2" opacity=".6"/>
   <path d="M0 218H800 M0 263H800" fill="none" stroke="#c5d3d3" strokeDasharray="20 17" strokeWidth="2" opacity=".75"/>
   <path d="M369 0V149 M369 329V470 M426 0V149 M426 330V470" stroke="#b9d6d2" strokeDasharray="18 13" strokeWidth="2" opacity=".7"/>
   <g fill="#d9dad0" opacity=".65"><rect x="318" y="158" width="7" height="11"/><rect x="318" y="179" width="7" height="11"/><rect x="318" y="200" width="7" height="11"/><rect x="477" y="251" width="7" height="12"/><rect x="477" y="275" width="7" height="12"/><rect x="477" y="299" width="7" height="12"/></g>
   <g><rect x="300" y="125" width="22" height="38" rx="5" fill="#16303c" stroke="#a6e8df"/><circle cx="311" cy="136" r="4" fill="#ee8274"/><circle cx="311" cy="146" r="4" fill="#5d655f"/><circle cx="311" cy="156" r="4" fill="#5d655f"/><rect x="474" y="315" width="22" height="38" rx="5" fill="#16303c" stroke="#a6e8df"/><circle cx="485" cy="326" r="4" fill="#ee8274"/><circle cx="485" cy="336" r="4" fill="#5d655f"/><circle cx="485" cy="345" r="4" fill="#5d655f"/></g>
   <rect x="650" y="109" width="18" height="261" rx="7" fill="#74d8c7" stroke="#e0fbf6" strokeWidth="3"/><path d="M626 110L686 110 M626 370L686 370" stroke="#c4faf0" strokeWidth="7"/>
   <g fontFamily="system-ui,sans-serif" fontWeight="700" fill="#e9f8f4"><text x="47" y="172" fontSize="17">PANAMERICANA E35</text><text x="530" y="313" fontSize="12" opacity=".82">CARRILES ILUSTRATIVOS</text><text x="343" y="25" fontSize="13">ACCESO</text><text x="345" y="44" fontSize="13">LOCAL</text><text x="344" y="412" fontSize="13">ACCESO</text><text x="346" y="431" fontSize="13">LOCAL</text></g>
   <g stroke="#89eddd" strokeWidth="2"><path d="M524 94L485 134"/><path d="M530 392L660 348"/></g><g fill="#89eddd" fontFamily="system-ui,sans-serif" fontSize="13"><text x="519" y="82">Semáforo</text><text x="533" y="412">Pasarela</text></g>
   <rect x="14" y="437" width="180" height="23" rx="8" fill="#0b1d28" opacity=".9"/><text x="24" y="453" fill="#aee4de" fontFamily="system-ui,sans-serif" fontSize="11">ESQUEMA · NO A ESCALA</text>
  </svg>
  <figcaption>⚠ Solo organiza elementos reconocidos; no utilizar para circulación, obras o diseño geométrico.</figcaption>
 </figure>;
}
