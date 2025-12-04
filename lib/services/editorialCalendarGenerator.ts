import { CalendarEvent, SocialNetwork } from '@/types/marketing.types'
import { marketingContentEngine, ContentGenerationResult } from './marketingContentEngine'
import { ContentCategory } from '@/types/marketing.types'

export interface CalendarGenerationOptions {
  startDate: Date
  endDate: Date
  postsPerDay?: number
  networks?: SocialNetwork[]
  categories?: ContentCategory[]
}

export interface DailyPostPlan {
  date: Date
  posts: CalendarEvent[]
  category: ContentCategory
}

export interface WeeklyEditorialPlan {
  weekStart: Date
  weekEnd: Date
  dailyPlans: DailyPostPlan[]
  theme: string
}

export interface CalendarGenerationResult {
  events: CalendarEvent[]
  dailyPlans: DailyPostPlan[]
  weeklyPlans: WeeklyEditorialPlan[]
}

const WEEKLY_THEMES = [
  'Focus Product & Features',
  'Éducation & RWA',
  'Cas d\'Usage & Partenaires',
  'Institutionnel & Compliance',
  'Industry News & Trends',
  'Success Stories & Engagement',
  'Community & Updates'
]

const NETWORK_DISTRIBUTION: Record<SocialNetwork, { postsPerDay: number, optimalTimes: string[] }> = {
  linkedin: { postsPerDay: 2, optimalTimes: ['08:00', '12:00', '17:00'] },
  twitter: { postsPerDay: 5, optimalTimes: ['09:00', '12:00', '15:00', '18:00', '21:00'] },
  facebook: { postsPerDay: 1, optimalTimes: ['09:00', '13:00', '19:00'] },
  instagram: { postsPerDay: 1, optimalTimes: ['11:00', '14:00', '17:00'] },
  tiktok: { postsPerDay: 1, optimalTimes: ['09:00', '17:00', '21:00'] },
  youtube: { postsPerDay: 0.2, optimalTimes: ['14:00', '18:00'] } // ~1 vidéo par semaine
}

const DAY_CATEGORY_MAP: Record<number, ContentCategory> = {
  0: 'success-stories', // Dimanche
  1: 'product-features', // Lundi
  2: 'educational', // Mardi
  3: 'use-cases', // Mercredi
  4: 'institutional', // Jeudi
  5: 'industry-news', // Vendredi
  6: 'success-stories' // Samedi
}

export class EditorialCalendarGenerator {
  /**
   * Génère un calendrier éditorial complet
   */
  generateCalendar(options: CalendarGenerationOptions): CalendarGenerationResult {
    const {
      startDate,
      endDate,
      postsPerDay = 3,
      networks = ['linkedin', 'twitter', 'facebook', 'instagram'],
      categories
    } = options

    const events: CalendarEvent[] = []
    const dailyPlans: DailyPostPlan[] = []
    const weeklyPlans: WeeklyEditorialPlan[] = []

    // Générer pour chaque jour
    const currentDate = new Date(startDate)
    let weekStart: Date | null = null
    let currentWeekPlan: DailyPostPlan[] = []

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      const category = categories 
        ? categories[dayOfWeek % categories.length]
        : this.getCategoryForDay(dayOfWeek)

      // Démarrer une nouvelle semaine si nécessaire
      if (dayOfWeek === 1 || weekStart === null) {
        if (weekStart !== null && currentWeekPlan.length > 0) {
          weeklyPlans.push({
            weekStart: new Date(weekStart),
            weekEnd: new Date(currentDate.getTime() - 86400000),
            dailyPlans: [...currentWeekPlan],
            theme: this.getWeeklyTheme(weekStart)
          })
        }
        weekStart = new Date(currentDate)
        currentWeekPlan = []
      }

      // Générer les posts pour ce jour
      const dayPlan = this.generateDailyPlan(currentDate, category, postsPerDay, networks)
      dailyPlans.push(dayPlan)
      currentWeekPlan.push(dayPlan)
      events.push(...dayPlan.posts)

      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Ajouter la dernière semaine
    if (weekStart !== null && currentWeekPlan.length > 0) {
      weeklyPlans.push({
        weekStart: new Date(weekStart),
        weekEnd: endDate,
        dailyPlans: currentWeekPlan,
        theme: this.getWeeklyTheme(weekStart)
      })
    }

    return {
      events,
      dailyPlans,
      weeklyPlans
    }
  }

  /**
   * Génère un plan pour un jour spécifique
   */
  generateDailyPlan(
    date: Date,
    category: ContentCategory,
    targetPosts: number,
    networks: SocialNetwork[]
  ): DailyPostPlan {
    const posts: CalendarEvent[] = []
    
    // Générer du contenu pour cette catégorie
    const generatedContent = marketingContentEngine.generateByCategory(
      category,
      Math.ceil(targetPosts * 1.5), // Générer plus pour avoir des options
      networks
    )

    // Distribuer les posts selon les réseaux
    let postIndex = 0
    const usedNetworks = new Set<SocialNetwork>()

    networks.forEach(network => {
      const distribution = NETWORK_DISTRIBUTION[network]
      const postsForNetwork = Math.ceil(distribution.postsPerDay)

      for (let i = 0; i < postsForNetwork && postIndex < generatedContent.length; i++) {
        const content = generatedContent[postIndex]
        const optimalTime = this.getOptimalTime(date, distribution.optimalTimes)

        // Créer un événement calendrier
        const event: CalendarEvent = {
          id: `event-${date.toISOString()}-${postIndex}-${Date.now()}`,
          title: content.metadata?.title || `Post ${postIndex + 1}`,
          description: content.baseContent.substring(0, 200),
          startDate: optimalTime.toISOString(),
          endDate: null,
          postId: null, // Sera rempli lors de la création du post
          promotionId: null,
          adWordsCampaignId: null,
          networks: [network],
          color: this.getNetworkColor(network),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: null
        }

        posts.push(event)
        usedNetworks.add(network)
        postIndex++
      }
    })

    // Si pas assez de posts, générer plus avec des réseaux variés
    while (posts.length < targetPosts && postIndex < generatedContent.length) {
      const network = networks[posts.length % networks.length]
      const distribution = NETWORK_DISTRIBUTION[network]
      const optimalTime = this.getOptimalTime(date, distribution.optimalTimes)

      const content = generatedContent[postIndex]
      const event: CalendarEvent = {
        id: `event-${date.toISOString()}-${postIndex}-${Date.now()}`,
        title: content.metadata?.title || `Post ${postIndex + 1}`,
        description: content.baseContent.substring(0, 200),
        startDate: optimalTime.toISOString(),
        endDate: null,
        postId: null,
        promotionId: null,
        adWordsCampaignId: null,
        networks: [network],
        color: this.getNetworkColor(network),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: null
      }

      posts.push(event)
      postIndex++
    }

    // Trier les posts par heure
    posts.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )

    return {
      date: new Date(date),
      posts,
      category
    }
  }

  /**
   * Génère un calendrier pour les 30 prochains jours
   */
  generateNext30Days(networks?: SocialNetwork[]): CalendarGenerationResult {
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30)

    return this.generateCalendar({
      startDate,
      endDate,
      networks: networks || ['linkedin', 'twitter', 'facebook', 'instagram'],
      postsPerDay: 3
    })
  }

  /**
   * Génère un calendrier pour une semaine spécifique
   */
  generateWeek(startDate: Date, networks?: SocialNetwork[]): CalendarGenerationResult {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    return this.generateCalendar({
      startDate,
      endDate,
      networks: networks || ['linkedin', 'twitter', 'facebook'],
      postsPerDay: 3
    })
  }

  /**
   * Obtient la catégorie pour un jour de la semaine
   */
  private getCategoryForDay(dayOfWeek: number): ContentCategory {
    return DAY_CATEGORY_MAP[dayOfWeek] || 'product-features'
  }

  /**
   * Obtient le thème de la semaine
   */
  private getWeeklyTheme(weekStart: Date): string {
    const weeksSinceStart = Math.floor((weekStart.getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    return WEEKLY_THEMES[weeksSinceStart % WEEKLY_THEMES.length]
  }

  /**
   * Calcule l'heure optimale pour un post
   */
  private getOptimalTime(date: Date, optimalTimes: string[]): Date {
    const timeSlot = optimalTimes[Math.floor(Math.random() * optimalTimes.length)]
    const [hours, minutes] = timeSlot.split(':').map(Number)
    
    const postDate = new Date(date)
    postDate.setHours(hours, minutes, 0, 0)
    
    return postDate
  }

  /**
   * Obtient la couleur pour un réseau
   */
  private getNetworkColor(network: SocialNetwork): string {
    const colors: Record<SocialNetwork, string> = {
      linkedin: '#0077B5',
      twitter: '#1DA1F2',
      facebook: '#1877F2',
      instagram: '#E4405F',
      tiktok: '#000000',
      youtube: '#FF0000'
    }
    return colors[network] || '#6B7280'
  }
}

// Instance singleton
export const editorialCalendarGenerator = new EditorialCalendarGenerator()

// Fonctions utilitaires exportées
export function generateEditorialCalendar(options: CalendarGenerationOptions): CalendarGenerationResult {
  return editorialCalendarGenerator.generateCalendar(options)
}

export function generateNext30DaysCalendar(networks?: SocialNetwork[]): CalendarGenerationResult {
  return editorialCalendarGenerator.generateNext30Days(networks)
}

export function generateWeekCalendar(startDate: Date, networks?: SocialNetwork[]): CalendarGenerationResult {
  return editorialCalendarGenerator.generateWeek(startDate, networks)
}

