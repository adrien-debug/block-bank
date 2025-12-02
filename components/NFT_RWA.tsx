export default function NFT_RWA() {
  return (
    <section className="section" id="module-nft-rwa">
      <div className="section-header">
        <div>
          <div className="section-kicker">2. NFT & RWA</div>
          <h2>Système de nantissement via NFT RWA</h2>
        </div>
        <div className="section-badge">
          <span className="section-badge-dot"></span>
          <span>SPV • Tokenisation • Enforcement</span>
        </div>
      </div>

      <section id="rwa-legal">
        <h3>2.1 Architecture légale & SPV</h3>
        <p>
          Le cœur du modèle RWA repose sur une chaîne de propriété claire :
          <strong>Actif réel → SPV → NFT RWA → Prêt</strong>. La SPV détient
          l&apos;actif et l&apos;émetteur du NFT, ce qui permet de relier le monde légal
          au monde on-chain.
        </p>
        <div className="grid-2">
          <div className="card">
            <h4>Rôle de la SPV</h4>
            <ul>
              <li>Être l&apos;entité légale propriétaire de l&apos;actif (titre, registre, etc.).</li>
              <li>Signer les contrats avec l&apos;emprunteur (bail, crédit-bail, etc.).</li>
              <li>Émettre le NFT RWA représentant la &quot;beneficial ownership claim&quot;.</li>
              <li>Définir contractuellement que <em>le détenteur du NFT</em> a droit aux flux.</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Variantes de structuration</h4>
            <ul>
              <li>SPV par projet (grands actifs / deals structurés).</li>
              <li>SPV mutualisée par pays ou catégorie d&apos;actifs.</li>
              <li>Partenariats avec des entités régulées locales (banques, custodians).</li>
            </ul>
            <div className="highlight">
              La structuration SPV est critique pour que la saisie de l&apos;actif
              soit viable et reconnue par les tribunaux locaux en cas de défaut.
            </div>
          </div>
        </div>
      </section>

      <section id="rwa-nft-structure">
        <h3>2.2 Structure du NFT RWA</h3>
        <p>
          Le NFT RWA est le &quot;jumeau numérique&quot; de l&apos;actif physique. Il ne s&apos;agit
          pas nécessairement d&apos;un droit de propriété au sens cadastral, mais d&apos;un
          droit économique contractuellement valide.
        </p>
        <div className="grid-2">
          <div className="card">
            <h4>Metadata & informations clés</h4>
            <ul>
              <li>ID unique du NFT.</li>
              <li>Référence SPV (juridiction, forme, registre).</li>
              <li>Type d&apos;actif (immobilier, machine de mining, infra énergie).</li>
              <li>Valeur estimée initiale & date d&apos;évaluation.</li>
              <li>Documentations (hash vers IPFS / storage chiffré).</li>
              <li>État de l&apos;actif (inspection, maintenance, vétusté).</li>
              <li>Paramètres d&apos;hypothèque / de gage intégrés.</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Fonctions du NFT</h4>
            <ul>
              <li><strong>Lockable</strong> en collatéral dans un smart contract de prêt.</li>
              <li><strong>Transférable sous condition</strong> (défaut, refinancement, vente).</li>
              <li><strong>Updatable</strong> pour refléter la nouvelle valeur, l&apos;état, la maintenance.</li>
              <li><strong>Soulbound optionnel</strong> dans certaines structures (p. ex. concessions).</li>
            </ul>
            <div className="highlight">
              Le contrat de prêt interagit directement avec le NFT pour vérifier
              que l&apos;actif est correctement immobilisé avant tout décaissement.
            </div>
          </div>
        </div>
      </section>

      <section id="rwa-flow">
        <h3>2.3 Flow complet de nantissement</h3>
        <p className="flow-label">Étapes principales</p>
        <ul className="flow-steps">
          <li>
            <div className="flow-step-index">1</div>
            <div>
              <strong>Création de la SPV & acquisition de l&apos;actif</strong><br />
              La SPV achète l&apos;actif, enregistre le titre légalement, obtient
              les documents (notariés, cadastre, etc.).
            </div>
          </li>
          <li>
            <div className="flow-step-index">2</div>
            <div>
              <strong>Émission du NFT RWA</strong><br />
              La SPV émet un NFT décrivant l&apos;actif, avec lien contractuel
              entre détention du NFT et droit économique.
            </div>
          </li>
          <li>
            <div className="flow-step-index">3</div>
            <div>
              <strong>Création du contrat de prêt</strong><br />
              Le protocole crée un smart contract de prêt qui exige que le NFT
              soit déposé en collatéral et que le score du client soit suffisant.
            </div>
          </li>
          <li>
            <div className="flow-step-index">4</div>
            <div>
              <strong>Locking du NFT</strong><br />
              Le NFT est transféré en escrow dans le smart contract de prêt.
              L&apos;actif ne peut plus être vendu tant que le prêt n&apos;est pas remboursé
              ou refinancé.
            </div>
          </li>
          <li>
            <div className="flow-step-index">5</div>
            <div>
              <strong>Vie du prêt & mises à jour</strong><br />
              Le client rembourse selon l&apos;échéancier. Le NFT peut être mis à jour
              (valeur, état) par la SPV ou un oracle certifié.
            </div>
          </li>
          <li>
            <div className="flow-step-index">6</div>
            <div>
              <strong>Remboursement intégral</strong><br />
              À la fin du prêt, le contrat libère le NFT et le renvoie au client
              ou à la SPV, selon la structure (crédit-bail, propriété directe, etc.).
            </div>
          </li>
          <li>
            <div className="flow-step-index">7</div>
            <div>
              <strong>Défaut</strong><br />
              En cas de défaut avéré (critères paramétriques), le contrat transfère
              le NFT au bénéficiaire (Qatar / entité prêteuse) et déclenche la logique
              d&apos;assurance.
            </div>
          </li>
        </ul>
      </section>

      <section id="rwa-enforcement">
        <h3>2.4 Enforcement & exécution</h3>
        <div className="grid-2">
          <div className="card">
            <h4>Logique contractuelle clé</h4>
            <ul>
              <li>Contrat légal stipulant que <em>le détenteur du NFT</em> a droit aux cash-flows.</li>
              <li>Procédure de saisie codifiée dans les statuts de la SPV.</li>
              <li>Reconnaissance du smart contract comme mécanisme de mise en gage.</li>
              <li>Possibilité de vente rapide de l&apos;actif pour couvrir le principal.</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Partie on-chain</h4>
            <ul>
              <li>Le smart contract vérifie les conditions de défaut.</li>
              <li>À défaut, transfert automatique du NFT à la SPV du prêteur.</li>
              <li>Log des événements on-chain = preuve pour les tribunaux.</li>
            </ul>
            <div className="highlight">
              On-chain, la logique est <strong>immédiate et déterministe</strong>.
              Off-chain, la SPV agit selon un protocole légal prédéfini aligné
              sur cette logique.
            </div>
          </div>
        </div>
      </section>

      <section id="rwa-cas-usage">
        <h3>2.5 Cas d&apos;usage : immobilier, mining, infrastructures</h3>
        <div className="grid-3">
          <div className="card">
            <h4>Immobilier résidentiel / commercial</h4>
            <ul>
              <li>Appartements, villas, bureaux &quot;prime&quot;.</li>
              <li>SPV propriétaire, bail ou contrat d&apos;achat différé.</li>
              <li>NFT = droit économique + droit de saisie.</li>
              <li>LTV typique&nbsp;: 50–75&nbsp;% selon marché.</li>
            </ul>
          </div>
          <div className="card">
            <h4>Mining Bitcoin (machines & sites)</h4>
            <ul>
              <li>Machines ASIC, racks, containers, fermes.</li>
              <li>Contrats électricité, hébergement, terrain.</li>
              <li>NFT = bundle &quot;machines + contrats&quot;.</li>
              <li>LTV typique&nbsp;: 30–60&nbsp;% (dépréciation rapide).</li>
            </ul>
          </div>
          <div className="card">
            <h4>Infrastructures (énergie, data centers, etc.)</h4>
            <ul>
              <li>Sites de production ou de distribution.</li>
              <li>Long-term offtake agreements (PPAs).</li>
              <li>NFT = droit économique sur les flux & actifs.</li>
              <li>LTV typique&nbsp;: 40–70&nbsp;%.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="rwa-qatar">
        <h3>2.6 Spécificités pour Qatar & fonds souverains</h3>
        <div className="grid-2">
          <div className="card">
            <h4>Avantages pour Qatar</h4>
            <ul>
              <li>Visibilité temps réel sur les actifs financés.</li>
              <li>Possibilité de choisir expositions par type d&apos;actif / région.</li>
              <li>Compatibilité avec stratégies infra & énergie long terme.</li>
              <li>Bridge vers des structures Sharia-compliant.</li>
            </ul>
          </div>
          <div className="card card-muted">
            <h4>Exigences adressées</h4>
            <ul>
              <li>Traçabilité intégrale du collatéral.</li>
              <li>Process de saisie clair, codifié.</li>
              <li>Réduction du risque opérationnel via assurance & co-investisseurs.</li>
              <li>Alignement entre contrats on-chain et off-chain.</li>
            </ul>
          </div>
        </div>
      </section>
    </section>
  )
}






