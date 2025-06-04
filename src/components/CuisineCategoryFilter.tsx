import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // For horizontal scrolling if many categories

interface Cuisine {
  id: string;
  name: string;
  // icon?: React.ElementType; // Optional: if you want icons for categories
}

interface CuisineCategoryFilterProps {
  cuisines: Cuisine[];
  selectedCuisineId?: string | null;
  onCuisineSelect: (cuisineId: string | null) => void;
}

const CuisineCategoryFilter: React.FC<CuisineCategoryFilterProps> = ({
  cuisines,
  selectedCuisineId,
  onCuisineSelect,
}) => {
  console.log("Rendering CuisineCategoryFilter, selected:", selectedCuisineId);

  const handleValueChange = (value: string) => {
    // ToggleGroup sends an empty string if all are unselected, or the value if one is selected.
    // We can adapt this to allow deselecting by clicking the same item again if needed,
    // or just treat empty string as "all". For simplicity, this allows single selection or "all".
    console.log("Cuisine selected:", value || "All");
    onCuisineSelect(value || null); // Send null if unselected (shows all)
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border p-2">
      <ToggleGroup
        type="single"
        variant="outline"
        value={selectedCuisineId || ""}
        onValueChange={handleValueChange}
        className="flex space-x-2 pb-2"
      >
        {cuisines.map((cuisine) => (
          <ToggleGroupItem
            key={cuisine.id}
            value={cuisine.id}
            aria-label={`Filter by ${cuisine.name}`}
            className="h-9" // Adjust height as needed
          >
            {/* {cuisine.icon && <cuisine.icon className="mr-2 h-4 w-4" />} */}
            {cuisine.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CuisineCategoryFilter;