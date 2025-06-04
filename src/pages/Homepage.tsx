import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import CuisineCategoryFilter from '@/components/CuisineCategoryFilter';
import RestaurantCard from '@/components/RestaurantCard';
import { Search, User, ShoppingCart } from 'lucide-react';

// Placeholder Data
const sampleCuisines = [
  { id: '1', name: 'Italian' },
  { id: '2', name: 'Mexican' },
  { id: '3', name: 'Chinese' },
  { id: '4', name: 'Indian' },
  { id: '5', name: 'Burgers' },
  { id: '6', name: 'Pizza' },
  { id: '7', name: 'Sushi' },
];

const sampleRestaurants = [
  { id: 'r1', name: 'Bella Italia', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Italian', rating: 4.5, deliveryTime: '30-40 min' },
  { id: 'r2', name: 'Taco Fiesta', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Mexican', rating: 4.2, deliveryTime: '25-35 min' },
  { id: 'r3', name: 'Dragon Wok', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Chinese', rating: 4.0, deliveryTime: '35-45 min' },
  { id: 'r4', name: 'Curry House', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Indian', rating: 4.7, deliveryTime: '40-50 min' },
];

const Homepage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisineId, setSelectedCuisineId] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Homepage loaded');
    // Simulate API call
    setTimeout(() => {
      setRestaurants(sampleRestaurants);
      setLoading(false);
    }, 1500);
  }, []);

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedCuisineId || restaurant.cuisine === sampleCuisines.find(c => c.id === selectedCuisineId)?.name)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle() + " font-bold text-lg"}>
                  FoodFleet
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-2">
             <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/cart" className={navigationMenuTriggerStyle()}>
                            <ShoppingCart className="h-5 w-5" />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/profile" className={navigationMenuTriggerStyle()}>
                            <User className="h-5 w-5" />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center">Discover Your Next Meal</h1>
          <p className="text-lg text-muted-foreground text-center mb-6">Search for your favorite restaurants or filter by cuisine.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants..."
              className="pl-10 w-full text-base py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="mb-8">
          <CuisineCategoryFilter
            cuisines={sampleCuisines}
            selectedCuisineId={selectedCuisineId}
            onCuisineSelect={setSelectedCuisineId}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Popular Restaurants</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ScrollArea className="h-auto"> {/* Adjust height as needed or remove if not constraining height */}
              {filteredRestaurants.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRestaurants.map(restaurant => (
                        <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        onClick={() => handleRestaurantClick(restaurant.id)}
                        />
                    ))}
                 </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">No restaurants found. Try adjusting your search or filters.</p>
              )}
            </ScrollArea>
          )}
        </section>
      </main>

      <footer className="py-6 border-t">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FoodFleet Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;