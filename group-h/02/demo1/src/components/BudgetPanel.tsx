import { useMemo } from 'react'
import { Wallet, TrendingUp, AlertCircle } from 'lucide-react'
import { useTrip } from '@/context/TripContext'
import { ACTIVITY_TYPES } from '@/types'
import type { ActivityType } from '@/types'

export function BudgetPanel() {
  const { state } = useTrip()
  const { trip } = state

  const stats = useMemo(() => {
    let total = 0
    const byType: Record<string, number> = {}

    for (const day of trip.days) {
      for (const act of day.activities) {
        total += act.cost
        const key = act.type
        byType[key] = (byType[key] || 0) + act.cost
      }
    }

    return { total, byType }
  }, [trip.days])

  const remaining = trip.totalBudget - stats.total
  const usagePercent = trip.totalBudget > 0 ? Math.min((stats.total / trip.totalBudget) * 100, 100) : 0
  const isOverBudget = remaining < 0

  const sortedTypes = Object.entries(stats.byType)
    .sort(([, a], [, b]) => b - a)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-travel-teal/10 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-travel-teal" />
        </div>
        <h3 className="font-semibold text-foreground">预算概览</h3>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-2xl font-bold text-foreground">
              ¥{stats.total.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">已规划花费</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${isOverBudget ? 'text-destructive' : 'text-travel-teal'}`}>
              ¥{Math.abs(remaining).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? '超出预算' : '剩余预算'}
            </p>
          </div>
        </div>

        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-smooth ${
              isOverBudget ? 'bg-destructive' : 'bg-gradient-hero'
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">
            {usagePercent.toFixed(0)}% 已使用
          </span>
          <span className="text-xs text-muted-foreground">
            总预算 ¥{trip.totalBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {isOverBudget && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10 mb-4">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">
            预算已超支 ¥{Math.abs(remaining).toLocaleString()}，建议调整行程安排
          </p>
        </div>
      )}

      {/* Breakdown */}
      {sortedTypes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              花费分类
            </span>
          </div>
          <div className="space-y-2.5">
            {sortedTypes.map(([type, amount]) => {
              const typeInfo = ACTIVITY_TYPES[type as ActivityType]
              const pct = stats.total > 0 ? (amount / stats.total) * 100 : 0
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-sm">{typeInfo.emoji}</span>
                  <span className="text-sm text-foreground w-10">{typeInfo.label}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-smooth"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: typeInfo.color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-16 text-right">
                    ¥{amount.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {sortedTypes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          添加活动后，这里会显示花费分类统计
        </p>
      )}
    </div>
  )
}
