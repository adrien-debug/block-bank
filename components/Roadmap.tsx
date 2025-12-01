export default function Roadmap() {
  return (
    <section className="section" id="roadmap">
      <div className="section-header">
        <div>
          <div className="section-kicker">5. Roadmap</div>
          <h2>Roadmap de déploiement</h2>
        </div>
        <div className="section-badge">
          <span className="section-badge-dot"></span>
          <span>De MVP à déploiement institutionnel</span>
        </div>
      </div>
      <div className="grid-3">
        <div className="card">
          <h4>Phase 1 — Prototype</h4>
          <ul>
            <li>Choix de la chaîne (L2 EVM, stable & peu coûteuse).</li>
            <li>Intégration d&apos;un provider KYC + identité on-chain.</li>
            <li>Premier modèle de score (règles + sous-scores de base).</li>
            <li>Smart contracts de prêt & NFT RWA rudimentaires.</li>
            <li>Pilote interne avec quelques deals miniers.</li>
          </ul>
        </div>
        <div className="card">
          <h4>Phase 2 — Pilote Qatar</h4>
          <ul>
            <li>Structuration légale détaillée avec un cabinet local.</li>
            <li>Deals pilotes (5–10) sur actifs bien maîtrisés.</li>
            <li>Monitoring intensif des performances & défauts.</li>
            <li>Amélioration du moteur de scoring et du pricing assurance.</li>
          </ul>
        </div>
        <div className="card">
          <h4>Phase 3 — Scale & multi-actifs</h4>
          <ul>
            <li>Extension à d&apos;autres types d&apos;actifs (immobilier, infra).</li>
            <li>Ouverture à co-investisseurs institutionnels.</li>
            <li>Tranching complet (senior / mezz / junior).</li>
            <li>API & dashboards pour Qatar et partenaires bancaires.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

