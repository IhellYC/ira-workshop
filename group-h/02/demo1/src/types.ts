export interface Destination {
  id: string
  name: string
  country: string
  image: string
  description: string
}

export interface Activity {
  id: string
  time: string
  title: string
  type: 'attraction' | 'food' | 'hotel' | 'transport' | 'other'
  cost: number
  note: string
}

export interface DayPlan {
  id: string
  date: string
  activities: Activity[]
}

export interface Trip {
  id: string
  destination: Destination | null
  startDate: string
  endDate: string
  days: DayPlan[]
  totalBudget: number
}

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'tokyo',
    name: '东京',
    country: '日本',
    image: '/images/destination-tokyo.png',
    description: '传统与现代交织的璀璨都市',
  },
  {
    id: 'paris',
    name: '巴黎',
    country: '法国',
    image: '/images/destination-paris.png',
    description: '浪漫之都，艺术与美食的天堂',
  },
  {
    id: 'bali',
    name: '巴厘岛',
    country: '印度尼西亚',
    image: '/images/destination-bali.png',
    description: '热带天堂，梯田与海滩的诗意',
  },
]

export const ACTIVITY_TYPES = {
  attraction: { label: '景点', emoji: '🏛️', color: 'hsl(var(--travel-primary))' },
  food: { label: '美食', emoji: '🍜', color: 'hsl(var(--travel-accent))' },
  hotel: { label: '住宿', emoji: '🏨', color: 'hsl(var(--travel-teal))' },
  transport: { label: '交通', emoji: '🚄', color: 'hsl(var(--muted-foreground))' },
  other: { label: '其他', emoji: '📌', color: 'hsl(var(--travel-sand))' },
} as const

export type ActivityType = keyof typeof ACTIVITY_TYPES
