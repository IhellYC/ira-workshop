import { useState, useMemo } from "react";
import { HeroSection } from "./components/HeroSection";
import { CategoryFilter } from "./components/CategoryFilter";
import { SearchBar } from "./components/SearchBar";
import { SkillList } from "./components/SkillList";
import { Footer } from "./components/Footer";
import { skills, type CategoryId } from "./data/skills";

function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = useMemo(() => {
    let result = skills;

    if (activeCategory !== "all") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <main>
        <SkillList skills={filteredSkills} searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
