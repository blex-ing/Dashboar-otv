import type { CandidateProfile, Proposal } from '../../../shared/catalog';

export function CandidateProfileView({ candidate }: { candidate: CandidateProfile }) {
  const initials = candidate.name.split(' ').slice(0, 2).map(part => part.at(0)).join('');

  const proposalsByTopic = new Map<string, Proposal[]>();
  for (const proposal of candidate.proposals) {
    const proposals = proposalsByTopic.get(proposal.topic) ?? [];
    proposals.push(proposal);
    proposalsByTopic.set(proposal.topic, proposals);
  }

  return (
    <section className="profile" aria-labelledby="candidate-name" id="candidate-profile">
      <div className="profile-heading">
        <span className="monogram" aria-hidden="true">{initials}</span>
        <div>
          <h2 id="candidate-name">{candidate.name}</h2>
          <p>{candidate.description}</p>
        </div>
      </div>
      <h3>Propuestas</h3>
      {candidate.proposals.length ? (
        <ul className="proposal-list">
          {Array.from(proposalsByTopic, ([topic, proposals]) => (
            <li className="proposal-topic" key={topic}>
              <h4>{topic}</h4>
              {proposals.map(proposal => (
                <article key={proposal.title}>
                  <h5>{proposal.title}</h5>
                  <p>{proposal.summary}</p>
                </article>
              ))}
            </li>
          ))}
        </ul>
      ) : <p>Este candidato aún no tiene propuestas publicadas.</p>}
    </section>
  );
}
