import Section from './ui/Section'
import Card from './ui/Card'
import Grid from './ui/Grid'

export default function Vision() {
  return (
    <Section
      id="vision"
      kicker="0. Vision"
      title="Vision & principes directeurs"
      badge="Infra bancaire on-chain institutionnelle"
    >
      <p>
        L&apos;objectif est de créer une infrastructure complète de crédit on-chain,
        pensée comme une banque de crédit spécialisée dans les actifs réels
        (immobilier, infrastructures, équipements industriels, machines de mining,
        etc.) et alimentée par une capacité minière Bitcoin existante (~3&nbsp;EH/s).
      </p>
      <Grid cols={2} className="mt-2">
        <Card>
          <h3>Principes fondamentaux</h3>
          <ul>
            <li><strong>Transparence totale on-chain</strong> des engagements, risques, flux et collatéraux.</li>
            <li><strong>Sous-collatéralisation contrôlée</strong> : le protocole accepte le risque, mais de façon quantitative et pilotée.</li>
            <li><strong>Nantissement réel</strong> via NFT RWA, donnant un droit exécutoire sur des actifs concrets.</li>
            <li><strong>Assurance mutualisée</strong> pour absorber les défauts, rendre l&apos;exposition attractive pour un fonds souverain.</li>
            <li><strong>Compatibilité réglementaire</strong> et possibilité de déclinaisons Sharia-compliant.</li>
          </ul>
        </Card>
        <Card muted>
          <h3>Rôle de chaque pilier</h3>
          <ul>
            <li><strong>Moteur de credit score</strong> : évalue la probabilité de défaut globale d&apos;un client/actif.</li>
            <li><strong>NFT de nantissement</strong> : matérialise et sécurise la valeur sous-jacente on-chain.</li>
            <li><strong>Assurance paramétrique</strong> : mutualise et rémunère le risque, sécurise Qatar & co-investisseurs.</li>
          </ul>
          <div className="highlight">
            La combinaison des trois modules transforme un flux de crédit
            complexe et multi-juridictionnel en un système paramétrable,
            auditable et pilotable en temps réel.
          </div>
        </Card>
      </Grid>
    </Section>
  )
}

