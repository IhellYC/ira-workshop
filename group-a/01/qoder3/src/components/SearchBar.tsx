import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="container mx-auto px-4 py-3">
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-smooth",
        "bg-secondary/50 border-border/60",
        "focus-within:border-primary/40 focus-within:shadow-glow-primary"
      )}>
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索项目名称、描述或标签..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
