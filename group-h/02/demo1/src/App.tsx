import { TripProvider, useTrip } from '@/context/TripContext'
import { HeroSection, DestinationSection } from '@/components/HomePage'
import { TripSetupPanel } from '@/components/TripSetup'
import { PlannerView } from '@/components/PlannerView'

function AppContent() {
  const { state } = useTrip()

  if (state.currentView === 'planner') {
    return <PlannerView />
  }

  if (state.currentView === 'setup') {
    return <TripSetupPanel />
  }

  // Home view
  return (
    <main>
      <HeroSection />
      <DestinationSection />
      <footer className="py-12 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          旅行规划师 — 让每一次出发都充满期待
        </p>
      </footer>
    </main>
  )
}

function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  )
}

export default App
