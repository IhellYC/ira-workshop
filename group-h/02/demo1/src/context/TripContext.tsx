import React, { createContext, useContext, useReducer } from 'react'
import type { Trip, DayPlan, Activity, Destination } from '@/types'

interface TripState {
  trip: Trip
  currentView: 'home' | 'setup' | 'planner'
  activeDayIndex: number
}

type TripAction =
  | { type: 'SET_VIEW'; payload: 'home' | 'setup' | 'planner' }
  | { type: 'SET_DESTINATION'; payload: Destination }
  | { type: 'SET_DATES'; payload: { start: string; end: string } }
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'SET_ACTIVE_DAY'; payload: number }
  | { type: 'ADD_ACTIVITY'; payload: { dayIndex: number; activity: Activity } }
  | { type: 'REMOVE_ACTIVITY'; payload: { dayIndex: number; activityId: string } }
  | { type: 'START_PLANNING' }
  | { type: 'RESET' }

function generateDays(start: string, end: string): DayPlan[] {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const days: DayPlan[] = []
  let current = new Date(startDate)
  let index = 0

  while (current <= endDate) {
    days.push({
      id: `day-${index}`,
      date: current.toISOString().split('T')[0],
      activities: [],
    })
    current.setDate(current.getDate() + 1)
    index++
  }

  return days
}

function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }
    case 'SET_DESTINATION':
      return {
        ...state,
        trip: { ...state.trip, destination: action.payload },
      }
    case 'SET_DATES': {
      const days = generateDays(action.payload.start, action.payload.end)
      return {
        ...state,
        trip: {
          ...state.trip,
          startDate: action.payload.start,
          endDate: action.payload.end,
          days,
        },
      }
    }
    case 'SET_BUDGET':
      return {
        ...state,
        trip: { ...state.trip, totalBudget: action.payload },
      }
    case 'SET_ACTIVE_DAY':
      return { ...state, activeDayIndex: action.payload }
    case 'ADD_ACTIVITY': {
      const newDays = [...state.trip.days]
      const day = { ...newDays[action.payload.dayIndex] }
      day.activities = [...day.activities, action.payload.activity]
      newDays[action.payload.dayIndex] = day
      return {
        ...state,
        trip: { ...state.trip, days: newDays },
      }
    }
    case 'REMOVE_ACTIVITY': {
      const newDays = [...state.trip.days]
      const day = { ...newDays[action.payload.dayIndex] }
      day.activities = day.activities.filter(
        (a) => a.id !== action.payload.activityId
      )
      newDays[action.payload.dayIndex] = day
      return {
        ...state,
        trip: { ...state.trip, days: newDays },
      }
    }
    case 'START_PLANNING':
      return { ...state, currentView: 'planner', activeDayIndex: 0 }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const initialState: TripState = {
  trip: {
    id: 'trip-1',
    destination: null,
    startDate: '',
    endDate: '',
    days: [],
    totalBudget: 10000,
  },
  currentView: 'home',
  activeDayIndex: 0,
}

const TripContext = createContext<{
  state: TripState
  dispatch: React.Dispatch<TripAction>
} | null>(null)

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialState)

  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
