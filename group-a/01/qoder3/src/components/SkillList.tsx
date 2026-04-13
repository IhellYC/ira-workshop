import { SkillCard } from "./SkillCard";
import type { SkillItem } from "@/data/skills";
import { Search } from "lucide-react";

interface SkillListProps {
  skills: SkillItem[];
  searchQuery: string;
}

export function SkillList({ skills, searchQuery }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Search className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          {searchQuery ? `未找到与 "${searchQuery}" 相关的项目` : "该分类暂无项目"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">
          共 <span className="text-foreground font-semibold">{skills.length}</span> 个项目
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {skills.map((skill, i) => (
          <SkillCard key={skill.id} skill={skill} index={i} />
        ))}
      </div>
    </div>
  );
}
