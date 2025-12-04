import { 
  ContentCategory, 
  ContentTone, 
  SocialNetwork, 
  GeneratedContent,
  NetworkAdaptedContent,
  ContentGenerationOptions,
  PostTemplateType
} from '@/types/marketing.types'
import { adaptContentForAllNetworks } from './marketing'
import { 
  getAllContent, 
  getContentByCategory, 
  getContentByTone, 
  getContentByNetwork,
  getRandomContent,
  searchContent,
  ContentLibraryItem
} from '@/lib/data/marketingContentLibrary'
import { getTemplate } from '@/lib/data/postTemplates'

export interface ContentGenerationResult {
  baseContent: GeneratedContent
  adaptedContent: NetworkAdaptedContent[]
}

export class MarketingContentEngine {
  /**
   * Génère du contenu marketing selon les options fournies
   */
  generateContent(options: ContentGenerationOptions = {}): GeneratedContent[] {
    const {
      category,
      tone,
      template,
      networks = ['linkedin', 'twitter', 'facebook'],
      keywords = [],
      count = 1
    } = options

    // Sélectionner le contenu de base depuis la bibliothèque
    let baseItems: ContentLibraryItem[] = []

    if (category) {
      baseItems = getContentByCategory(category)
    } else if (tone) {
      baseItems = getContentByTone(tone)
    } else {
      baseItems = getAllContent()
    }

    // Filtrer par réseaux si nécessaire
    if (networks.length > 0) {
      baseItems = baseItems.filter(item => 
        item.networks.some(network => networks.includes(network))
      )
    }

    // Filtrer par mots-clés si fournis
    if (keywords.length > 0) {
      baseItems = baseItems.filter(item => {
        const contentLower = `${item.title} ${item.content}`.toLowerCase()
        return keywords.some(keyword => contentLower.includes(keyword.toLowerCase()))
      })
    }

    // Si pas assez de résultats, prendre aléatoirement
    if (baseItems.length < count) {
      const additional = getRandomContent(count - baseItems.length)
      baseItems = [...baseItems, ...additional]
    }

    // Sélectionner le nombre demandé
    const selectedItems = baseItems.slice(0, count)

    // Générer le contenu avec adaptation
    return selectedItems.map(item => this.createGeneratedContent(item, template, networks))
  }

  /**
   * Crée un contenu généré depuis un item de bibliothèque
   */
  private createGeneratedContent(
    item: ContentLibraryItem,
    template?: PostTemplateType,
    networks?: SocialNetwork[]
  ): GeneratedContent {
    let content = item.content
    let hashtags = [...item.hashtags]
    let templateType: PostTemplateType = template || 'call-to-action'

    // Si un template est spécifié, utiliser sa structure
    if (template) {
      const templateDef = getTemplate(template)
      // Pour l'instant, on garde le contenu tel quel mais on pourrait appliquer le template
      templateType = template
    }

    // Ajouter hashtags supplémentaires selon le réseau
    const finalNetworks = networks || item.networks
    hashtags = this.enhanceHashtags(hashtags, finalNetworks)

    return {
      id: item.id,
      baseContent: content,
      category: item.category,
      tone: item.tone,
      template: templateType,
      networks: finalNetworks,
      hashtags,
      mediaSuggestions: item.mediaSuggestions,
      metadata: {
        title: item.title,
        originalId: item.id
      }
    }
  }

  /**
   * Génère et adapte le contenu pour tous les réseaux spécifiés
   */
  generateAndAdaptContent(options: ContentGenerationOptions = {}): ContentGenerationResult[] {
    const generated = this.generateContent(options)
    
    return generated.map(genContent => {
      const adapted = adaptContentForAllNetworks({
        content: genContent.baseContent,
        hashtags: genContent.hashtags,
        mediaSuggestions: genContent.mediaSuggestions,
        networks: genContent.networks
      })

      return {
        baseContent: genContent,
        adaptedContent: adapted
      }
    })
  }

  /**
   * Génère du contenu pour une catégorie spécifique
   */
  generateByCategory(
    category: ContentCategory,
    count: number = 1,
    networks?: SocialNetwork[]
  ): GeneratedContent[] {
    return this.generateContent({
      category,
      networks,
      count
    })
  }

  /**
   * Génère du contenu avec un template spécifique
   */
  generateWithTemplate(
    template: PostTemplateType,
    count: number = 1,
    networks?: SocialNetwork[]
  ): GeneratedContent[] {
    return this.generateContent({
      template,
      networks,
      count
    })
  }

  /**
   * Génère du contenu pour un réseau spécifique
   */
  generateForNetwork(
    network: SocialNetwork,
    count: number = 1,
    category?: ContentCategory
  ): GeneratedContent[] {
    const items = category 
      ? getContentByCategory(category)
      : getAllContent()
    
    const networkItems = items.filter(item => item.networks.includes(network))
    const selected = networkItems.slice(0, count)

    return selected.map(item => this.createGeneratedContent(item, undefined, [network]))
  }

  /**
   * Recherche et génère du contenu selon une requête
   */
  searchAndGenerate(
    query: string,
    count: number = 5,
    networks?: SocialNetwork[]
  ): GeneratedContent[] {
    const results = searchContent(query)
    const filtered = networks
      ? results.filter(item => item.networks.some(n => networks.includes(n)))
      : results

    const selected = filtered.slice(0, count)
    return selected.map(item => this.createGeneratedContent(item, undefined, networks))
  }

  /**
   * Génère des variantes d'un contenu pour différents réseaux
   */
  generateVariants(
    baseContent: string,
    networks: SocialNetwork[],
    hashtags: string[] = []
  ): NetworkAdaptedContent[] {
    return adaptContentForAllNetworks({
      content: baseContent,
      hashtags,
      networks
    })
  }

  /**
   * Améliore les hashtags selon les réseaux
   */
  private enhanceHashtags(
    baseHashtags: string[],
    networks: SocialNetwork[]
  ): string[] {
    const enhanced = [...baseHashtags]

    // Hashtags universels BlockBank
    const blockbankHashtags = ['#BlockBank']
    blockbankHashtags.forEach(tag => {
      if (!enhanced.includes(tag)) {
        enhanced.push(tag)
      }
    })

    // Hashtags spécifiques selon réseau
    if (networks.includes('linkedin')) {
      const linkedinTags = ['#DeFi', '#FinTech', '#Blockchain']
      linkedinTags.forEach(tag => {
        if (!enhanced.includes(tag)) {
          enhanced.push(tag)
        }
      })
    }

    if (networks.includes('twitter')) {
      const twitterTags = ['#Crypto', '#Web3']
      twitterTags.forEach(tag => {
        if (!enhanced.includes(tag)) {
          enhanced.push(tag)
        }
      })
    }

    if (networks.includes('instagram')) {
      const instagramTags = ['#Crypto', '#Finance']
      instagramTags.forEach(tag => {
        if (!enhanced.includes(tag)) {
          enhanced.push(tag)
        }
      })
    }

    return enhanced
  }

  /**
   * Génère du contenu pour le calendrier éditorial
   */
  generateEditorialContent(
    date: Date,
    countPerDay: number = 3
  ): GeneratedContent[] {
    const dayOfWeek = date.getDay()
    const category = this.getCategoryForDay(dayOfWeek)
    
    return this.generateContent({
      category,
      count: countPerDay
    })
  }

  /**
   * Détermine la catégorie de contenu selon le jour de la semaine
   */
  private getCategoryForDay(dayOfWeek: number): ContentCategory {
    switch (dayOfWeek) {
      case 0: // Dimanche
      case 6: // Samedi
        return 'success-stories'
      case 1: // Lundi
        return 'product-features'
      case 2: // Mardi
        return 'educational'
      case 3: // Mercredi
        return 'use-cases'
      case 4: // Jeudi
        return 'institutional'
      case 5: // Vendredi
        return 'industry-news'
      default:
        return 'product-features'
    }
  }
}

// Instance singleton
export const marketingContentEngine = new MarketingContentEngine()

// Fonctions utilitaires exportées
export function generateMarketingContent(options?: ContentGenerationOptions): GeneratedContent[] {
  return marketingContentEngine.generateContent(options)
}

export function generateAndAdaptMarketingContent(options?: ContentGenerationOptions): ContentGenerationResult[] {
  return marketingContentEngine.generateAndAdaptContent(options)
}

export function generateContentByCategory(
  category: ContentCategory,
  count?: number,
  networks?: SocialNetwork[]
): GeneratedContent[] {
  return marketingContentEngine.generateByCategory(category, count, networks)
}

