import { useState } from 'react'
import { Plus, X, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrip } from '@/context/TripContext'
import { ACTIVITY_TYPES } from '@/types'
import type { Activity, ActivityType } from '@/types'

function genId() {
  return `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

interface AddActivityFormProps {
  onAdd: (activity: Activity) => void
  onCancel: () => void
}

function AddActivityForm({ onAdd, onCancel }: AddActivityFormProps) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('09:00')
  const [type, setType] = useState<ActivityType>('attraction')
  const [cost, setCost] = useState('')
  const [note, setNote] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      id: genId(),
      title: title.trim(),
      time,
      type,
      cost: Number(cost) || 0,
      note: note.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-border bg-card shadow-card animate-scale-in">
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">时间</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">类型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {(Object.entries(ACTIVITY_TYPES) as [ActivityType, typeof ACTIVITY_TYPES[ActivityType]][]).map(
                ([key, val]) => (
                  <option key={key} value={key}>
                    {val.emoji} {val.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1">活动名称</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：参观浅草寺"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">费用 (¥)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">备注</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="可选备注"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" variant="travel" size="sm" disabled={!title.trim()}>
          添加
        </Button>
      </div>
    </form>
  )
}

interface DayCardProps {
  dayIndex: number
  isActive: boolean
}

export function DayCard({ dayIndex, isActive }: DayCardProps) {
  const { state, dispatch } = useTrip()
  const day = state.trip.days[dayIndex]
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(isActive)

  const dayNumber = dayIndex + 1
  const dateObj = new Date(day.date)
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[dateObj.getDay()]
  const dateLabel = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
  const dayCost = day.activities.reduce((sum, a) => sum + a.cost, 0)

  const sortedActivities = [...day.activities].sort((a, b) =>
    a.time.localeCompare(b.time)
  )

  function handleAddActivity(activity: Activity) {
    dispatch({ type: 'ADD_ACTIVITY', payload: { dayIndex, activity } })
    setShowForm(false)
  }

  function handleRemoveActivity(activityId: string) {
    dispatch({ type: 'REMOVE_ACTIVITY', payload: { dayIndex, activityId } })
  }

  return (
    <div
      className={`rounded-2xl border transition-smooth ${
        isActive
          ? 'border-travel-primary/30 shadow-travel bg-card'
          : 'border-border bg-card hover:shadow-card'
      }`}
    >
      {/* Day Header */}
      <button
        onClick={() => {
          setExpanded(!expanded)
          dispatch({ type: 'SET_ACTIVE_DAY', payload: dayIndex })
        }}
        className="w-full flex items-center justify-between p-5 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              isActive
                ? 'bg-gradient-hero text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            D{dayNumber}
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground">
              第 {dayNumber} 天
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {dateLabel} {weekDay}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {day.activities.length} 项活动
              {dayCost > 0 && ` · ¥${dayCost.toLocaleString()}`}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Activities Timeline */}
      {expanded && (
        <div className="px-5 pb-5 animate-fade-in">
          {sortedActivities.length > 0 && (
            <div className="relative ml-5 pl-6 border-l-2 border-border space-y-4 mb-4">
              {sortedActivities.map((activity) => {
                const typeInfo = ACTIVITY_TYPES[activity.type]
                return (
                  <div key={activity.id} className="relative group">
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-card"
                      style={{ backgroundColor: typeInfo.color }}
                    />

                    <div className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-smooth">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {typeInfo.emoji} {activity.title}
                          </p>
                          {activity.note && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {activity.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {activity.cost > 0 && (
                          <span className="text-xs font-medium text-travel-accent">
                            ¥{activity.cost.toLocaleString()}
                          </span>
                        )}
                        <button
                          onClick={() => handleRemoveActivity(activity.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-destructive/10 transition-smooth"
                        >
                          <X className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {showForm ? (
            <AddActivityForm
              onAdd={handleAddActivity}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-1" />
              添加活动
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
