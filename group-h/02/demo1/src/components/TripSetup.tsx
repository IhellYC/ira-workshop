import { useState } from 'react'
import { MapPin, Calendar, Wallet, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/TripContext'
import { POPULAR_DESTINATIONS } from '@/types'
import type { Destination } from '@/types'

export function TripSetupPanel() {
  const { state, dispatch } = useTrip()
  const { trip } = state
  const [searchQuery, setSearchQuery] = useState('')
  const [budgetInput, setBudgetInput] = useState(trip.totalBudget.toString())

  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    (d) =>
      d.name.includes(searchQuery) ||
      d.country.includes(searchQuery) ||
      d.description.includes(searchQuery)
  )

  function handleSelectDest(dest: Destination) {
    dispatch({ type: 'SET_DESTINATION', payload: dest })
  }

  function handleStartPlanning() {
    if (!trip.destination || !trip.startDate || !trip.endDate) return
    dispatch({ type: 'SET_BUDGET', payload: Number(budgetInput) || 10000 })
    dispatch({ type: 'START_PLANNING' })
  }

  const isReady = trip.destination && trip.startDate && trip.endDate

  return (
    <div className="min-h-screen bg-gradient-surface">
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">创建旅行计划</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-3xl">
        {/* Step 1: Destination */}
        <section className="mb-12 animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">选择目的地</h2>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索城市或国家..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredDestinations.map((dest) => {
              const isSelected = trip.destination?.id === dest.id
              return (
                <button
                  key={dest.id}
                  onClick={() => handleSelectDest(dest)}
                  className={`group relative rounded-xl overflow-hidden h-36 transition-smooth cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-travel-primary ring-offset-2 ring-offset-background'
                      : 'hover:shadow-card-hover'
                  }`}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-sm font-semibold text-primary-foreground">{dest.name}</p>
                    <p className="text-xs text-primary-foreground/70">{dest.country}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-travel-primary flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Step 2: Dates */}
        <section className="mb-12 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">选择日期</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">出发日期</label>
              <input
                type="date"
                value={trip.startDate}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_DATES',
                    payload: { start: e.target.value, end: trip.endDate || e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">返回日期</label>
              <input
                type="date"
                value={trip.endDate}
                min={trip.startDate}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_DATES',
                    payload: { start: trip.startDate, end: e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              />
            </div>
          </div>

          {trip.days.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              共 <span className="font-semibold text-travel-primary">{trip.days.length}</span> 天行程
            </p>
          )}
        </section>

        {/* Step 3: Budget */}
        <section className="mb-12 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-travel-teal flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">预算设置</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-muted-foreground">¥</span>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="10000"
              className="w-48 px-4 py-3 rounded-xl border border-input bg-card text-foreground text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
            <span className="text-sm text-muted-foreground">总预算</span>
          </div>
        </section>

        {/* Start Button */}
        <div className="flex justify-center pt-4 pb-16">
          <Button
            variant="travel"
            size="xl"
            disabled={!isReady}
            onClick={handleStartPlanning}
            className="min-w-[200px]"
          >
            开始规划行程
          </Button>
        </div>
      </main>
    </div>
  )
}
