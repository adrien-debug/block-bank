'use client'

import { useState } from 'react'
import { AssetType } from '@/types'

interface TermsAndConditionsProps {
  assetType: AssetType
  onAccept: () => void
  onReject: () => void
}

export default function TermsAndConditions({
  assetType,
  onAccept,
  onReject,
}: TermsAndConditionsProps) {
  const [accepted, setAccepted] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  const getTermsDocument = () => {
    switch (assetType) {
      case 'REAL_ESTATE':
        return '/docs/TERMS_IMMOBILIER.md'
      case 'MINING':
      case 'INFRASTRUCTURE':
      case 'COMMODITIES':
      case 'OTHER':
        return '/docs/TERMS_OBJETS.md'
      default:
        return '/docs/LEGAL_FRAMEWORK.md'
    }
  }

  const getAssetTypeName = () => {
    switch (assetType) {
      case 'REAL_ESTATE':
        return 'Immobilier'
      case 'MINING':
        return 'Équipement de Mining'
      case 'INFRASTRUCTURE':
        return 'Infrastructure'
      case 'COMMODITIES':
        return 'Métaux Précieux / Commodités'
      case 'OTHER':
        return 'Autres Biens Meubles'
      default:
        return 'Actif'
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50
    if (isBottom) {
      setScrolledToBottom(true)
    }
  }

  return (
    <div className="terms-modal">
      <div className="terms-content">
        <div className="terms-header">
          <h2>Termes et Conditions - Prêt Collatéralisé par NFT RWA</h2>
          <p className="terms-subtitle">Type d&apos;actif : {getAssetTypeName()}</p>
        </div>

        <div className="terms-body" onScroll={handleScroll}>
          <div className="terms-section">
            <h3>1. Acceptation des Conditions</h3>
            <p>
              En acceptant ces termes et conditions, vous reconnaissez avoir lu,
              compris et accepté toutes les conditions de prêt, y compris :
            </p>
            <ul>
              <li>Les conditions de paiement et d&apos;intérêts</li>
              <li>Les obligations de maintenance et d&apos;entretien</li>
              <li>Les processus de défaut et de récupération</li>
              <li>Les frais et coûts associés</li>
              <li>Les risques liés au prêt</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>2. Conditions de Prêt</h3>
            <p>
              Le prêt est accordé sous réserve de :
            </p>
            <ul>
              <li>Paiement minimum selon remise NFT RWA (10%, 15% ou 20%)</li>
              <li>Respect du LTV (Loan-to-Value) maximum selon votre Credit Score</li>
              <li>Taux d&apos;intérêt variable selon profil de risque</li>
              <li>Durée de 12 à 48 mois selon profil sélectionné</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>3. Obligations de l&apos;Emprunteur</h3>
            <p>Vous vous engagez à :</p>
            <ul>
              <li>Effectuer les paiements mensuels dans les délais</li>
              <li>Maintenir l&apos;actif en bon état</li>
              <li>Souscrire les assurances requises</li>
              <li>Notifier tout changement significatif</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>4. Processus de Défaut et Récupération</h3>
            <p>
              En cas de défaut de paiement supérieur à 30 jours :
            </p>
            <ul>
              <li>Notification formelle avec délai de régularisation</li>
              <li>Déclenchement de la procédure de récupération</li>
              <li>Saisie et vente de l&apos;actif selon juridiction</li>
              <li>Application des frais de récupération</li>
            </ul>
            <p className="terms-warning">
              ⚠️ Les délais et processus varient selon la juridiction de l&apos;actif.
              Consultez le document complet pour les détails spécifiques.
            </p>
          </div>

          <div className="terms-section">
            <h3>5. Système de Remises NFT RWA</h3>
            <p>
              Des remises de 10%, 15% ou 20% sont applicables selon :
            </p>
            <ul>
              <li>Le niveau de risque du NFT (SAFE, MODERATE, RISKY)</li>
              <li>Votre Credit Score BlockBank</li>
              <li>Le type d&apos;actif</li>
            </ul>
            <p>
              Les remises réduisent le LTV effectif et peuvent réduire les taux
              d&apos;intérêt et les primes d&apos;assurance.
            </p>
          </div>

          <div className="terms-section">
            <h3>6. Frais et Coûts</h3>
            <ul>
              <li>Frais de dossier : 0.5% - 1% du montant prêt</li>
              <li>Frais d&apos;évaluation : Variable selon type d&apos;actif</li>
              <li>Frais de gestion : 0.1% par an</li>
              <li>Frais de récupération : Variable selon juridiction</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>7. Limitation de Responsabilité</h3>
            <p>
              Le prêteur n&apos;est pas responsable des pertes liées à :
            </p>
            <ul>
              <li>La dépréciation de l&apos;actif</li>
              <li>Les risques de marché</li>
              <li>Les dommages non couverts par l&apos;assurance</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>8. Loi Applicable et Juridiction</h3>
            <p>
              Ces termes sont régis par la législation de la juridiction où se
              trouve l&apos;actif. Tout litige sera résolu selon les procédures
              prévues dans le document complet des termes et conditions.
            </p>
          </div>

          <div className="terms-section">
            <h3>9. Documents Complets</h3>
            <p>
              Pour consulter les termes et conditions complets spécifiques à votre
              type d&apos;actif, veuillez consulter :
            </p>
            <ul>
              <li>
                <a href="/docs/LEGAL_FRAMEWORK.md" target="_blank" rel="noopener noreferrer">
                  Cadre Juridique Complet
                </a>
              </li>
              {assetType === 'REAL_ESTATE' && (
                <li>
                  <a href="/docs/TERMS_IMMOBILIER.md" target="_blank" rel="noopener noreferrer">
                    Termes et Conditions - Immobilier
                  </a>
                </li>
              )}
              {(assetType === 'MINING' ||
                assetType === 'INFRASTRUCTURE' ||
                assetType === 'COMMODITIES' ||
                assetType === 'OTHER') && (
                <li>
                  <a href="/docs/TERMS_OBJETS.md" target="_blank" rel="noopener noreferrer">
                    Termes et Conditions - Objets et Biens Meubles
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="terms-footer-note">
            <p>
              <strong>Note importante :</strong> Ces termes et conditions sont un
              résumé. Le document complet contient tous les détails légaux, les
              processus de récupération par juridiction, et les spécificités par
              type d&apos;actif. Il est fortement recommandé de consulter le
              document complet avant d&apos;accepter.
            </p>
          </div>
        </div>

        <div className="terms-actions">
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="accept-terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              disabled={!scrolledToBottom}
            />
            <label htmlFor="accept-terms">
              {scrolledToBottom
                ? "J'ai lu et j'accepte les termes et conditions"
                : 'Veuillez faire défiler jusqu\'en bas pour accepter'}
            </label>
          </div>
          <div className="terms-buttons">
            <button
              type="button"
              onClick={onReject}
              className="btn-secondary"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={onAccept}
              disabled={!accepted || !scrolledToBottom}
              className="btn-primary"
            >
              Accepter et Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

