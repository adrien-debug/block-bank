import { LinkedInAdapter } from './linkedinAdapter'
import { TwitterAdapter } from './twitterAdapter'
import { FacebookAdapter } from './facebookAdapter'
import { InstagramAdapter } from './instagramAdapter'
import { TikTokAdapter } from './tiktokAdapter'
import { YouTubeAdapter } from './youtubeAdapter'
import { BaseNetworkAdapter } from './baseAdapter'
import { SocialNetwork, NetworkAdaptedContent } from '@/types/marketing.types'
import { ContentAdaptationOptions } from './baseAdapter'

const adapters = {
  linkedin: new LinkedInAdapter(),
  twitter: new TwitterAdapter(),
  facebook: new FacebookAdapter(),
  instagram: new InstagramAdapter(),
  tiktok: new TikTokAdapter(),
  youtube: new YouTubeAdapter()
}

export function getAdapter(network: SocialNetwork): BaseNetworkAdapter {
  return adapters[network]
}

export function adaptContentForNetwork(
  network: SocialNetwork,
  options: ContentAdaptationOptions
): NetworkAdaptedContent {
  const adapter = getAdapter(network)
  return adapter.adaptContent(options)
}

export function adaptContentForAllNetworks(
  options: ContentAdaptationOptions & { networks: SocialNetwork[] }
): NetworkAdaptedContent[] {
  return options.networks.map(network => adaptContentForNetwork(network, options))
}

export { LinkedInAdapter, TwitterAdapter, FacebookAdapter, InstagramAdapter, TikTokAdapter, YouTubeAdapter }
export { BaseNetworkAdapter }

