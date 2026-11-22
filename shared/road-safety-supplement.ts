/** Additional documentary context transcribed from the user-provided E35 v0.1 demo/ZIP. */
export const roadSafetySupplement = {
 technicalMeasurements: 0,
 visibleObservations: [
  {title:'Varios carriles sobre la E35',detail:'Calzada ancha y mediana; la sección exacta debe medirse.'},
  {title:'Semáforos en aproximaciones',detail:'Hay grupos semafóricos; su anticipación y legibilidad no están medidas.'},
  {title:'Puente peatonal cercano',detail:'Se distingue estructura elevada y acceso curvo.'},
  {title:'Comercios y movilidad peatonal',detail:'Hay actividad a los lados de la vía.'},
  {title:'Autobuses, camiones y firme agrietado',detail:'Presencia observable, sin datos de frecuencia o gravedad.'}
 ],
 topics: [
  {id:'R01',group:'Intersección',status:'Antecedente documentado + revisión pendiente'},
  {id:'R02',group:'Peatones',status:'Hipótesis de riesgo'},
  {id:'R03',group:'Intersección',status:'Hipótesis de riesgo'},
  {id:'R04',group:'Peatones',status:'Histórico documentado + situación actual no verificada'},
  {id:'R05',group:'Vehículos',status:'Hipótesis de riesgo'},
  {id:'R06',group:'Calzada',status:'Observación fotográfica + revisión pendiente'},
  {id:'R07',group:'Entorno',status:'Sin evidencia suficiente'}
 ],
 fieldGroups: ['Geometría y señales','Semáforos','Semáforos','Peatones','Peatones','Vehículos','Vehículos','Calzada','Entorno','Documentación'],
 fieldProtocol: [
  {title:'Prioridad: no exponerse a la calzada',detail:'Fotografiar desde acera, lugares habilitados o puntos seguros.'},
  {title:'Fechar y orientar cada foto',detail:'Indicar sentido de la vista, hora y condiciones.'},
  {title:'Medir, no suponer',detail:'No deducir velocidades o tiempos de semáforo de imágenes fijas.'},
  {title:'Separar evidencia de propuesta',detail:'Primero inventariar, luego diagnosticar y solo después diseñar mejoras.'}
 ],
 sources: [
  {title:'Choque de cuatro vehículos en el semáforo',institution:'Hoy en Imbabura',date:'28 jul 2023',url:'https://hoyenimbabura.com/2023/07/28/cuadruple-choque-se-produjo-en-la-entrada-a-eugenio-espejo-canton-otavalo/',notes:'Siniestro documentado; testigos mencionan visibilidad semafórica, sin pericia causal disponible en la nota.'},
  {title:'Puente muerto en Eugenio Espejo',institution:'Diario La Hora',date:'19 nov 2007',url:'https://www.lahora.com.ec/imbaburacarchi/Puente-muerto-en-Eugenio-Espejo.-20071119-0391.html',notes:'Quejas históricas sobre el recorrido del puente y atropellamientos; no equivale a diagnóstico actual.'},
  {title:'Recuperación del puente peatonal',institution:'Gobernación de Imbabura',date:'Fecha no verificada',url:'https://gobernacionimbabura.gob.ec/%F0%9D%97%94%F0%9D%97%A8%F0%9D%97%A7%F0%9D%97%A2%F0%9D%97%A5%F0%9D%97%9C%F0%9D%97%97%F0%9D%97%94%F0%9D%97%97%F0%9D%97%98%F0%9D%97%A6-%F0%9D%97%AC-%F0%9D%97%9B%F0%9D%97%94%F0%9D%97%95%F0%9D%97%9C/',notes:'Referencia histórica institucional a intervención comunitaria de la pasarela; fecha de publicación no confirmada.'},
  {title:'Información vial parroquial',institution:'GAD parroquial Eugenio Espejo',date:'Consulta 2026',url:'https://gadeugenioespejo.gob.ec/como-llegar/',notes:'Identifica la E35 como eje que atraviesa y fragmenta la parroquia y registra transporte público local e interprovincial.'},
  {title:'Tres fallecidos en choque en sector Eugenio Espejo',institution:'Diario El Norte',date:'30 oct 2026',url:'https://elnorte.ec/accidente-en-la-panamericana-norte-deja-tres-fallecidos-en-otavalo/',notes:'Noticia de colisión entre vehículos; no demuestra atropello peatonal ni ubicación en el semáforo.'},
  {title:'Colisión entre camión y camioneta en Otavalo',institution:'Shyar',date:'30 oct 2026',url:'https://shyar.ec/tres-personas-pierden-la-vida-tras-choque-entre-camion-y-camioneta-en-otavalo/',notes:'Segunda referencia periodística para la colisión del sector; no permite establecer causas oficiales.'}
 ]
} as const;
