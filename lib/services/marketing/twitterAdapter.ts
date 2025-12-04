import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'
import { BaseNetworkAdapter, ContentAdaptationOptions } from './baseAdapter'

export class TwitterAdapter extends BaseNetworkAdapter {
  network: SocialNetwork = 'twitter'
  maxLength = 280
  optimalPostTimes = ['09:00', '12:00', '15:00', '18:00', '21:00']
  
  adaptContent(options: ContentAdaptationOptions): NetworkAdaptedContent {
    const { content, hashtags = [], mediaSuggestions = [], cta } = options
    
    // Twitter limite à 280 caractères, besoin d'être concis
    let adaptedContent = content
    
    // Si trop long, créer un thread potentiel
    const needsThread = content.length > this.maxLength - 50 // Réserver espace pour hashtags
    
    if (needsThread) {
      // Pour Twitter, on tronque mais on suggère un thread
      adaptedContent = this.truncateContent(content, this.maxLength - 30) + ' (1/?)'
    } else {
      adaptedContent = this.truncateContent(content, this.maxLength - 30)
    }
    
    // Ajouter CTA court si possible
    if (cta && !needsThread) {
      const ctaShort = cta.length > 30 ? cta.substring(0, 27) + '...' : cta
      const remainingSpace = this.maxLength - adaptedContent.length - 5
      if (remainingSpace > ctaShort.length) {
        adaptedContent += `\n${ctaShort}`
      }
    }
    
    // Hashtags Twitter (2-3 recommandés pour plus d'espace)
    const twitterHashtags = hashtags.slice(0, 3)
    
    // Ajouter hashtags si espace disponible
    const hashtagString = this.formatHashtags(twitterHashtags)
    const totalLength = adaptedContent.length + hashtagString.length + 2
    if (totalLength <= this.maxLength) {
      adaptedContent += `\n\n${hashtagString}`
    }
    
    return {
      network: this.network,
      content: adaptedContent.trim(),
      hashtags: twitterHashtags,
      maxLength: this.maxLength,
      format: needsThread ? 'thread' : 'text',
      mediaSuggestions,
      optimalPostTime: this.optimalPostTimes[0]
    }
  }
}

