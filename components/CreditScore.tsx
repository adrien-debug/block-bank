export default function CreditScore() {
  return (
    <section className="section" id="module-credit-score">
      <div className="section-header">
        <div>
          <div className="section-kicker">1. Moteur de credit score</div>
          <h2>Moteur de credit score hybride on-chain / off-chain</h2>
        </div>
        <div className="section-badge">
          <span className="section-badge-dot"></span>
          <span>0–1000 • Tranches A+ à D</span>
        </div>
      </div>

      <section id="cs-architecture">
        <h3>1.1 Architecture générale</h3>
        <p>
          Le moteur de credit score est un <strong>Composite Risk Index</strong>
          qui agrège quatre dimensions principales&nbsp;:
        </p>
        <div className="grid-2">
          <div className="card">
            <ul>
              <li><strong>A. On-Chain Behavioral Analytics</strong> (30–45&nbsp;% du score)</li>
              <li><strong>B. Off-Chain Financial & Corporate Metrics</strong> (30–40&nbsp;%)</li>
              <li><strong>C. Asset-Based Metrics (RWA)</strong> (10–20&nbsp;%)</li>
              <li><strong>D. Reputation & Trust Layer</strong> (5–10&nbsp;%)</li>
            </ul>
            <p>
              Chacune de ces dimensions produit un sous-score normalisé qui est ensuite
              agrégé en un score final, avec pondération configurable par marché, par
              type d&apos;actif et par cycle macro-économique.
            </p>
          </div>
          <div className="card card-muted">
            <h4>Data pipeline</h4>
            <ul>
              <li><strong>Collecte</strong> : données on-chain (EVM, BTC, etc.) + données bancaires + documents légaux.</li>
              <li><strong>Normalisation</strong> : mapping par client et par &quot;cluster de wallets&quot;.</li>
              <li><strong>Feature engineering</strong> : création de variables de risque (volatilité, stabilité, dette).</li>
              <li><strong>Scoring</strong> : modèles statistiques ou ML (logit, XGBoost, etc.).</li>
              <li><strong>Tokenisation</strong> : mint d&apos;un NFT de score (Soulbound).</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="cs-onchain">
        <h3>1.2 On-chain Behavioral Analytics (30–45&nbsp;%)</h3>
        <p>
          L&apos;objectif est d&apos;extraire du comportement on-chain une mesure
          de discipline, de sophistication et de risque pris par le client.
        </p>
        <div className="grid-2">
          <div className="card">
            <h4>Dimensions analysées</h4>
            <ul>
              <li><strong>Flux entrants/sortants</strong> (stabilité, régularité, grosses variations).</li>
              <li><strong>Diversité des actifs</strong> (stablecoins, BTC, ETH, altcoins, shitcoins).</li>
              <li><strong>Volatilité de portefeuille</strong> (mesurée par type d&apos;actif et corrélations).</li>
              <li><strong>Stabilité en stablecoins</strong> (proportion de réserves en actifs stables).</li>
              <li><strong>Utilisation DeFi</strong> (lending, borrowing, LP, leverage, perp, options).</li>
              <li><strong>Historique de liquidations</strong> (fréquence, intensité, récence).</li>
              <li><strong>Ancienneté des wallets</strong> et consistance des comportements.</li>
              <li><strong>Sybil & fraude</strong> (clustering de wallets liés, patterns de wash trading).</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Techniques</h4>
            <ul>
              <li>Graph ML (clustering d&apos;adresses, détection de communautés).</li>
              <li>Analyse Markovienne de transitions de portefeuille.</li>
              <li>Détection de patterns extrêmes (anomalies de levier, activité soudaine).</li>
              <li>Scoring positif pour&nbsp;:
                <ul>
                  <li>absence de liquidations significatives,</li>
                  <li>ratio stablecoins &gt; X&nbsp;% dans les périodes de stress,</li>
                  <li>historique de staking / savings soutenus.</li>
                </ul>
              </li>
            </ul>
            <div className="highlight">
              Sortie&nbsp;: <strong>On-Chain Reliability Score</strong> (0–300),
              qui mesure la &quot;maturité&quot; et la &quot;fiabilité&quot; financière du client
              sur la blockchain.
            </div>
          </div>
        </div>
      </section>

      <section id="cs-offchain">
        <h3>1.3 Off-chain Financial & Corporate Metrics (30–40&nbsp;%)</h3>
        <div className="grid-2">
          <div className="card">
            <h4>Clients particuliers</h4>
            <ul>
              <li><strong>Revenus</strong> (montant, source, stabilité sur 3–12 mois).</li>
              <li><strong>Ratio dette / revenu</strong> (avant et après nouveau prêt).</li>
              <li><strong>Historique bancaire</strong> (incidents, découvert, retards).</li>
              <li><strong>Patrimoine</strong> (épargne, immobilier, portefeuilles externes).</li>
              <li><strong>Historique fiscal</strong> (cohérence revenus / style de vie).</li>
              <li><strong>Pays de résidence</strong> (risque juridique, politique, devise).</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Clients entreprises / mineurs corporate</h4>
            <ul>
              <li><strong>P&amp;L minier</strong> (revenus BTC vs coûts électricité & OPEX).</li>
              <li><strong>Coût marginal d&apos;opération</strong> & seuil de rentabilité.</li>
              <li><strong>Dépendance énergétique</strong> (un seul provider ou mix).</li>
              <li><strong>Structure de dette existante</strong> (senior, mezzanine, etc.).</li>
              <li><strong>Qualité des contrats</strong> (PPAs, baux fonciers, hébergement).</li>
              <li><strong>Réputation & historique de paiement</strong> avec fournisseurs.</li>
            </ul>
            <div className="highlight">
              Sortie&nbsp;: <strong>Off-Chain Financial Solidity Score</strong> (0–300),
              calibré par type de client (B2C, B2B, mining, infra, HNWI).
            </div>
          </div>
        </div>
      </section>

      <section id="cs-assets">
        <h3>1.4 Asset-Based Metrics (10–20&nbsp;%)</h3>
        <p>
          Ici, on évalue l&apos;actif que le client finance avec le prêt&nbsp;:
          immobilier, ferme de mining, machines, infra énergétique, etc.
        </p>
        <div className="grid-2">
          <div className="card">
            <h4>Variables clés</h4>
            <ul>
              <li><strong>Valeur de marché</strong> (oracles + évaluations indépendantes).</li>
              <li><strong>Liquidité</strong> (facilité de revente, profondeur du marché local).</li>
              <li><strong>Localisation</strong> (risque politique, juridique, climat, réglementation).</li>
              <li><strong>Dépréciation attendue</strong> (machines de mining vs immobilier prime).</li>
              <li><strong>Diversification</strong> (portefeuille d&apos;actifs vs concentration excessive).</li>
              <li><strong>Qualité de l&apos;assurance existante</strong> (incendie, catastrophe, dommage).</li>
            </ul>
          </div>
          <div className="card card-muted">
            <div className="highlight">
              Sortie&nbsp;: <strong>Asset Quality Score</strong> (0–200),
              modulé par type d&apos;actif. Une villa à Paris ultra liquide
              n&apos;est pas notée comme une usine isolée dans un pays instable.
            </div>
          </div>
        </div>
      </section>

      <section id="cs-reputation">
        <h3>1.5 Reputation & Trust Layer (5–10&nbsp;%)</h3>
        <div className="grid-2">
          <div className="card">
            <h4>Éléments utilisés</h4>
            <ul>
              <li><strong>Historique de remboursement interne</strong> (prêts passés).</li>
              <li><strong>Durée de la relation</strong> avec la plateforme.</li>
              <li><strong>Participation volontaire</strong> à des audits renforcés.</li>
              <li><strong>Usage d&apos;identités vérifiables</strong> (DID, zk-KYC).</li>
              <li><strong>Social graph Web3</strong> (facultatif, pour signaux faibles).</li>
              <li><strong>Signalement éventuel</strong> par d&apos;autres institutions de confiance.</li>
            </ul>
          </div>
          <div className="card card-muted">
            <div className="highlight">
              Sortie&nbsp;: <strong>Reputation Score</strong> (0–100). Ce score
              peut compenser légèrement un profil borderline mais ne remplacera
              jamais une mauvaise base financière.
            </div>
          </div>
        </div>
      </section>

      <section id="cs-score-final">
        <h3>1.6 Score final & conditions de crédit</h3>
        <p>
          Le score final va de <strong>0 à 1000</strong> et est mappé en tranches
          de risque impactant le LTV, le pricing, la durée et l&apos;accès à certaines
          structures d&apos;assurance.
        </p>
        <div className="score-scale">
          <div className="score-segment">
            <strong>A+</strong>
            <span>Score &gt;= 850</span>
            <span>Risque ultra faible, clients premium.</span>
          </div>
          <div className="score-segment">
            <strong>A</strong>
            <span>750–849</span>
            <span>Risque faible, conditions très favorables.</span>
          </div>
          <div className="score-segment">
            <strong>B</strong>
            <span>600–749</span>
            <span>Risque moyen, LTV modéré.</span>
          </div>
          <div className="score-segment">
            <strong>C</strong>
            <span>450–599</span>
            <span>Risque élevé, LTV limité.</span>
          </div>
          <div className="score-segment">
            <strong>D</strong>
            <span>&lt; 450</span>
            <span>Risque très élevé, crédit refusé ou collatéral quasi total.</span>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Tranche</th>
              <th>Score</th>
              <th>LTV max</th>
              <th>Taux indicatif</th>
              <th>Accès assurance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="badge-risk"><span className="dot-green" style={{width:'7px',height:'7px',borderRadius:'50%'}}></span> A+</span></td>
              <td>&gt;= 850</td>
              <td>70–85&nbsp;%</td>
              <td>Bas (+ prime de liquidité réduite)</td>
              <td>Tranche senior + junior possible</td>
            </tr>
            <tr>
              <td><span className="badge-risk"><span className="dot-green" style={{width:'7px',height:'7px',borderRadius:'50%'}}></span> A</span></td>
              <td>750–849</td>
              <td>60–70&nbsp;%</td>
              <td>Bas / médian</td>
              <td>Senior standard</td>
            </tr>
            <tr>
              <td><span className="badge-risk"><span className="dot-yellow" style={{width:'7px',height:'7px',borderRadius:'50%'}}></span> B</span></td>
              <td>600–749</td>
              <td>40–60&nbsp;%</td>
              <td>Normal / légèrement augmenté</td>
              <td>Senior + mezzanine</td>
            </tr>
            <tr>
              <td><span className="badge-risk"><span className="dot-yellow" style={{width:'7px',height:'7px',borderRadius:'50%'}}></span> C</span></td>
              <td>450–599</td>
              <td>30–40&nbsp;%</td>
              <td>Élevé</td>
              <td>Mezzanine uniquement</td>
            </tr>
            <tr>
              <td><span className="badge-risk"><span className="dot-red" style={{width:'7px',height:'7px',borderRadius:'50%'}}></span> D</span></td>
              <td>&lt; 450</td>
              <td>&lt; 30&nbsp;% ou 100&nbsp;% collat.</td>
              <td>Non pertinent</td>
              <td>Pas de couverture / cas spéciaux</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="cs-tokenisation">
        <h3>1.7 Tokenisation & NFT de score</h3>
        <p>
          Le score est encapsulé dans un <strong>Soulbound NFT</strong> non transférable
          attaché à l&apos;identité on-chain du client.
        </p>
        <div className="grid-2">
          <div className="card">
            <h4>Contenu du NFT de score</h4>
            <ul>
              <li>Score global (0–1000).</li>
              <li>Tranche (A+, A, B, C, D).</li>
              <li>Détails synthétiques&nbsp;: sous-scores A/B/C/D.</li>
              <li>Version du modèle de scoring.</li>
              <li>Timestamp d&apos;émission & validité.</li>
              <li>Hash des données sources (off-chain) pour audit.</li>
              <li>Référence à la vérification KYC / AML.</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Accès par les autres modules</h4>
            <ul>
              <li>Les contrats de prêt lisent directement ce NFT pour décider des LTV.</li>
              <li>Les pools d&apos;assurance utilisent le score pour tarifer la prime.</li>
              <li>Qatar et co-investisseurs peuvent auditer anonymement les portefeuilles
                  par distribution de scores (sans voir les identités).</li>
            </ul>
            <div className="highlight">
              Le NFT joue un rôle de &quot;passeport de risque&quot; portable entre
              différents produits de crédit du protocole.
            </div>
          </div>
        </div>
      </section>

      <section id="cs-kpi">
        <h3>1.8 KPIs, gouvernance & auditabilité</h3>
        <div className="grid-2">
          <div className="card">
            <h4>KPIs de performance</h4>
            <ul>
              <li>Taux de défaut par tranche de score.</li>
              <li>Loss Given Default réelle vs attendue.</li>
              <li>Stabilité du score (volatilité des révisions).</li>
              <li>Taux de migration entre tranches (B → A, etc.).</li>
              <li>Impact macro (cycles BTC, taux, géopolitique) sur les défauts.</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Gouvernance & audits</h4>
            <ul>
              <li>Documentation détaillée du modèle de scoring.</li>
              <li>Audit externe par cabinet de risk / Big Four.</li>
              <li>Journalisation des changements de paramètres (Pondérations, cut-offs).</li>
              <li>Backtesting récurrent vs base de prêts réalisée.</li>
            </ul>
            <p style={{fontSize:'0.85rem'}}>
              Le modèle ne reste pas figé : il est versionné, testé,
              et ajusté selon la réalité terrain tout en restant stable
              pour ne pas être arbitraire.
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}







