import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'
import { BaseNetworkAdapter, ContentAdaptationOptions } from './baseAdapter'

export class LinkedInAdapter extends BaseNetworkAdapter {
  network: SocialNetwork = 'linkedin'
  maxLength = 2200
  optimalPostTimes = ['08:00', '12:00', '17:00']
  
  adaptContent(options: ContentAdaptationOptions): NetworkAdaptedContent {
    const { content, hashtags = [], mediaSuggestions = [], cta } = options
    
    // LinkedIn préfère un contenu plus long et professionnel
    let adaptedContent = content
    
    // Ajouter CTA si fourni
    if (cta) {
      adaptedContent = this.addCTAToContent(adaptedContent, cta)
    }
    
    // LinkedIn permet jusqu'à 2200 caractères
    const formattedContent = this.truncateContent(adaptedContent, this.maxLength)
    
    // Hashtags LinkedIn (3-5 recommandés)
    const linkedInHashtags = hashtags.slice(0, 5)
    const hashtagString = this.formatHashtags(linkedInHashtags)
    
    return {
      network: this.network,
      content: formattedContent,
      hashtags: linkedInHashtags,
      maxLength: this.maxLength,
      format: 'text',
      mediaSuggestions,
      optimalPostTime: this.optimalPostTimes[0]
    }
  }
}

