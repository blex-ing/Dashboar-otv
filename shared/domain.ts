export interface Candidate { id: string; name: string; description: string }
export interface Task { id: string; title: string; weight: number }
export interface Evaluation { candidateId: string; taskId: string; score: number }
export function weightedScore(candidateId: string, tasks: Task[], evaluations: Evaluation[]): number | null {
  if (!tasks.length) return null;
  let total = 0, weights = 0;
  for (const task of tasks) {
    const matches = evaluations.filter(e => e.candidateId === candidateId && e.taskId === task.id);
    if (matches.length !== 1) return null;
    const score = matches[0].score;
    if (!Number.isFinite(score) || score < 0 || score > 10 || !Number.isFinite(task.weight) || task.weight <= 0) throw new Error('Invalid evaluation');
    total += score * task.weight; weights += task.weight;
  }
  return Math.round(total / weights * 100) / 100;
}
