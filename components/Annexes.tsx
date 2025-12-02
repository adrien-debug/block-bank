export default function Annexes() {
  return (
    <section className="section" id="annexes">
      <div className="section-header">
        <div>
          <div className="section-kicker">6. Annexes</div>
          <h2>Annexes & variantes possibles</h2>
        </div>
        <div className="section-badge">
          <span className="section-badge-dot"></span>
          <span>Options & évolutions futures</span>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <h4>Extensions possibles</h4>
          <div className="chip-row">
            <div className="chip">Marché secondaire de parts de prêts</div>
            <div className="chip">Tokenisation de portefeuilles entiers</div>
            <div className="chip">Structures Sharia-compliant</div>
            <div className="chip">Bridge vers banques locales</div>
            <div className="chip">Intégration de scoring ESG</div>
          </div>
          <p>
            À terme, le protocole peut devenir une &quot;place de marché&quot;
            pour le risque de crédit tokenisé, avec Qatar comme ancrage
            senior et d&apos;autres acteurs sur les tranches plus risquées.
          </p>
        </div>
        <div className="card card-muted">
          <h4>Points de vigilance</h4>
          <ul>
            <li>Complexité réglementaire multi-pays.</li>
            <li>Alignement strict des contrats on-chain et des contrats papier.</li>
            <li>Qualité et indépendance des oracles (prix, hashrate, opérations).</li>
            <li>Gouvernance du protocole (qui décide des paramètres).</li>
          </ul>
          <p>
            Ces aspects n&apos;empêchent pas le lancement, mais doivent être monitorés
            en permanence avec des partenaires spécialisés (juristes, auditeurs,
            risk managers).
          </p>
        </div>
      </div>
    </section>
  )
}






