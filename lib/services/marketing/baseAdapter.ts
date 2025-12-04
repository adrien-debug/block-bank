import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'

export interface ContentAdaptationOptions {
  content: string
  hashtags?: string[]
  mediaSuggestions?: string[]
  cta?: string
}

export abstract class BaseNetworkAdapter {
  abstract network: SocialNetwork
  abstract maxLength: number
  abstract optimalPostTimes: string[]
  
  abstract adaptContent(options: ContentAdaptationOptions): NetworkAdaptedContent
  
  protected truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength - 3) + '...'
  }
  
  protected formatHashtags(hashtags: string[]): string {
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')
  }
  
  protected addCTAToContent(content: string, cta?: string): string {
    if (!cta) return content
    return `${content}\n\n${cta}`
  }
}

