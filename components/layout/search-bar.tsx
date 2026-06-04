import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  defaultValue?: string;
  compact?: boolean;
}

export function SearchBar({ defaultValue, compact = false }: SearchBarProps) {
  return (
    <form action="/" className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder="Search handbags, totes, travel bags..."
          className={compact ? "h-10 rounded-full pl-10" : "h-12 rounded-full pl-10"}
        />
      </div>
      <Button
        type="submit"
        className={compact ? "h-10 rounded-full px-4" : "h-12 rounded-full px-5"}
      >
        Search
      </Button>
    </form>
  );
}
