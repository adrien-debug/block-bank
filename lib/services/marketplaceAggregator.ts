// Marketplace Aggregator - Agrégation NFT RWA depuis partenaires

import { NFTRWA, Marketplace, AssetType } from '@/types'

/**
 * Simule la récupération des NFT RWA depuis les marketplaces partenaires
 * En production, cela ferait des appels API réels
 */
export async function fetchNFTsFromMarketplaces(
  filters?: {
    marketplace?: Marketplace
    assetType?: AssetType
    minValue?: number
    maxValue?: number
    riskClass?: 'SAFE' | 'MODERATE' | 'RISKY'
  }
): Promise<NFTRWA[]> {
  // Simulation de données NFT RWA
  // En production, cela ferait des appels API vers les marketplaces
  
  const mockNFTs: NFTRWA[] = [
    {
      id: '1',
      tokenId: '1234',
      contractAddress: '0x1234567890123456789012345678901234567890',
      marketplace: 'REALT',
      assetType: 'REAL_ESTATE',
      name: 'Villa Paris - 16ème arrondissement',
      description: 'Appartement de luxe de 150m² dans le 16ème arrondissement de Paris',
      value: 300000,
      valueCurrency: 'USDC',
      riskScore: 25,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample1',
      imageURI: '/Villa-paris.jpeg',
      isLocked: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      tokenId: '5678',
      contractAddress: '0x2345678901234567890123456789012345678901',
      marketplace: '4K',
      assetType: 'MINING',
      name: 'Bitcoin Mining Farm - Texas',
      description: 'Installation de mining Bitcoin de 10MW avec 5000 ASICs',
      value: 150000,
      valueCurrency: 'USDC',
      riskScore: 45,
      riskClass: 'MODERATE',
      metadataURI: 'ipfs://QmExample2',
      imageURI: '/Mining1.webp',
      isLocked: false,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    },
    {
      id: '3',
      tokenId: '9012',
      contractAddress: '0x3456789012345678901234567890123456789012',
      marketplace: '4K',
      assetType: 'INFRASTRUCTURE',
      name: 'Data Center - Frankfurt',
      description: 'Centre de données de 5000m² avec certification Tier III',
      value: 500000,
      valueCurrency: 'USDC',
      riskScore: 20,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample3',
      imageURI: '/Data-Center.avif',
      isLocked: false,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '4',
      tokenId: '3456',
      contractAddress: '0x4567890123456789012345678901234567890123',
      marketplace: 'TANGIBL',
      assetType: 'REAL_ESTATE',
      name: 'Commercial Building - London',
      description: 'Immeuble commercial de 2000m² en centre-ville de Londres',
      value: 800000,
      valueCurrency: 'USDC',
      riskScore: 35,
      riskClass: 'MODERATE',
      metadataURI: 'ipfs://QmExample4',
      imageURI: '/London1.webp',
      isLocked: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '5',
      tokenId: '7890',
      contractAddress: '0x5678901234567890123456789012345678901234',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Gold Reserve - 100kg',
      description: 'Réserve d\'or physique de 100kg stockée en coffre sécurisé',
      value: 6500000,
      valueCurrency: 'USDC',
      riskScore: 15,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample5',
      imageURI: '/Gold1.jpg',
      isLocked: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '6',
      tokenId: '2468',
      contractAddress: '0x6789012345678901234567890123456789012345',
      marketplace: 'REALT',
      assetType: 'REAL_ESTATE',
      name: 'Mamo Group Restaurant',
      description: 'Restaurant de luxe MAMO - Michelangelo situé dans un emplacement prestigieux',
      value: 1200000,
      valueCurrency: 'USDC',
      riskScore: 30,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample6',
      imageURI: '/Mamo1.jpeg',
      isLocked: false,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '7',
      tokenId: '3691',
      contractAddress: '0x7890123456789012345678901234567890123456',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Richard Mille Watch',
      description: 'Montre de luxe Richard Mille - Pièce horlogère exceptionnelle avec mouvement mécanique complexe et boîtier transparent',
      value: 850000,
      valueCurrency: 'USDC',
      riskScore: 20,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample7',
      imageURI: '/Richard-Milles.jpeg',
      isLocked: false,
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-01-28'),
    },
    {
      id: '8',
      tokenId: '4826',
      contractAddress: '0x8901234567890123456789012345678901234567',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Loro Piana Collection',
      description: 'Veste de luxe Loro Piana - Pièce d\'exception en laine fine et cachemire, savoir-faire artisanal italien',
      value: 45000,
      valueCurrency: 'USDC',
      riskScore: 25,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample8',
      imageURI: '/Loro-Piana-2.webp',
      isLocked: false,
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-01-30'),
    },
    {
      id: '9',
      tokenId: '5827',
      contractAddress: '0x9012345678901234567890123456789012345678',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'McLaren Supercar - 720S',
      description: 'Supercar McLaren 720S - Véhicule de luxe haute performance avec moteur V8 biturbo, édition limitée',
      value: 350000,
      valueCurrency: 'USDC',
      riskScore: 30,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample9',
      imageURI: '/mclaren-4535102_1280.jpg',
      isLocked: false,
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05'),
    },
    {
      id: '10',
      tokenId: '6838',
      contractAddress: '0x0123456789012345678901234567890123456789',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Luxury Yacht - Trimaran',
      description: 'Trimaran de luxe de 25m - Bateau à voile haut de gamme avec équipements premium et certification maritime',
      value: 1200000,
      valueCurrency: 'USDC',
      riskScore: 35,
      riskClass: 'MODERATE',
      metadataURI: 'ipfs://QmExample10',
      imageURI: '/trimaran-2806616_1280.jpg',
      isLocked: false,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
    {
      id: '11',
      tokenId: '7849',
      contractAddress: '0x1234567890123456789012345678901234567890',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Speedboat Premium',
      description: 'Bateau à moteur de luxe - Embarcation rapide avec moteur haute performance et aménagements premium',
      value: 450000,
      valueCurrency: 'USDC',
      riskScore: 32,
      riskClass: 'MODERATE',
      metadataURI: 'ipfs://QmExample11',
      imageURI: '/speedboat-6639122_1280.jpg',
      isLocked: false,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    },
    {
      id: '12',
      tokenId: '8850',
      contractAddress: '0x2345678901234567890123456789012345678901',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Luxury Sailing Boat',
      description: 'Voilier de luxe - Bateau à voile premium avec équipements de navigation haut de gamme',
      value: 680000,
      valueCurrency: 'USDC',
      riskScore: 28,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample12',
      imageURI: '/boat-3480914_1280.jpg',
      isLocked: false,
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20'),
    },
    {
      id: '13',
      tokenId: '9861',
      contractAddress: '0x3456789012345678901234567890123456789012',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Rolex Submariner - Edition Limitée',
      description: 'Montre Rolex Submariner - Pièce horlogère emblématique en acier inoxydable, édition limitée avec boîtier certifié',
      value: 15000,
      valueCurrency: 'USDC',
      riskScore: 18,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample13',
      imageURI: '/rolex-4807479_1280.jpg',
      isLocked: false,
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-02-25'),
    },
    {
      id: '14',
      tokenId: '0872',
      contractAddress: '0x4567890123456789012345678901234567890123',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Emerald Gemstone - 50 carats',
      description: 'Émeraude de qualité exceptionnelle - Pierre précieuse de 50 carats, certifiée GIA, provenance Colombie',
      value: 250000,
      valueCurrency: 'USDC',
      riskScore: 22,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample14',
      imageURI: '/emerald-1137413_1280.jpg',
      isLocked: false,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
    {
      id: '15',
      tokenId: '1883',
      contractAddress: '0x5678901234567890123456789012345678901234',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Luxury Sports Car',
      description: 'Voiture de sport de luxe - Véhicule haut de gamme avec moteur performant et finitions premium',
      value: 180000,
      valueCurrency: 'USDC',
      riskScore: 27,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample15',
      imageURI: '/auto-2179220_1280.jpg',
      isLocked: false,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05'),
    },
    {
      id: '16',
      tokenId: '2894',
      contractAddress: '0x6789012345678901234567890123456789012345',
      marketplace: 'COURTYARD',
      assetType: 'COMMODITIES',
      name: 'Loro Piana Cashmere Coat',
      description: 'Manteau Loro Piana en cachemire - Pièce d\'exception en laine fine, savoir-faire artisanal italien, collection hiver',
      value: 55000,
      valueCurrency: 'USDC',
      riskScore: 24,
      riskClass: 'SAFE',
      metadataURI: 'ipfs://QmExample16',
      imageURI: '/Loro-Piana-1.webp',
      isLocked: false,
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10'),
    },
  ]
  
  // Application des filtres
  let filteredNFTs = mockNFTs
  
  if (filters?.marketplace) {
    filteredNFTs = filteredNFTs.filter(nft => nft.marketplace === filters.marketplace)
  }
  
  if (filters?.assetType) {
    filteredNFTs = filteredNFTs.filter(nft => nft.assetType === filters.assetType)
  }
  
  if (filters?.minValue) {
    filteredNFTs = filteredNFTs.filter(nft => nft.value >= filters.minValue!)
  }
  
  if (filters?.maxValue) {
    filteredNFTs = filteredNFTs.filter(nft => nft.value <= filters.maxValue!)
  }
  
  if (filters?.riskClass) {
    filteredNFTs = filteredNFTs.filter(nft => nft.riskClass === filters.riskClass)
  }
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return filteredNFTs
}

/**
 * Récupère un NFT RWA spécifique par ID
 */
export async function fetchNFTById(id: string): Promise<NFTRWA | null> {
  const nfts = await fetchNFTsFromMarketplaces()
  return nfts.find(nft => nft.id === id) || null
}

/**
 * Récupère les marketplaces disponibles
 */
export function getAvailableMarketplaces(): Marketplace[] {
  return ['REALT', 'TANGIBL', 'COURTYARD', '4K', 'MAPLE', 'BACKED', 'CENTRIFUGE', 'LANDSHARE', '21CO', 'DIBBS']
}

/**
 * Récupère les types d'actifs disponibles
 */
export function getAvailableAssetTypes(): AssetType[] {
  return ['REAL_ESTATE', 'MINING', 'INFRASTRUCTURE', 'COMMODITIES', 'OTHER']
}







