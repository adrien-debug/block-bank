import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'
import { BaseNetworkAdapter, ContentAdaptationOptions } from './baseAdapter'

export class TikTokAdapter extends BaseNetworkAdapter {
  network: SocialNetwork = 'tiktok'
  maxLength = 2200 // TikTok permet beaucoup mais description courte recommandée
  optimalPostTimes = ['09:00', '12:00', '17:00', '21:00']
  
  adaptContent(options: ContentAdaptationOptions): NetworkAdaptedContent {
    const { content, hashtags = [], mediaSuggestions = [], cta } = options
    
    // TikTok : description courte et engageante, contenu principal dans la vidéo
    let adaptedContent = content
    
    // TikTok préfère des descriptions courtes et punchy (100-150 caractères)
    if (content.length > 150) {
      adaptedContent = this.truncateContent(content, 150) + ' 👆'
    }
    
    // Ajouter CTA court et engageant
    if (cta) {
      const ctaShort = cta.length > 30 ? cta.substring(0, 27) + '...' : cta
      adaptedContent += `\n${ctaShort}`
    }
    
    // TikTok utilise beaucoup de hashtags (3-5 tendances + spécifiques)
    const tiktokHashtags = hashtags.slice(0, 8)
    
    // Ajouter hashtags
    const hashtagString = this.formatHashtags(tiktokHashtags)
    adaptedContent += `\n\n${hashtagString}`
    
    return {
      network: this.network,
      content: adaptedContent,
      hashtags: tiktokHashtags,
      maxLength: this.maxLength,
      format: 'video', // TikTok est principalement vidéo
      mediaSuggestions,
      optimalPostTime: this.optimalPostTimes[0]
    }
  }
}

