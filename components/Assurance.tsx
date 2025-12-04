export default function Assurance() {
  return (
    <section className="section" id="module-assurance">
      <div className="section-header">
        <div>
          <div className="section-kicker">3. Assurance défaut</div>
          <h2>Protocole d&apos;assurance défaut paramétrique</h2>
        </div>
        <div className="section-badge">
          <span className="section-badge-dot"></span>
          <span>Pools de capital • Pricing • Parametrics</span>
        </div>
      </div>

      <section id="assurance-risques">
        <h3>3.1 Typologie des risques couverts</h3>
        <div className="grid-2">
          <div className="card">
            <h4>Risques principaux</h4>
            <ul>
              <li><strong>Risque de défaut de l&apos;emprunteur</strong>
                (incapacité de rembourser selon les conditions).</li>
              <li><strong>Risque de marché</strong>
                (chute de valeur rapide de l&apos;actif vs prix d&apos;achat).</li>
              <li><strong>Risque opérationnel</strong>
                (incendie, panne majeure de site de mining, etc.).</li>
              <li><strong>Risque juridique / réglementaire</strong>
                (blocage temporaire, interdiction, litige).</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Granularité</h4>
            <p>
              Chaque prêt peut souscrire une couverture partielle ou totale
              sur un ou plusieurs risques. Les primes sont ajustées selon :
            </p>
            <ul>
              <li>la tranche de score de crédit,</li>
              <li>la qualité de l&apos;actif,</li>
              <li>la juridiction,</li>
              <li>la durée du prêt et le profil d&apos;amortissement.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="assurance-architecture">
        <h3>3.2 Architecture pools & tranches</h3>
        <div className="grid-2">
          <div className="card">
            <h4>Types de pools</h4>
            <ul>
              <li><strong>Primary Pool (institutionnel)</strong>
                <ul>
                  <li>Capital fourni par Qatar ou grandes institutions.</li>
                  <li>Prend des expositions senior peu risquées.</li>
                  <li>Rendement modéré mais très sécurisé.</li>
                </ul>
              </li>
              <li><strong>Risk Pool (DeFi / LPs privés)</strong>
                <ul>
                  <li>Rendement plus élevé.</li>
                  <li>Supporte les premières pertes (tranche junior).</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Tranching</h4>
            <ul>
              <li><strong>Tranche senior</strong> : Qatar, faible probabilité de perte.</li>
              <li><strong>Tranche mezzanine</strong> : investisseurs cherchant
                  du rendement supérieur avec risque modéré.</li>
              <li><strong>Tranche junior</strong> : LPs crypto, capture maximale
                  des primes, encaisse premières pertes.</li>
            </ul>
            <div className="highlight">
              Ce modèle permet d&apos;aligner des profils de risque/rendement très
              différents au sein de la même plateforme.
            </div>
          </div>
        </div>
      </section>

      <section id="assurance-parametric">
        <h3>3.3 Déclencheurs paramétriques</h3>
        <p>
          Le protocole d&apos;assurance repose sur des déclencheurs purement
          paramétriques, codés dans les smart contracts, pour éviter les décisions
          subjectives ou politisées.
        </p>
        <div className="grid-2">
          <div className="card">
            <h4>Examples de triggers</h4>
            <ul>
              <li><strong>Défaut financier</strong>
                <ul>
                  <li>N échéances consécutives non payées.</li>
                  <li>Balance du compte client &lt; X % de l&apos;échéance pendant Y jours.</li>
                </ul>
              </li>
              <li><strong>Actifs de mining</strong>
                <ul>
                  <li>Hashrate &lt; seuil critique pendant une durée prolongée.</li>
                  <li>Arrêt complet du site pour cause de sinistre.</li>
                </ul>
              </li>
              <li><strong>Marché</strong>
                <ul>
                  <li>Chute du prix de l&apos;actif &gt; 40&nbsp;% vs valeurs initiales
                      sur une window définie.</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Mécanique</h4>
            <ul>
              <li>Les oracles (off-chain oracles décentralisés) fournissent les données
                  (hashrate, prix, statut opérationnel).</li>
              <li>Le smart contract vérifie les conditions à intervalle régulier.</li>
              <li>En cas de trigger, il exécute automatiquement les payouts.</li>
            </ul>
            <div className="highlight">
              Pas de comité opaque&nbsp;: les conditions de déclenchement sont
              publiques, vérifiables et identiques pour tous.
            </div>
          </div>
        </div>
      </section>

      <section id="assurance-pricing">
        <h3>3.4 Modèle de pricing & actuariat</h3>
        <p>
          La prime d&apos;assurance est fonction de la probabilité de défaut (PD),
          de la perte en cas de défaut (LGD) et de l&apos;exposition à défaut (EAD).
        </p>
        <pre><code>Prime brute ≈ PD × LGD × EAD × (1 + marge de sécurité)
Prime finale = Prime brute + frais opérationnels + marge protocole</code></pre>
        <div className="grid-2">
          <div className="card">
            <h4>Exemple chiffré (mining)</h4>
            <ul>
              <li>Montant du prêt (EAD) = 100 000 USD</li>
              <li>PD estimée = 7 %</li>
              <li>LGD estimée = 40 % (après saisie & revente machines)</li>
            </ul>
            <p>
              Prime brute = 0,07 × 0,40 × 100 000 = <strong>2 800 USD</strong>.<br />
              Avec marge de 10&nbsp;% + frais = ~<strong>3 080 USD/an</strong>.
            </p>
          </div>
          <div className="card card-muted">
            <h4>Évolution dynamique</h4>
            <ul>
              <li>Les PD & LGD sont recalibrées en continu sur base des défauts réels.</li>
              <li>Les primes peuvent être revues à la hausse ou à la baisse selon :
                <ul>
                  <li>la distribution de scores dans le portefeuille,</li>
                  <li>la conjoncture macro (prix BTC, taux, inflation),</li>
                  <li>les corrélations entre actifs.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="assurance-dyn">
        <h3>3.5 Dynamiques de pools & scénarios</h3>
        <div className="grid-2">
          <div className="card">
            <h4>Entrées & sorties des pools</h4>
            <ul>
              <li><strong>Entrées</strong>
                <ul>
                  <li>Primes payées par les emprunteurs ou par les prêteurs.</li>
                  <li>Capital injecté par Qatar et LPs.</li>
                  <li>Rendements de placements temporaires.</li>
                </ul>
              </li>
              <li><strong>Sorties</strong>
                <ul>
                  <li>Payouts d&apos;assurance en cas de défaut.</li>
                  <li>Rachats de parts (LPs sortants).</li>
                  <li>Distribution de rendement aux participants.</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Scénarios</h4>
            <ul>
              <li><strong>Scénario normal</strong> : défauts contenus, les primes
                  couvrent largement les indemnités → rendement positif.</li>
              <li><strong>Scénario stress</strong> : vague de défauts, utilisation
                  des réserves, perte éventuelle sur la tranche junior.</li>
              <li><strong>Scénario extrême</strong> : crise systémique (macro),
                  possible haircut partiel sur la tranche mezzanine.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="assurance-qatar">
        <h3>3.6 Offre typée pour Qatar</h3>
        <div className="grid-3">
          <div className="card">
            <h4>Tranche senior</h4>
            <ul>
              <li>Destinée à Qatar & institutions AAA.</li>
              <li>Exposition sur les prêts A+/A principalement.</li>
              <li>Couverture supplémentaire par junior / mezzanine.</li>
              <li>Rendement cible&nbsp;: 6–10&nbsp;% / an.</li>
            </ul>
          </div>
          <div className="card">
            <h4>Tranche mezzanine</h4>
            <ul>
              <li>Investisseurs cherchant rendement intermédiaire.</li>
              <li>Protégée partiellement par tranche junior.</li>
              <li>Rendement cible&nbsp;: 12–18&nbsp;% / an.</li>
            </ul>
          </div>
          <div className="card">
            <h4>Tranche junior</h4>
            <ul>
              <li>LPs crypto, hedge funds, family offices risqués.</li>
              <li>Encaisse la majorité des primes et des premières pertes.</li>
              <li>Rendement cible&nbsp;: 20–30&nbsp;% / an (variable).</li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  )
}









