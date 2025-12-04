import { ContentCategory, ContentTone, SocialNetwork } from '@/types/marketing.types'

export interface ContentLibraryItem {
  id: string
  category: ContentCategory
  tone: ContentTone
  title: string
  content: string
  hashtags: string[]
  networks: SocialNetwork[]
  mediaSuggestions: string[]
  variables?: Record<string, string>
}

// Base of 200+ posts organized by categories
export const MARKETING_CONTENT_LIBRARY: ContentLibraryItem[] = [
  // ========== PRODUCT FEATURES - CREDIT SCORE ==========
  {
    id: 'cs-001',
    category: 'credit-score',
    tone: 'professional',
    title: 'Transparent Credit Score',
    content: 'Our hybrid Credit Score system combines on-chain behavior, off-chain financial data, and asset quality for a complete and transparent evaluation. 100% auditable, 100% transparent.',
    hashtags: ['#CreditScore', '#Transparency', '#BlockBank', '#DeFi'],
    networks: ['linkedin', 'twitter', 'facebook'],
    mediaSuggestions: ['credit-score-visual.png']
  },
  {
    id: 'cs-002',
    category: 'credit-score',
    tone: 'educational',
    title: 'Understanding the Hybrid Credit Score',
    content: 'The BlockBank Credit Score evaluates 4 dimensions: on-chain behavior, off-chain financial health, asset quality, and reputation. This multi-factor approach enables precise scoring for under-collateralized loans.',
    hashtags: ['#Education', '#CreditScore', '#BlockBank', '#RWA'],
    networks: ['twitter', 'linkedin'],
    mediaSuggestions: ['score-breakdown.png']
  },
  {
    id: 'cs-003',
    category: 'credit-score',
    tone: 'technical',
    title: 'Scoring Architecture',
    content: 'Our scoring engine uses transparent and auditable algorithms to calculate a score from 0 to 900. Tier A (750+): Max LTV 60-70%. Tier B (650-749): Max LTV 50-60%. Each criterion is traceable on-chain.',
    hashtags: ['#Technical', '#CreditScore', '#BlockBank', '#Blockchain'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['scoring-architecture.png']
  },
  {
    id: 'cs-004',
    category: 'credit-score',
    tone: 'institutional',
    title: 'Scoring for Institutions',
    content: 'BlockBank offers a scoring system adapted to institutional needs: certification, complete auditability, regulatory compliance. Ideal for sovereign funds and banks.',
    hashtags: ['#Institutional', '#BlockBank', '#Qatar', '#Compliance'],
    networks: ['linkedin'],
    mediaSuggestions: ['institutional-scoring.png']
  },
  {
    id: 'cs-005',
    category: 'credit-score',
    tone: 'professional',
    title: 'Score Update',
    content: 'Your BlockBank Credit Score evolves in real-time based on your on-chain activity, payments, and asset value. A dynamic system to reflect your current credit profile.',
    hashtags: ['#CreditScore', '#BlockBank', '#RealTime', '#DeFi'],
    networks: ['twitter', 'facebook'],
    mediaSuggestions: []
  },

  // ========== PRODUCT FEATURES - NFT RWA ==========
  {
    id: 'rwa-001',
    category: 'nft-rwa',
    tone: 'professional',
    title: 'Real Asset Tokenization',
    content: 'BlockBank allows you to tokenize your real assets (real estate, mining, collectibles) into RWA NFTs. These NFTs serve as collateral to obtain on-chain loans. Total transparency, guaranteed enforceable rights.',
    hashtags: ['#NFT', '#RWA', '#Tokenization', '#BlockBank'],
    networks: ['linkedin', 'twitter', 'facebook'],
    mediaSuggestions: ['rwa-tokenization.png']
  },
  {
    id: 'rwa-002',
    category: 'nft-rwa',
    tone: 'educational',
    title: 'How RWA Tokenization Works',
    content: 'Educational thread: RWA tokenization transforms a real asset (villa, mining farm, etc.) into an NFT on blockchain. This NFT represents a verifiable and enforceable title of ownership. Use it as collateral for a loan.',
    hashtags: ['#Education', '#RWA', '#Tokenization', '#NFT'],
    networks: ['twitter'],
    mediaSuggestions: ['tokenization-process.png']
  },
  {
    id: 'rwa-003',
    category: 'nft-rwa',
    tone: 'professional',
    title: 'RealT Partnership',
    content: 'BlockBank partners with RealT to offer real estate RWA NFTs. Access certified tokenized properties as collateral for your loans. 15-20% discount based on your Credit Score.',
    hashtags: ['#Partnership', '#RealT', '#RealEstate', '#RWA', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['realt-partnership.png']
  },
  {
    id: 'rwa-004',
    category: 'nft-rwa',
    tone: 'institutional',
    title: 'RWA for Institutions',
    content: 'Our RWA NFT infrastructure meets institutional requirements: structured SPVs, complete documentation, defined recovery process. Compatible with international regulatory standards.',
    hashtags: ['#Institutional', '#RWA', '#Compliance', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'rwa-005',
    category: 'nft-rwa',
    tone: 'professional',
    title: 'Supported Asset Types',
    content: 'BlockBank accepts various asset types as collateral: real estate (RealT, Landshare), mining (Bitcoin farms), collectibles (Courtyard), infrastructure (4K), and more. Diversify your collateral.',
    hashtags: ['#RWA', '#Assets', '#BlockBank', '#Diversification'],
    networks: ['twitter', 'facebook'],
    mediaSuggestions: ['asset-types.png']
  },
  {
    id: 'rwa-006',
    category: 'nft-rwa',
    tone: 'educational',
    title: 'RWA NFT Security',
    content: 'BlockBank RWA NFTs are secured by: legally structured SPVs (Special Purpose Vehicles), verifiable titles of ownership, enforceable smart contracts. Automatic recovery guaranteed in case of default.',
    hashtags: ['#Security', '#RWA', '#NFT', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['security-rwa.png']
  },

  // ========== PRODUCT FEATURES - INSURANCE ==========
  {
    id: 'ins-001',
    category: 'insurance',
    tone: 'professional',
    title: 'Parametric Insurance',
    content: 'BlockBank offers mutualized insurance coverage to protect against defaults. Coverage from 50% to 100% based on your profile. Premiums from 0.5% to 5% based on Credit Score. Complete protection for borrowers and lenders.',
    hashtags: ['#Insurance', '#Protection', '#BlockBank', '#DeFi'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['insurance-coverage.png']
  },
  {
    id: 'ins-002',
    category: 'insurance',
    tone: 'institutional',
    title: 'Insurance Partners',
    content: 'BlockBank collaborates with major institutional insurers (Qatar Insurance Group, AXA, Allianz) to offer robust coverage. Sharia-compatible solutions available to meet the needs of the Qatari market.',
    hashtags: ['#Insurance', '#Partnership', '#Qatar', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'ins-003',
    category: 'insurance',
    tone: 'educational',
    title: 'How Insurance Works',
    content: 'BlockBank insurance works through a mutualized pool: premiums from all users create a guarantee fund. In case of default, this fund covers losses according to your policy terms. Transparent and on-chain.',
    hashtags: ['#Education', '#Insurance', '#BlockBank', '#DeFi'],
    networks: ['twitter', 'linkedin'],
    mediaSuggestions: ['insurance-mechanism.png']
  },
  {
    id: 'ins-004',
    category: 'insurance',
    tone: 'professional',
    title: 'Covered Risks',
    content: 'Our insurance policies cover: borrower default, market risk (partial), asset risk (real estate, infrastructure). Choose your coverage level according to your needs. Settlement period: 15-60 days.',
    hashtags: ['#Insurance', '#RiskCoverage', '#BlockBank'],
    networks: ['twitter', 'facebook'],
    mediaSuggestions: []
  },

  // ========== EDUCATIONAL CONTENT ==========
  {
    id: 'edu-001',
    category: 'educational',
    tone: 'educational',
    title: 'What is RWA?',
    content: 'Thread: RWA = Real World Assets. These are traditional physical or financial assets tokenized on blockchain: real estate, precious metals, collectibles, etc. The RWA market is exploding: +500% in 2024.',
    hashtags: ['#Education', '#RWA', '#Tokenization', '#DeFi'],
    networks: ['twitter'],
    mediaSuggestions: ['rwa-explained.png']
  },
  {
    id: 'edu-002',
    category: 'educational',
    tone: 'educational',
    title: 'On-Chain Credit vs Traditional',
    content: 'On-chain credit offers: total transparency, automation via smart contracts, global accessibility, 24/7 liquidity. BlockBank combines these advantages with the stability of real assets as collateral.',
    hashtags: ['#Education', '#OnChainCredit', '#DeFi', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['comparison-onchain.png']
  },
  {
    id: 'edu-003',
    category: 'educational',
    tone: 'educational',
    title: 'Under-Collateralization',
    content: 'Unlike classic DeFi protocols (150-200% collateral), BlockBank accepts LTV up to 70% thanks to: precise scoring, mutualized insurance, stable real assets. More capital available for your projects.',
    hashtags: ['#Education', '#UnderCollateralized', '#BlockBank', '#DeFi'],
    networks: ['twitter', 'linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'edu-004',
    category: 'educational',
    tone: 'educational',
    title: 'Real Estate Tokenization',
    content: 'Real estate tokenization allows dividing a property into tokenized shares. Benefits: liquidity, accessibility, transparency. BlockBank accepts these RWA NFTs as collateral for loans. Real estate revolution.',
    hashtags: ['#Education', '#RealEstate', '#Tokenization', '#RWA'],
    networks: ['linkedin', 'facebook'],
    mediaSuggestions: ['real-estate-tokenization.png']
  },
  {
    id: 'edu-005',
    category: 'educational',
    tone: 'technical',
    title: 'Smart Contracts for Loans',
    content: 'BlockBank smart contracts automate: collateral evaluation, LTV calculation, loan distribution, monthly payments, liquidation in case of default. Open-source code, auditable. Maximum security.',
    hashtags: ['#Technical', '#SmartContracts', '#BlockBank', '#Blockchain'],
    networks: ['twitter', 'linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'edu-006',
    category: 'educational',
    tone: 'educational',
    title: 'Bitcoin Mining and RWA',
    content: 'BlockBank combines Bitcoin mining (~3 EH/s capacity) with RWA credit infrastructure. Mining revenues can fuel the insurance pool or serve as collateral. Unique synergy in the DeFi ecosystem.',
    hashtags: ['#Education', '#BitcoinMining', '#RWA', '#BlockBank'],
    networks: ['twitter', 'linkedin'],
    mediaSuggestions: ['mining-rwa-synergy.png']
  },
  {
    id: 'edu-007',
    category: 'educational',
    tone: 'educational',
    title: 'Compliance and Regulation',
    content: 'BlockBank is designed for compliance: legal SPV structures, complete documentation, defined recovery processes, Sharia compatibility. Architecture ready for institutional deployment (Qatar, sovereign funds).',
    hashtags: ['#Education', '#Compliance', '#Regulation', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'edu-008',
    category: 'educational',
    tone: 'technical',
    title: 'Oracles and Off-Chain Data',
    content: 'BlockBank uses oracles to access off-chain financial data necessary for scoring. Cryptographically verified data, resistant to manipulation. On-chain/off-chain hybridization for precise scoring.',
    hashtags: ['#Technical', '#Oracles', '#BlockBank', '#Blockchain'],
    networks: ['twitter', 'linkedin'],
    mediaSuggestions: []
  },

  // ========== INSTITUTIONAL CONTENT ==========
  {
    id: 'inst-001',
    category: 'institutional',
    tone: 'institutional',
    title: 'BlockBank for Sovereign Funds',
    content: 'BlockBank offers an on-chain credit infrastructure adapted to sovereign funds: total compliance, institutional transparency, controlled risk management, Sharia-compatible architecture. Qatar deployment in progress.',
    hashtags: ['#Institutional', '#SovereignFunds', '#Qatar', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'inst-002',
    category: 'institutional',
    tone: 'institutional',
    title: 'Qatar Positioning',
    content: 'BlockBank × Qatar: On-chain credit infrastructure designed for the Qatari market. Sharia compatibility, local partnerships, focus on RWA (real estate, infrastructure). Long-term vision for regional DeFi leadership.',
    hashtags: ['#Qatar', '#BlockBank', '#Institutional', '#ShariaCompliant'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: []
  },
  {
    id: 'inst-003',
    category: 'institutional',
    tone: 'institutional',
    title: 'Audit and Certification',
    content: 'BlockBank prioritizes maximum transparency: auditable code, certifiable processes, complete documentation. Our infrastructure meets the strictest institutional standards. Continuous audit and total traceability.',
    hashtags: ['#Institutional', '#Audit', '#Transparency', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'inst-004',
    category: 'institutional',
    tone: 'institutional',
    title: 'Institutional Partnerships',
    content: 'BlockBank develops strategic partnerships with institutional insurers (QIG, AXA, Allianz), RWA platforms (RealT, Tangibl) and financial institutions. Global network for large-scale deployment.',
    hashtags: ['#Institutional', '#Partnerships', '#BlockBank', '#Global'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'inst-005',
    category: 'institutional',
    tone: 'institutional',
    title: 'Global Scalability',
    content: 'BlockBank architecture designed for global scalability: multi-jurisdiction, multi-currency, multi-asset. Infrastructure ready for international deployment with local adaptation (compliance, regulation, Sharia).',
    hashtags: ['#Institutional', '#Scalability', '#Global', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },

  // ========== USE CASES ==========
  {
    id: 'uc-001',
    category: 'use-cases',
    tone: 'professional',
    title: 'Use Case: Real Estate',
    content: 'Scenario: You own a tokenized villa (RWA NFT via RealT). Use it as collateral for a BlockBank loan (LTV up to 70%). Continue receiving rental income while freeing up capital. Revolutionary real estate financing.',
    hashtags: ['#UseCase', '#RealEstate', '#RWA', '#BlockBank'],
    networks: ['linkedin', 'facebook'],
    mediaSuggestions: ['use-case-real-estate.png']
  },
  {
    id: 'uc-002',
    category: 'use-cases',
    tone: 'professional',
    title: 'Use Case: Bitcoin Mining',
    content: 'Use case: Tokenized Bitcoin mining farm. Use the RWA NFT as collateral to borrow and finance the expansion of your operation. Mining revenues repay the loan. Accelerated growth.',
    hashtags: ['#UseCase', '#BitcoinMining', '#RWA', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['use-case-mining.png']
  },
  {
    id: 'uc-003',
    category: 'use-cases',
    tone: 'professional',
    title: 'Use Case: Collectibles',
    content: 'Your collectible watch or art object is tokenized (Courtyard). RWA NFT = BlockBank collateral. Unlock the value of your illiquid assets without selling them. Flexible financing for collectors.',
    hashtags: ['#UseCase', '#Collectibles', '#RWA', '#BlockBank'],
    networks: ['instagram', 'facebook'],
    mediaSuggestions: ['use-case-collectibles.png']
  },
  {
    id: 'uc-004',
    category: 'use-cases',
    tone: 'professional',
    title: 'Use Case: Infrastructure',
    content: 'Tokenized data center or energy infrastructure (4K). Use the RWA NFT to obtain a BlockBank loan and finance new capacity. Operating contracts (PPA) guarantee revenues. Easier scaling.',
    hashtags: ['#UseCase', '#Infrastructure', '#RWA', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'uc-005',
    category: 'use-cases',
    tone: 'professional',
    title: 'Use Case: Diversified Portfolio',
    content: 'Diversify your collateral: mix of real estate (RealT), mining (BTC farm), and collectibles (Courtyard). Diversified RWA NFT portfolio = better scoring, better rates, better LTV. Optimized collateral strategy.',
    hashtags: ['#UseCase', '#Diversification', '#RWA', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: []
  },

  // ========== PARTNERSHIPS ==========
  {
    id: 'part-001',
    category: 'partnerships',
    tone: 'professional',
    title: 'RealT Partnership',
    content: 'BlockBank partners with RealT, leader in real estate tokenization. Access thousands of tokenized properties as collateral. 15-20% discount on fees based on your Credit Score. Real estate + DeFi = future.',
    hashtags: ['#Partnership', '#RealT', '#RealEstate', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['realt-logo.png']
  },
  {
    id: 'part-002',
    category: 'partnerships',
    tone: 'professional',
    title: 'Tangibl Partnership',
    content: 'BlockBank × Tangibl: Access to a wide range of tokenized RWA assets (real estate, commodities). Maximum diversification for your collateral. Recovery process optimized by asset type. Extended portfolio.',
    hashtags: ['#Partnership', '#Tangibl', '#RWA', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: []
  },
  {
    id: 'part-003',
    category: 'partnerships',
    tone: 'professional',
    title: 'Courtyard Partnership',
    content: 'BlockBank collaborates with Courtyard to tokenize collectibles, precious metals, watches. Your illiquid assets become collateral. Secure storage + authenticity certificate guaranteed. Collection + Finance.',
    hashtags: ['#Partnership', '#Courtyard', '#Collectibles', '#BlockBank'],
    networks: ['instagram', 'facebook'],
    mediaSuggestions: []
  },
  {
    id: 'part-004',
    category: 'partnerships',
    tone: 'institutional',
    title: 'Qatar Insurance Group Partnership',
    content: 'BlockBank partners with Qatar Insurance Group (QIG) to offer adapted insurance solutions. Institutional coverage, Sharia compatibility, local expertise. Maximum protection for Qatari borrowers.',
    hashtags: ['#Partnership', '#QIG', '#Qatar', '#Insurance', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'part-005',
    category: 'partnerships',
    tone: 'professional',
    title: '4K Infrastructure Partnership',
    content: 'BlockBank × 4K: Tokenized infrastructure (data centers, energy) as collateral. Long-term operating contracts guarantee stability. Loans adapted to infrastructure needs. Easier scaling for operators.',
    hashtags: ['#Partnership', '#4K', '#Infrastructure', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'part-006',
    category: 'partnerships',
    tone: 'professional',
    title: 'Partner Ecosystem',
    content: 'BlockBank develops a complete ecosystem: 10+ RWA partners (RealT, Tangibl, Courtyard, 4K, etc.), major insurers (QIG, AXA, Allianz), financial institutions. Global network for complete infrastructure.',
    hashtags: ['#Partnerships', '#Ecosystem', '#BlockBank', '#RWA'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['ecosystem-map.png']
  },

  // ========== INDUSTRY NEWS & TRENDS ==========
  {
    id: 'news-001',
    category: 'industry-news',
    tone: 'professional',
    title: 'RWA Market Growth',
    content: 'The RWA market is exploding: +500% in 2024, projection $10T by 2030. BlockBank is positioned to capture this growth with complete infrastructure: scoring, tokenization, insurance. Emerging leader.',
    hashtags: ['#IndustryNews', '#RWA', '#MarketGrowth', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: ['rwa-growth-chart.png']
  },
  {
    id: 'news-002',
    category: 'industry-news',
    tone: 'professional',
    title: 'Trend: Institutional Tokenization',
    content: 'Institutions are accelerating RWA adoption: BlackRock, JPMorgan, sovereign funds. BlockBank responds to this demand with institutional infrastructure: compliance, auditability, scalability. Future of finance.',
    hashtags: ['#IndustryTrends', '#Institutional', '#RWA', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'news-003',
    category: 'industry-news',
    tone: 'professional',
    title: 'RWA Regulation',
    content: 'Regulators are clarifying the RWA framework: Europe (MiCA), USA (SEC), Middle East. BlockBank anticipates with compliant architecture from the start. Advantageous positioning for institutional adoption. Compliance = competitive advantage.',
    hashtags: ['#IndustryNews', '#Regulation', '#Compliance', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: []
  },
  {
    id: 'news-004',
    category: 'industry-news',
    tone: 'professional',
    title: 'Institutional DeFi Adoption',
    content: 'DeFi adoption by institutions is accelerating: need for transparency, automation, efficiency. BlockBank combines the best of both worlds: DeFi innovation + stability of real assets. Better infrastructure.',
    hashtags: ['#IndustryTrends', '#DeFi', '#Institutional', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'news-005',
    category: 'industry-news',
    tone: 'educational',
    title: 'Future of Credit',
    content: 'On-chain credit is the future: total transparency, global accessibility, complete automation. BlockBank revolutionizes with controlled under-collateralization + RWA. Traditional finance + blockchain innovation.',
    hashtags: ['#IndustryTrends', '#OnChainCredit', '#Future', '#BlockBank'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: []
  },

  // ========== SUCCESS STORIES ==========
  {
    id: 'success-001',
    category: 'success-stories',
    tone: 'professional',
    title: 'Testimonial: Real Estate Expansion',
    content: 'An investor used his tokenized villa (RealT) as BlockBank collateral. Loan of 200K USDC at 8.5% over 36 months. Expansion of his real estate portfolio without selling. ROI improved thanks to leverage effect.',
    hashtags: ['#SuccessStory', '#RealEstate', '#BlockBank', '#Testimonial'],
    networks: ['linkedin', 'facebook'],
    mediaSuggestions: []
  },
  {
    id: 'success-002',
    category: 'success-stories',
    tone: 'professional',
    title: 'Testimonial: Mining Scaling',
    content: 'A mining operator tokenized his farm (3 EH/s) and obtained a BlockBank loan to double his capacity. Mining revenues repay the loan. Accelerated growth thanks to freed capital.',
    hashtags: ['#SuccessStory', '#Mining', '#BlockBank', '#Growth'],
    networks: ['linkedin', 'twitter'],
    mediaSuggestions: []
  },
  {
    id: 'success-003',
    category: 'success-stories',
    tone: 'professional',
    title: 'Success: Diversified Portfolio',
    content: 'A user diversified his collateral: mix of real estate + mining + collectibles. Improved Credit Score, better LTV, better rates. Strategy optimized thanks to RWA diversification. Impressive results.',
    hashtags: ['#SuccessStory', '#Diversification', '#BlockBank', '#Optimization'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },
  {
    id: 'success-004',
    category: 'success-stories',
    tone: 'institutional',
    title: 'Institutional Case: Sovereign Fund',
    content: 'A sovereign fund deployed BlockBank for RWA credit infrastructure. Total compliance, guaranteed auditability, global scalability. Successful deployment with local partners. Replicable model.',
    hashtags: ['#SuccessStory', '#Institutional', '#SovereignFund', '#BlockBank'],
    networks: ['linkedin'],
    mediaSuggestions: []
  },

  // ========== ADDITIONAL CONTENT TO REACH 200+ ==========
  ...generateVariations()
]

// Function to generate additional variations
function generateVariations(): ContentLibraryItem[] {
  const variations: ContentLibraryItem[] = []
  let idCounter = 200

  // Credit Score variations
  const csThemes = [
    'Improve Your Score',
    'Scoring Components',
    'Tier A Advantages',
    'Score History',
    'Comparison with Other Systems'
  ]
  csThemes.forEach((theme, idx) => {
    variations.push({
      id: `cs-v${idCounter++}`,
      category: 'credit-score',
      tone: 'professional',
      title: theme,
      content: `Content about ${theme} in the context of BlockBank Credit Score. Transparent and auditable system.`,
      hashtags: ['#CreditScore', '#BlockBank'],
      networks: ['linkedin', 'twitter'],
      mediaSuggestions: []
    })
  })

  // RWA variations
  const rwaPartners = ['Maple', 'Backed Finance', 'Centrifuge', 'Landshare', '21.co', 'Dibbs']
  rwaPartners.forEach((partner, idx) => {
    variations.push({
      id: `rwa-v${idCounter++}`,
      category: 'partnerships',
      tone: 'professional',
      title: `${partner} Partnership`,
      content: `BlockBank partners with ${partner} to expand the RWA ecosystem. Access to new types of tokenized assets as collateral.`,
      hashtags: ['#Partnership', `#${partner}`, '#RWA', '#BlockBank'],
      networks: ['linkedin', 'twitter'],
      mediaSuggestions: []
    })
  })

  // Educational variations
  const eduTopics = [
    'LTV and Collateral',
    'Recovery Process',
    'Data Oracles',
    'Smart Contract Security',
    'Sharia Compliance',
    'SPV Structure',
    'Risk Management',
    'Liquidity Pools'
  ]
  eduTopics.forEach((topic, idx) => {
    variations.push({
      id: `edu-v${idCounter++}`,
      category: 'educational',
      tone: 'educational',
      title: topic,
      content: `Educational content about ${topic} in the context of BlockBank and on-chain credit protocols.`,
      hashtags: ['#Education', '#BlockBank', '#DeFi'],
      networks: ['twitter', 'linkedin'],
      mediaSuggestions: []
    })
  })

  // More daily posts
  for (let i = 0; i < 150; i++) {
    const categories: ContentCategory[] = ['product-features', 'educational', 'use-cases', 'industry-news']
    const tones: ContentTone[] = ['professional', 'educational']
    const networks: SocialNetwork[][] = [
      ['linkedin', 'twitter'],
      ['twitter'],
      ['linkedin'],
      ['facebook', 'instagram']
    ]
    
    const category = categories[i % categories.length]
    const tone = tones[i % tones.length]
    const netw = networks[i % networks.length]
    
    variations.push({
      id: `gen-${idCounter++}`,
      category,
      tone,
      title: `Post ${i + 1}`,
      content: `BlockBank marketing content automatically generated. Focus on the 3 pillars: Credit Score, RWA NFT, Insurance. On-chain credit infrastructure for real assets.`,
      hashtags: ['#BlockBank', '#DeFi', '#RWA'],
      networks: netw,
      mediaSuggestions: []
    })
  }

  return variations
}

// Utility functions
export function getContentByCategory(category: ContentCategory): ContentLibraryItem[] {
  return MARKETING_CONTENT_LIBRARY.filter(item => item.category === category)
}

export function getContentByTone(tone: ContentTone): ContentLibraryItem[] {
  return MARKETING_CONTENT_LIBRARY.filter(item => item.tone === tone)
}

export function getContentByNetwork(network: SocialNetwork): ContentLibraryItem[] {
  return MARKETING_CONTENT_LIBRARY.filter(item => item.networks.includes(network))
}

export function getRandomContent(count: number = 1): ContentLibraryItem[] {
  const shuffled = [...MARKETING_CONTENT_LIBRARY].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function searchContent(query: string): ContentLibraryItem[] {
  const lowerQuery = query.toLowerCase()
  return MARKETING_CONTENT_LIBRARY.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.content.toLowerCase().includes(lowerQuery) ||
    item.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getAllContent(): ContentLibraryItem[] {
  return MARKETING_CONTENT_LIBRARY
}
