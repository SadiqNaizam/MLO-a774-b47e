import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star } from 'lucide-react'; // Example icon for rating

interface Restaurant {
  id: string;
  name: string;
  imageUrl?: string;
  cuisine: string;
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  // promotion?: string; // e.g., "20% OFF"
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurantId: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  console.log("Rendering RestaurantCard:", restaurant.name);

  const handleCardClick = () => {
    console.log("RestaurantCard clicked:", restaurant.id);
    onClick(restaurant.id);
  };

  return (
    <Card
      className="w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
      aria-label={`View details for ${restaurant.name}`}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={restaurant.imageUrl || '/placeholder.svg'}
            alt={`Image of ${restaurant.name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-1">
        <CardTitle className="text-lg">{restaurant.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{restaurant.cuisine}</CardDescription>
        <div className="flex items-center justify-between text-sm pt-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-700">{restaurant.deliveryTime}</span>
        </div>
      </CardContent>
      {/* Optional Footer for promotions or quick actions
      {restaurant.promotion && (
        <CardFooter className="p-4 pt-0">
          <Badge variant="destructive">{restaurant.promotion}</Badge>
        </CardFooter>
      )}
      */}
    </Card>
  );
};

export default RestaurantCard;