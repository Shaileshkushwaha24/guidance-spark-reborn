import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CareerSearchBar = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const suggestions = [
    "Technology",
    "Healthcare",
    "Business",
    "Creative Arts",
    "Engineering",
    "Science",
  ];

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/careers?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative flex items-center gap-2 p-2 rounded-2xl bg-card border-2 transition-all duration-300 ${
          isFocused
            ? "border-primary shadow-glow"
            : "border-border hover:border-primary/50"
        }`}
      >
        <div className="flex items-center gap-2 flex-1 px-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your interests or skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="rounded-xl px-6 gap-2 ripple"
          size="lg"
        >
          <Sparkles className="w-4 h-4" />
          Explore
        </Button>
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            className="px-4 py-1.5 text-sm rounded-full bg-accent/50 text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
