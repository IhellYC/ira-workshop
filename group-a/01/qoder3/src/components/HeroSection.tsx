import { Star, TrendingUp, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <header className="relative overflow-hidden pb-8 pt-12">
      {/* Background layers */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <img
        src="/images/hero-bg.png"
        alt="Agent Skills Hub background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-badge border border-primary/20 text-primary">
            <Sparkles className="w-3 h-3" />
            2026 热门推荐
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center mb-4">
          <span className="block text-3xl font-bold tracking-tight text-gradient-primary leading-tight">
            Agent Skills
          </span>
          <span className="block text-2xl font-bold tracking-tight text-foreground mt-1">
            热门推荐榜
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed mb-8">
          精选来自 GitHub 最火的 AI Agent Skills、MCP 服务器与开发工具
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6">
          <StatBadge icon={<Star className="w-3.5 h-3.5" />} value="35+" label="精选项目" />
          <StatBadge icon={<TrendingUp className="w-3.5 h-3.5" />} value="7" label="大分类" />
          <StatBadge icon={<Sparkles className="w-3.5 h-3.5" />} value="500k+" label="总 Stars" />
        </div>
      </div>
    </header>
  );
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-primary">
        {icon}
        <span className="text-lg font-bold text-foreground">{value}</span>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
