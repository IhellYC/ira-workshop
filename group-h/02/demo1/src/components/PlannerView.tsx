import { ArrowLeft, MapPin, Calendar, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/TripContext'
import { DayCard } from '@/components/DayCard'
import { BudgetPanel } from '@/components/BudgetPanel'

export function PlannerView() {
  const { state, dispatch } = useTrip()
  const { trip, activeDayIndex } = state

  if (!trip.destination || trip.days.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'setup' })}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img
                src={trip.destination.image}
                alt={trip.destination.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-sm font-semibold text-foreground leading-tight">
                  {trip.destination.name}之旅
                </h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {trip.destination.country}
                  <Calendar className="w-3 h-3 ml-1" />
                  {trip.days.length} 天
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'RESET' })}
            className="text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            重新规划
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Left: Day Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">
                每日行程
              </h2>
              <span className="text-sm text-muted-foreground">
                {trip.startDate} ~ {trip.endDate}
              </span>
            </div>

            {trip.days.map((_, i) => (
              <DayCard
                key={i}
                dayIndex={i}
                isActive={i === activeDayIndex}
              />
            ))}
          </div>

          {/* Right: Budget Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BudgetPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
