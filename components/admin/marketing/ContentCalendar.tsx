'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { CalendarEvent, SocialNetwork } from '@/types/marketing.types'
import { generateNext30DaysCalendar } from '@/lib/services/editorialCalendarGenerator'

const NETWORK_LABELS: Record<SocialNetwork, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

const NETWORK_COLORS: Record<SocialNetwork, string> = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  linkedin: '#0077B5',
  tiktok: '#000000',
  youtube: '#FF0000',
}

export default function ContentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<'month' | 'week'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [currentDate, view])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      if (view === 'week') {
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        start.setTime(weekStart.getTime())
        end.setTime(weekEnd.getTime())
      }

      const params = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })

      const response = await fetch(`/api/admin/marketing/calendar?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction * 7))
    setCurrentDate(newDate)
  }

  const handleGenerateCalendar = async () => {
    setIsGenerating(true)
    try {
      const result = generateNext30DaysCalendar(['linkedin', 'twitter', 'facebook', 'instagram'])
      
      // Sauvegarder les événements générés (pour l'instant on les affiche juste)
      // TODO: Implémenter la sauvegarde via API
      setEvents(result.events)
      
      // Recharger les événements depuis l'API pour avoir les IDs
      await loadEvents()
      
      alert(`Calendar generated successfully! ${result.events.length} events created.`)
    } catch (error) {
      console.error('Error generating calendar:', error)
      alert('Error generating calendar')
    } finally {
      setIsGenerating(false)
    }
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Jours du mois précédent
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      })
    }

    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Compléter jusqu'à 42 cases (6 semaines)
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0]
      return eventDate === dateStr
    })
  }

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getWeekDays = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Editorial Calendar</h2>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <Button
            variant="primary"
            size="small"
            onClick={handleGenerateCalendar}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : '✨ Generate calendar (30 days)'}
          </Button>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant={view === 'month' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setView('week')}
            >
              Week
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="secondary"
              size="small"
              onClick={() => view === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
            >
              ←
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => view === 'month' ? navigateMonth(1) : navigateWeek(1)}
            >
              →
            </Button>
          </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p>Chargement...</p>
        </div>
      ) : view === 'month' ? (
        <Card variant="elevated" style={{ padding: 'var(--space-4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)', fontSize: '20px', fontWeight: '600' }}>
            {formatMonthYear()}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-2)' }}>
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div key={day} style={{ padding: 'var(--space-2)', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, index) => {
              const dayEvents = getEventsForDate(day.date)
              const isToday = day.date.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  style={{
                    minHeight: '100px',
                    border: '1px solid var(--color-border-default)',
                    padding: 'var(--space-2)',
                    background: day.isCurrentMonth ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
                    opacity: day.isCurrentMonth ? 1 : 0.5,
                    position: 'relative',
                    ...(isToday && {
                      border: '2px solid #3B82F6',
                      background: 'rgba(59, 130, 246, 0.05)',
                    }),
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: isToday ? '600' : '400', marginBottom: 'var(--space-2)' }}>
                    {day.date.getDate()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: event.color || NETWORK_COLORS[event.networks[0]] || '#6B7280',
                          color: 'white',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        +{dayEvents.length - 3} autres
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ) : (
        <Card variant="elevated" style={{ padding: 'var(--space-4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)', fontSize: '20px', fontWeight: '600' }}>
            Week of {getWeekDays()[0].toLocaleDateString('en-US')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--space-2)' }}>
            {getWeekDays().map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()
              
              return (
                <div key={index} style={{ border: '1px solid var(--color-border-default)', padding: 'var(--space-3)' }}>
                  <div style={{ fontSize: '16px', fontWeight: isToday ? '600' : '400', marginBottom: 'var(--space-3)' }}>
                    {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        style={{
                          padding: 'var(--space-2)',
                          borderRadius: '6px',
                          background: event.color || NETWORK_COLORS[event.networks[0]] || '#6B7280',
                          color: 'white',
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{event.title}</div>
                        {event.description && (
                          <div style={{ fontSize: '11px', opacity: 0.9 }}>{event.description}</div>
                        )}
                        <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
                          {new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

