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
    name: 'Annonce Produit',
    description: 'Template pour annoncer une nouvelle fonctionnalité ou un produit',
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
    name: 'Thread Éducatif',
    description: 'Template pour créer un thread éducatif (surtout Twitter)',
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
    name: 'Annonce Partenariat',
    description: 'Template pour annoncer un partenariat',
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
    name: 'Histoire de Cas d\'Usage',
    description: 'Template pour raconter un cas d\'usage concret',
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
    name: 'Insight Industrie',
    description: 'Template pour partager une analyse ou une tendance',
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
    name: 'Appel à l\'Action',
    description: 'Template pour inciter à l\'action',
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
    name: 'Histoire de Succès',
    description: 'Template pour partager un succès ou témoignage',
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

