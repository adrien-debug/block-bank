import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'
import { BaseNetworkAdapter, ContentAdaptationOptions } from './baseAdapter'

export class InstagramAdapter extends BaseNetworkAdapter {
  network: SocialNetwork = 'instagram'
  maxLength = 2200 // Instagram permet beaucoup mais recommandé <125 caractères pour voir tout dans le feed
  optimalPostTimes = ['11:00', '14:00', '17:00', '20:00']
  
  adaptContent(options: ContentAdaptationOptions): NetworkAdaptedContent {
    const { content, hashtags = [], mediaSuggestions = [], cta } = options
    
    // Instagram : préfère contenu court dans la description (125 premiers caractères visibles)
    let adaptedContent = content
    
    // Créer un hook court pour les premiers caractères
    const hook = content.substring(0, 125)
    const rest = content.length > 125 ? content.substring(125) : ''
    
    // Optimiser le format Instagram
    if (rest) {
      adaptedContent = `${hook}...\n\n${rest}`
    } else {
      adaptedContent = hook
    }
    
    // Ajouter CTA
    if (cta) {
      adaptedContent = this.addCTAToContent(adaptedContent, cta)
    }
    
    // Instagram utilise beaucoup de hashtags (5-30 recommandés)
    const instagramHashtags = hashtags.slice(0, 10)
    
    // Ajouter hashtags (Instagram les met souvent en bas)
    const hashtagString = this.formatHashtags(instagramHashtags)
    adaptedContent += `\n\n${hashtagString}`
    
    return {
      network: this.network,
      content: adaptedContent,
      hashtags: instagramHashtags,
      maxLength: this.maxLength,
      format: mediaSuggestions.length > 1 ? 'carousel' : 'text',
      mediaSuggestions,
      optimalPostTime: this.optimalPostTimes[0]
    }
  }
}

