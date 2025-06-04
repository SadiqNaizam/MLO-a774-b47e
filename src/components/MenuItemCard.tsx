import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle } from 'lucide-react'; // Example icon

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  // needsCustomization?: boolean; // To decide if clicking shows a dialog or adds directly
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void; // Or onCustomize if it always opens a dialog
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  console.log("Rendering MenuItemCard:", item.name);

  const handleActionClick = () => {
    console.log("Action clicked for MenuItem:", item.name, item.id);
    onAddToCart(item); // This could trigger a dialog or add directly based on item.needsCustomization
  };

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden">
      {item.imageUrl && (
        <div className="md:w-1/3 p-2 self-center">
          <AspectRatio ratio={1 / 1} className="rounded-md overflow-hidden">
            <img
              src={item.imageUrl || '/placeholder.svg'}
              alt={item.name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </div>
      )}
      <div className={`flex flex-col justify-between ${item.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">{item.name}</CardTitle>
          {item.description && (
            <CardDescription className="text-xs text-gray-600 line-clamp-2">
              {item.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <span className="text-lg font-semibold text-green-700">${item.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleActionClick} aria-label={`Add ${item.name} to cart`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add
            {/* Or "Customize" if needsCustomization is true */}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;