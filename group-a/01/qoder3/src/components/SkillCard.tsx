import { Star, ExternalLink, Flame } from "lucide-react";
import type { SkillItem } from "@/data/skills";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  skill: SkillItem;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block rounded-lg border border-border/60 bg-gradient-card p-4 transition-smooth",
        "hover:bg-gradient-card-hover hover:shadow-card-hover hover:border-primary/30",
        "shadow-card animate-slide-up group"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Rank badge */}
          <span className="flex-shrink-0 w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
            {index + 1}
          </span>
          <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-smooth">
            {skill.name.split("/").pop()}
          </h3>
          {skill.hot && (
            <Flame className="w-3.5 h-3.5 flex-shrink-0 text-orange-400 animate-pulse-glow" />
          )}
        </div>
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-smooth" />
      </div>

      {/* Full name */}
      <p className="text-xs text-muted-foreground mb-2 font-mono truncate">
        {skill.name}
      </p>

      {/* Description */}
      <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3 line-clamp-2">
        {skill.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Tags */}
        <div className="flex gap-1.5 overflow-hidden flex-1 mr-2">
          {skill.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Stars */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Star className="w-3 h-3 text-neon" />
          <span className="text-xs font-semibold text-neon">{skill.stars}</span>
        </div>
      </div>
    </a>
  );
}
