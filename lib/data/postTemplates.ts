import { PostTemplateType, ContentTone, SocialNetwork } from '@/types/marketing.types'

export interface PostTemplate {
  type: PostTemplateType
  name: string
  description: string
  structure: string[]
  tone: ContentTone[]
  networks: SocialNetwork[]
  hashtags: string[]
  variables?: string[]
}

export const POST_TEMPLATES: Record<PostTemplateType, PostTemplate> = {
  'product-announcement': {
    type: 'product-announcement',
    name: 'Product Announcement',
    description: 'Template to announce a new feature or product',
    structure: [
      '{hook}',
      '{feature_description}',
      '{benefits}',
      '{cta}'
    ],
    tone: ['professional', 'institutional'],
    networks: ['linkedin', 'twitter', 'facebook'],
    hashtags: ['#BlockBank', '#DeFi', '#RWA', '#Innovation'],
    variables: ['hook', 'feature_description', 'benefits', 'cta']
  },
  'educational-thread': {
    type: 'educational-thread',
    name: 'Educational Thread',
    description: 'Template to create an educational thread (especially Twitter)',
    structure: [
      '{title_hook}',
      '{point_1}',
      '{point_2}',
      '{point_3}',
      '{conclusion}'
    ],
    tone: ['educational', 'professional'],
    networks: ['twitter', 'linkedin'],
    hashtags: ['#Education', '#DeFi', '#RWA', '#Tokenisation'],
    variables: ['title_hook', 'point_1', 'point_2', 'point_3', 'conclusion']
  },
  'partnership-announcement': {
    type: 'partnership-announcement',
    name: 'Partnership Announcement',
    description: 'Template to announce a partnership',
    structure: [
      '{partnership_intro}',
      '{partner_details}',
      '{synergy_benefits}',
      '{future_impact}',
      '{cta}'
    ],
    tone: ['professional', 'institutional'],
    networks: ['linkedin', 'twitter', 'facebook'],
    hashtags: ['#Partnership', '#BlockBank', '#RWA', '#Innovation'],
    variables: ['partnership_intro', 'partner_details', 'synergy_benefits', 'future_impact', 'cta']
  },
  'use-case-story': {
    type: 'use-case-story',
    name: 'Use Case Story',
    description: 'Template to tell a concrete use case',
    structure: [
      '{scenario_intro}',
      '{problem}',
      '{solution}',
      '{results}',
      '{takeaway}'
    ],
    tone: ['professional', 'educational'],
    networks: ['linkedin', 'facebook', 'instagram'],
    hashtags: ['#UseCase', '#BlockBank', '#RWA', '#Success'],
    variables: ['scenario_intro', 'problem', 'solution', 'results', 'takeaway']
  },
  'industry-insight': {
    type: 'industry-insight',
    name: 'Industry Insight',
    description: 'Template to share an analysis or trend',
    structure: [
      '{insight_hook}',
      '{data_fact}',
      '{analysis}',
      '{implication}',
      '{blockbank_angle}'
    ],
    tone: ['professional', 'technical'],
    networks: ['linkedin', 'twitter'],
    hashtags: ['#IndustryInsight', '#DeFi', '#RWA', '#Blockchain'],
    variables: ['insight_hook', 'data_fact', 'analysis', 'implication', 'blockbank_angle']
  },
  'call-to-action': {
    type: 'call-to-action',
    name: 'Call to Action',
    description: 'Template to encourage action',
    structure: [
      '{value_proposition}',
      '{urgency_reason}',
      '{clear_cta}',
      '{next_step}'
    ],
    tone: ['professional'],
    networks: ['facebook', 'instagram', 'linkedin', 'twitter'],
    hashtags: ['#BlockBank', '#JoinUs', '#DeFi', '#RWA'],
    variables: ['value_proposition', 'urgency_reason', 'clear_cta', 'next_step']
  },
  'success-story': {
    type: 'success-story',
    name: 'Success Story',
    description: 'Template to share a success or testimonial',
    structure: [
      '{achievement_hook}',
      '{context}',
      '{journey}',
      '{outcome}',
      '{gratitude}'
    ],
    tone: ['professional', 'institutional'],
    networks: ['linkedin', 'facebook', 'instagram'],
    hashtags: ['#SuccessStory', '#BlockBank', '#Achievement', '#RWA'],
    variables: ['achievement_hook', 'context', 'journey', 'outcome', 'gratitude']
  }
}

export function getTemplate(type: PostTemplateType): PostTemplate {
  return POST_TEMPLATES[type]
}

export function getAllTemplates(): PostTemplate[] {
  return Object.values(POST_TEMPLATES)
}

export function getTemplatesForNetwork(network: SocialNetwork): PostTemplate[] {
  return getAllTemplates().filter(template => template.networks.includes(network))
}

