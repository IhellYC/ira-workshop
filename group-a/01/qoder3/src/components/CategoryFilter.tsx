import { cn } from "@/lib/utils";
import { categories, type CategoryId } from "@/data/skills";

interface CategoryFilterProps {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

const categoryIcons: Record<string, string> = {
  all: "🔥",
  "agent-skills": "🧩",
  "mcp-servers": "🔌",
  "ai-agents": "🤖",
  "cursor-rules": "📐",
  copilot: "✈️",
  tools: "🛠️",
};

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <nav className="sticky top-0 z-30 glass bg-background/80 border-b border-border/50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth whitespace-nowrap",
                active === cat.id
                  ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              <span>{categoryIcons[cat.id]}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
