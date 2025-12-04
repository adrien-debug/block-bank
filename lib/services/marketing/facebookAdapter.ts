import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'
import { BaseNetworkAdapter, ContentAdaptationOptions } from './baseAdapter'

export class FacebookAdapter extends BaseNetworkAdapter {
  network: SocialNetwork = 'facebook'
  maxLength = 5000 // Facebook permet beaucoup de caractères mais recommandé <500 pour engagement
  optimalPostTimes = ['09:00', '13:00', '19:00']
  
  adaptContent(options: ContentAdaptationOptions): NetworkAdaptedContent {
    const { content, hashtags = [], mediaSuggestions = [], cta } = options
    
    // Facebook préfère un contenu plus accessible et engageant
    let adaptedContent = content
    
    // Facebook : contenu optimal entre 40-80 caractères pour engagement, mais peut être plus long
    // On garde le contenu tel quel mais on peut l'optimiser
    if (content.length > 500) {
      // Tronquer si trop long pour engagement optimal
      adaptedContent = this.truncateContent(content, 500)
    }
    
    // Ajouter CTA
    if (cta) {
      adaptedContent = this.addCTAToContent(adaptedContent, cta)
    }
    
    // Hashtags Facebook (2-5 recommandés)
    const facebookHashtags = hashtags.slice(0, 5)
    
    // Ajouter hashtags
    const hashtagString = this.formatHashtags(facebookHashtags)
    adaptedContent += `\n\n${hashtagString}`
    
    return {
      network: this.network,
      content: adaptedContent,
      hashtags: facebookHashtags,
      maxLength: this.maxLength,
      format: mediaSuggestions.length > 0 ? 'text' : 'text',
      mediaSuggestions,
      optimalPostTime: this.optimalPostTimes[0]
    }
  }
}

