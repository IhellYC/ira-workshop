import { MapPin, Calendar, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/TripContext'
import { POPULAR_DESTINATIONS } from '@/types'

export function HeroSection() {
  const { dispatch } = useTrip()

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/travel-hero.png"
          alt="壮丽的热带海岸线风光"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-2xl animate-fade-up">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-5 h-5 text-travel-accent" />
            <span className="text-sm font-medium tracking-wide uppercase text-travel-accent">
              探索世界
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6">
            规划你的
            <br />
            <span className="text-travel-accent">完美旅程</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-lg leading-relaxed">
            选择目的地，安排每日行程，管理旅行预算。让每一次出发都充满期待，让每一段旅途都值得回忆。
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="coral"
              size="xl"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'setup' })}
            >
              <MapPin className="w-5 h-5 mr-2" />
              开始规划
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => {
                document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Calendar className="w-5 h-5 mr-2" />
              浏览热门目的地
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DestinationSection() {
  const { dispatch } = useTrip()

  function handleSelect(dest: typeof POPULAR_DESTINATIONS[0]) {
    dispatch({ type: 'SET_DESTINATION', payload: dest })
    dispatch({ type: 'SET_VIEW', payload: 'setup' })
  }

  return (
    <section id="destinations" className="py-24 bg-gradient-surface">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium tracking-wide uppercase text-travel-primary mb-3 block">
            热门推荐
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            发现你的下一站
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            精选全球最受欢迎的旅行目的地，点击即可开始规划
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {POPULAR_DESTINATIONS.map((dest, i) => (
            <button
              key={dest.id}
              onClick={() => handleSelect(dest)}
              className="group text-left rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth cursor-pointer bg-card"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image}
                  alt={`${dest.name}风景`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground">
                  {dest.country}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-travel-primary transition-smooth">
                  {dest.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dest.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
