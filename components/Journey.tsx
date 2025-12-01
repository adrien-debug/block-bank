export default function Journey() {
  return (
    <section className="section" id="journey-client">
      <div className="section-header">
        <div>
          <div className="section-kicker">4. Journey</div>
          <h2>Journey complet d&apos;un client</h2>
        </div>
        <div className="section-badge">
          <span className="section-badge-dot"></span>
          <span>De l&apos;onboarding à la sortie</span>
        </div>
      </div>
      <ul className="flow-steps">
        <li>
          <div className="flow-step-index">1</div>
          <div>
            <strong>Onboarding & KYC</strong><br />
            Le client connecte son wallet, passe le KYC/KYB via un prestataire
            agréé. Il obtient un credential ou un token KYC-OK on-chain.
          </div>
        </li>
        <li>
          <div className="flow-step-index">2</div>
          <div>
            <strong>Analyse & scoring</strong><br />
            Le client relie ses wallets, fournit ses documents financiers.
            Le moteur de scoring calcule son score et mint un NFT de score.
          </div>
        </li>
        <li>
          <div className="flow-step-index">3</div>
          <div>
            <strong>Structuration de l&apos;actif</strong><br />
            L&apos;actif à financer (propriété, machines...) est logé dans une SPV
            qui émet un NFT RWA.
          </div>
        </li>
        <li>
          <div className="flow-step-index">4</div>
          <div>
            <strong>Création & activation du prêt</strong><br />
            Le smart contract de prêt est paramétré (montant, taux, durée, LTV),
            le NFT RWA est déposé en collatéral. Qatar (ou un pool) apporte la
            liquidité dans le lending pool.
          </div>
        </li>
        <li>
          <div className="flow-step-index">5</div>
          <div>
            <strong>Vie du prêt</strong><br />
            Le client rembourse périodiquement, en stablecoins. Le score peut
            être mis à jour, l&apos;actif actualisé, les primes d&apos;assurance payées.
          </div>
        </li>
        <li>
          <div className="flow-step-index">6</div>
          <div>
            <strong>Sortie positive</strong><br />
            Remboursement total du prêt, libération du NFT RWA, mise à jour du
            score (amélioration possible) et distribution des rendements à Qatar
            et aux LPs.
          </div>
        </li>
        <li>
          <div className="flow-step-index">7</div>
          <div>
            <strong>Scénario de défaut</strong><br />
            En cas de défaut, transfert automatique du NFT RWA au prêteur,
            déclenchement de l&apos;assurance, liquidation / restructuration off-chain,
            mise à jour du score de crédit (chute significative).
          </div>
        </li>
      </ul>
    </section>
  )
}


