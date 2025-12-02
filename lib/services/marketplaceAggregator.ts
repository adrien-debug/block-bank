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
      imageURI: '/images/nft-villa-paris.jpg',
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
      imageURI: '/images/nft-mining-farm.jpg',
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
      imageURI: '/images/nft-data-center.jpg',
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
      imageURI: '/images/nft-commercial-building.jpg',
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
      imageURI: '/images/nft-gold-reserve.jpg',
      isLocked: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
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






