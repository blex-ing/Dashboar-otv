/** Dossier visual de lectura pública. Valores históricos con procedencia; no es un catálogo de siniestros oficiales. */
export const roadSafetyCase = {
  "location": {
    "name": "Acceso a la parroquia Eugenio Espejo · Panamericana E35",
    "municipality": "Otavalo",
    "province": "Imbabura",
    "country": "Ecuador",
    "latitude": 0.2090241,
    "longitude": -78.2503891,
    "approximate": true,
    "mapsUrl": "https://maps.app.goo.gl/LUYn4Pz4Eftf7JEH9"
  },
  "imagesPolicy": "Las diez capturas originales de Google Maps / Street View aportadas en el chat están identificadas en el expediente local de 23/11/2026. La web muestra sus metadatos, observaciones y enlaces a la fuente; no redistribuye las capturas originales mientras no se aclare su autorización de publicación.",
  "photos": [
    {
      "id": "F01",
      "title": "Plano satelital del cruce",
      "category": "Plano",
      "date": "Marzo de 2025 (mapa)",
      "observed": "Vista aérea de la E35 y sus conexiones locales, junto a establecimientos y semáforo.",
      "verify": "No se pueden medir distancias, geometría ni tiempos con la captura.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F02",
      "title": "Aproximación a la intersección",
      "category": "Semáforos",
      "date": "Marzo de 2025",
      "observed": "Semáforo en rojo, calzada amplia y autobús visible en el lateral.",
      "verify": "Comprobar percepción anticipada de la señal y líneas de detención.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F03",
      "title": "Autobús en intersección",
      "category": "Vehículos",
      "date": "Marzo de 2025",
      "observed": "Autobús interparroquial de gran tamaño en el espacio vial próximo al cruce.",
      "verify": "Comprobar giros y posibles oclusiones, sin deducir infracciones de una foto.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F04",
      "title": "Autobús, zona posterior",
      "category": "Vehículos",
      "date": "Marzo de 2025",
      "observed": "Vista lateral del autobús y comercios situados al otro lado de la E35.",
      "verify": "Levantar itinerarios y giros permitidos para transporte público.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F05",
      "title": "Pasarela peatonal y borde vial",
      "category": "Peatones",
      "date": "Marzo de 2025",
      "observed": "Pasarela sobre la carretera y su acceso en curva, con actividad en las proximidades.",
      "verify": "Comprobar accesibilidad, itinerarios y uso real de la pasarela.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F06",
      "title": "Vehículo de carga y pavimento",
      "category": "Calzada",
      "date": "Marzo de 2025",
      "observed": "Vehículo junto al borde de la vía y fisuras superficiales visibles.",
      "verify": "Inspeccionar señalización, firme y parada de vehículos sobre el terreno.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F07",
      "title": "Acceso lateral con paso cebra",
      "category": "Peatones",
      "date": "Marzo de 2025",
      "observed": "Paso de cebra en acceso lateral, bordillos, comercios y semáforos.",
      "verify": "Evaluar continuidad de acera y fases de paso peatonal.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F08",
      "title": "Anchura de la E35",
      "category": "Calzada",
      "date": "Febrero de 2025",
      "observed": "Varios carriles y mediana, con vehículos próximos a la zona semaforizada.",
      "verify": "Medir anchuras y comprobar canalización y distancias de visibilidad.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F09",
      "title": "Aceras y frente comercial",
      "category": "Peatones",
      "date": "Febrero de 2025",
      "observed": "Viviendas, comercio, aceras/escalones y personas cercanas al cruce.",
      "verify": "Auditar recorridos de personas con movilidad reducida.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    },
    {
      "id": "F10",
      "title": "Panorámica de semáforo y puente",
      "category": "Semáforos",
      "date": "Febrero de 2025",
      "observed": "Grupos semafóricos y puente peatonal sobre la Panamericana.",
      "verify": "Comprobar señales desde ambos sentidos y en horas de baja visibilidad.",
      "source": "Captura del usuario de Google Maps / Street View, 2025"
    }
  ],
  "risks": [
    {
      "id": "R01",
      "title": "Visibilidad y lectura semafórica",
      "priority": "Alta",
      "description": "Antecedente 2023 de choque de cuatro vehículos; los testimonios periodísticos aluden a problemas para ver la señal.",
      "check": "Inspección por aproximación, distancia, noche y lluvia.",
      "photoIds": [
        "F02",
        "F08",
        "F10"
      ]
    },
    {
      "id": "R02",
      "title": "Cruce de peatones por la Panamericana",
      "priority": "Alta",
      "description": "Existen zonas residenciales y comerciales a ambos lados y una pasarela; no hay aforos peatonales.",
      "check": "Contar recorridos por pasarela y a nivel, y tiempos de espera.",
      "photoIds": [
        "F05",
        "F07",
        "F09",
        "F10"
      ]
    },
    {
      "id": "R03",
      "title": "Giros y accesos locales",
      "priority": "Alta",
      "description": "La E35 se conecta con accesos laterales próximos al semáforo; falta conocer fases y movimientos permitidos.",
      "check": "Registrar giros autorizados y conflictos por ciclo.",
      "photoIds": [
        "F01",
        "F02",
        "F07"
      ]
    },
    {
      "id": "R04",
      "title": "Accesibilidad y uso de la pasarela",
      "priority": "Alta",
      "description": "La prensa histórica cuestionó su uso; su condición actual y la accesibilidad no están verificadas.",
      "check": "Medir pendientes, accesos, iluminación, barreras y tiempos.",
      "photoIds": [
        "F05",
        "F10"
      ]
    },
    {
      "id": "R05",
      "title": "Buses y transporte pesado",
      "priority": "Media",
      "description": "Las capturas muestran autobús y carga; no prueban uso inseguro.",
      "check": "Aforar y revisar giros, paradas, puntos ciegos.",
      "photoIds": [
        "F02",
        "F03",
        "F04",
        "F06"
      ]
    },
    {
      "id": "R06",
      "title": "Firme, bordes y señales horizontales",
      "priority": "Media",
      "description": "Hay fisuras visibles en fotos antiguas; su estado actual se desconoce.",
      "check": "Inspección técnica de firme, drenaje, bordillos y pintura.",
      "photoIds": [
        "F02",
        "F06",
        "F08"
      ]
    },
    {
      "id": "R07",
      "title": "Condiciones nocturnas y lluvia",
      "priority": "Pendiente",
      "description": "Las diez capturas no permiten evaluar iluminación nocturna ni reflectancia.",
      "check": "Visita segura desde zonas peatonales de noche y con lluvia.",
      "photoIds": []
    }
  ],
  "incidents": [
    {
      "id": "I-2007-11-19",
      "date": "2007-11-19",
      "displayDate": "19 de noviembre de 2007",
      "title": "Antecedentes sobre la pasarela y atropellos",
      "type": "antecedente_periodistico",
      "status": "prensa_historica",
      "summary": "La Hora recogió críticas ciudadanas sobre la utilidad de la pasarela y referencias históricas a atropellos, sin que permitan evaluar la situación actual.",
      "fatalities": null,
      "injured": null,
      "exactJunctionConfirmed": false,
      "sources": [
        "https://www.lahora.com.ec/imbaburacarchi/Puente-muerto-en-Eugenio-Espejo.-20071119-0391.html"
      ]
    },
    {
      "id": "I-2023-07-28",
      "date": "2023-07-28",
      "displayDate": "28 de julio de 2023",
      "title": "Choque de cuatro vehículos en el semáforo",
      "type": "colision_vehiculos",
      "status": "documentado_en_prensa",
      "summary": "Publicación local sobre una colisión de cuatro vehículos; comentarios de testigos señalaban dificultad para observar el semáforo. No existe en este expediente pericia causal oficial.",
      "fatalities": null,
      "injured": null,
      "exactJunctionConfirmed": true,
      "sources": [
        "https://hoyenimbabura.com/2023/07/28/cuadruple-choque-se-produjo-en-la-entrada-a-eugenio-espejo-canton-otavalo/"
      ]
    },
    {
      "id": "I-2026-10-30",
      "date": "2026-10-30",
      "displayDate": "30 de octubre de 2026",
      "title": "Colisión entre vehículos: tres personas fallecidas",
      "type": "colision_vehiculos",
      "status": "documentado_en_prensa",
      "summary": "Colisión entre un camión y un vehículo particular en el sector de Eugenio Espejo de la E35. Dos medios informaron de tres personas fallecidas y una herida. No se ha acreditado que fueran peatones ni el punto exacto de la intersección.",
      "fatalities": 3,
      "injured": 1,
      "exactJunctionConfirmed": false,
      "sources": [
        "https://elnorte.ec/accidente-en-la-panamericana-norte-deja-tres-fallecidos-en-otavalo/",
        "https://shyar.ec/tres-personas-pierden-la-vida-tras-choque-entre-camion-y-camioneta-en-otavalo/"
      ]
    },
    {
      "id": "T-2026-11-23",
      "date": "2026-11-23",
      "displayDate": "23 de noviembre de 2026",
      "title": "Aviso ciudadano: posibles atropellos recientes",
      "type": "testimonio",
      "status": "testimonio_pendiente",
      "summary": "El usuario comunica que habrían ocurrido atropellos con víctimas mortales recientemente. No se ha localizado en esta revisión una fuente que confirme ese tipo de siniestro en el punto exacto; podría estar refiriéndose al choque de 30/10/2026. No se contabiliza como incidente adicional confirmado.",
      "fatalities": null,
      "injured": null,
      "exactJunctionConfirmed": false,
      "sources": []
    }
  ],
  "checklist": [
    {
      "id": "C01",
      "title": "Reconocer todas las aproximaciones"
    },
    {
      "id": "C02",
      "title": "Registrar señales y líneas de detención"
    },
    {
      "id": "C03",
      "title": "Medir fases y tiempos semafóricos"
    },
    {
      "id": "C04",
      "title": "Contar peatones en pasarela y en superficie"
    },
    {
      "id": "C05",
      "title": "Auditar accesibilidad y seguridad de la pasarela"
    },
    {
      "id": "C06",
      "title": "Documentar giros de vehículos pesados y autobuses"
    },
    {
      "id": "C07",
      "title": "Solicitar aforos y velocidades a las autoridades"
    },
    {
      "id": "C08",
      "title": "Inspeccionar firme, drenaje, aceras y marcas"
    },
    {
      "id": "C09",
      "title": "Obtener partes oficiales y croquis de los siniestros"
    },
    {
      "id": "C10",
      "title": "Tomar imágenes nocturnas sin invadir la calzada"
    }
  ],
  "disclaimer": "Este documento no equivale a una auditoría o evaluación técnica de seguridad vial: las capturas son de 2025; no se han medido velocidades, aforos, fases semafóricas, accesibilidad ni causas oficiales de siniestros.",
  "reviewedAt": "2026-11-23"
};
