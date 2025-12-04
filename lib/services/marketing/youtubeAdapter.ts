import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'
import { BaseNetworkAdapter, ContentAdaptationOptions } from './baseAdapter'

export class YouTubeAdapter extends BaseNetworkAdapter {
  network: SocialNetwork = 'youtube'
  maxLength = 5000 // YouTube permet beaucoup de caractères dans la description
  optimalPostTimes = ['14:00', '16:00', '18:00']
  
  adaptContent(options: ContentAdaptationOptions): NetworkAdaptedContent {
    const { content, hashtags = [], mediaSuggestions = [], cta } = options
    
    // YouTube : description longue avec sections structurées
    let adaptedContent = content
    
    // YouTube permet des descriptions longues et structurées
    // Ajouter un hook au début
    const hook = content.substring(0, 150)
    const rest = content.length > 150 ? content.substring(150) : ''
    
    adaptedContent = `${hook}\n\n${rest || 'Découvrez BlockBank, infrastructure de crédit on-chain pour actifs réels.'}`
    
    // Ajouter sections YouTube typiques
    if (cta) {
      adaptedContent += `\n\n🔗 ${cta}`
    }
    
    // Ajouter liens et informations
    adaptedContent += '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    adaptedContent += '\n📚 En savoir plus sur BlockBank :'
    adaptedContent += '\n💼 Infrastructure de crédit on-chain'
    adaptedContent += '\n🏦 Credit Score • NFT RWA • Assurance'
    
    // Hashtags YouTube (3-5 recommandés)
    const youtubeHashtags = hashtags.slice(0, 5)
    if (youtubeHashtags.length > 0) {
      const hashtagString = this.formatHashtags(youtubeHashtags)
      adaptedContent += `\n\n${hashtagString}`
    }
    
    return {
      network: this.network,
      content: adaptedContent,
      hashtags: youtubeHashtags,
      maxLength: this.maxLength,
      format: 'video', // YouTube est principalement vidéo
      mediaSuggestions,
      optimalPostTime: this.optimalPostTimes[0]
    }
  }
}

