import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-destructive" /> for the AI community
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">
          Data sourced from GitHub &middot; Updated 2026.04
        </p>
      </div>
    </footer>
  );
}
