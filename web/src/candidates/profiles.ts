import type { Candidate } from '../../../shared/domain';

export interface Proposal {
  topic: string;
  title: string;
  summary: string;
}

export interface CandidateProfile extends Candidate {
  proposals: readonly Proposal[];
}

export class CandidateDirectory {
  private readonly profiles: readonly CandidateProfile[];

  constructor(profiles: readonly CandidateProfile[]) {
    this.profiles = profiles;
  }

  list(): readonly CandidateProfile[] {
    return this.profiles;
  }

  find(id: string): CandidateProfile | undefined {
    return this.profiles.find(profile => profile.id === id);
  }
}

export const demoDirectory = new CandidateDirectory([
  {
    id: 'ana',
    name: 'Ana Rivera',
    description: 'Propone mejorar el acceso a actividades y crear espacios de aprendizaje compartido.',
    proposals: [
      { topic: 'Formación', title: 'Talleres entre participantes', summary: 'Organizar un taller mensual en el que cada persona pueda enseñar una habilidad práctica al resto.' },
      { topic: 'Participación', title: 'Un calendario abierto', summary: 'Publicar fechas, plazas y requisitos de las actividades en un calendario consultable desde el móvil.' },
    ],
  },
  {
    id: 'luis',
    name: 'Luis Mendoza',
    description: 'Propone simplificar la organización de las actividades y publicar sus resultados.',
    proposals: [
      { topic: 'Formación', title: 'Guías prácticas', summary: 'Reunir los materiales de las actividades en guías breves que se puedan consultar después de cada sesión.' },
      { topic: 'Participación', title: 'Resumen mensual de actividades', summary: 'Publicar los resultados de cada actividad y recoger sugerencias para el siguiente mes.' },
    ],
  },
]);
