import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from '@/components/MenuItemCard';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, ShoppingCart, User, ChevronLeft } from 'lucide-react';
import { toast } from "sonner";

// Placeholder Data
const sampleRestaurantDetails = {
  id: 'r1',
  name: 'Bella Italia',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/857/857681.png', // Generic restaurant icon
  rating: 4.5,
  cuisine: 'Italian',
  address: '123 Pasta Lane, Food City',
  reviewsCount: 150,
  menu: {
    appetizers: [
      { id: 'm1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1598940023808-f36016052097?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', needsCustomization: false },
      { id: 'm2', name: 'Bruschetta', description: 'Grilled bread rubbed with garlic and topped with olive oil and salt.', price: 7.50, imageUrl: 'https://images.unsplash.com/photo-1505253716362-af242227bc07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnJ1c2NoZXR0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60', needsCustomization: false },
    ],
    mainCourses: [
      { id: 'm3', name: 'Spaghetti Carbonara', description: 'Classic carbonara with creamy sauce, pancetta, and parmesan.', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1588013273468-315088ea3426?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', needsCustomization: true, options: { size: ['Regular', 'Large'], extraCheese: true } },
      { id: 'm4', name: 'Margherita Pizza', description: 'Traditional pizza with tomato, mozzarella, and basil.', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1593504049358-7433075514de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', needsCustomization: true, options: { crust: ['Thin', 'Thick'] } },
    ],
    desserts: [
      { id: 'm5', name: 'Tiramisu', description: 'Coffee-flavoured Italian dessert.', price: 6.50, imageUrl: 'https://images.unsplash.com/photo-1571877275904-67527a73650a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', needsCustomization: false },
    ],
  }
};

// Simulating a cart store
let cartItemsGlobal: any[] = []; // In a real app, this would be context/redux/zustand

const RestaurantMenuPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<typeof sampleRestaurantDetails | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [customizationOptions, setCustomizationOptions] = useState<any>({});


  useEffect(() => {
    console.log('RestaurantMenuPage loaded for ID:', restaurantId);
    // Simulate API call
    // In a real app, fetch restaurant details based on restaurantId
    if (restaurantId === sampleRestaurantDetails.id) {
      setRestaurant(sampleRestaurantDetails);
    } else {
      // Handle restaurant not found, perhaps navigate to a 404 page or show an error
      console.error("Restaurant not found");
      // navigate('/404'); // Example
    }
  }, [restaurantId, navigate]);

  const handleAddToCart = (item: any) => {
    if (item.needsCustomization) {
      setSelectedItem(item);
      // Reset customization options based on item
      const initialOpts: any = {};
      if (item.options?.size) initialOpts.size = item.options.size[0];
      if (item.options?.extraCheese) initialOpts.extraCheese = false;
      if (item.options?.crust) initialOpts.crust = item.options.crust[0];
      setCustomizationOptions(initialOpts);
      setIsCustomizationDialogOpen(true);
    } else {
      // Add directly to cart
      cartItemsGlobal.push({...item, quantity: 1, customization: {}});
      toast.success(`${item.name} added to cart!`);
      console.log("Cart:", cartItemsGlobal);
    }
  };

  const handleCustomizationSubmit = () => {
    if (selectedItem) {
      cartItemsGlobal.push({...selectedItem, quantity: 1, customization: customizationOptions});
      toast.success(`${selectedItem.name} (customized) added to cart!`);
      console.log("Cart with customization:", cartItemsGlobal);
      setIsCustomizationDialogOpen(false);
      setSelectedItem(null);
    }
  };


  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Loading restaurant details...</p>
        {/* Or a Skeleton loader for the page */}
      </div>
    );
  }

  const menuCategories = Object.keys(restaurant.menu) as Array<keyof typeof restaurant.menu>;

  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                 <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
                    <ChevronLeft className="h-6 w-6" />
                 </Button>
              </NavigationMenuItem>
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
                            {/* Small badge for cart count could go here */}
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
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mb-8 flex items-center space-x-4">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
            <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground mt-1">
              <Badge variant="outline">{restaurant.cuisine}</Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                <span>{restaurant.rating} ({restaurant.reviewsCount} reviews)</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{restaurant.address}</p>
          </div>
        </section>

        <Tabs defaultValue={menuCategories[0]} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3 sm:grid-cols-none sm:flex">
            {menuCategories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </TabsTrigger>
            ))}
          </TabsList>
          {menuCategories.map(category => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}> {/* Adjust max height as needed */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                  {restaurant.menu[category].map((item: any) => (
                    <MenuItemCard key={item.id} item={item} onAddToCart={() => handleAddToCart(item)} />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {selectedItem && (
        <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize {selectedItem.name}</DialogTitle>
              <DialogDescription>
                Make selections for your item. Price may vary.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedItem.options?.size && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="size" className="text-right col-span-1">Size</Label>
                    <RadioGroup
                        defaultValue={selectedItem.options.size[0]}
                        className="col-span-3 flex space-x-2"
                        onValueChange={(val) => setCustomizationOptions({...customizationOptions, size: val})}
                    >
                        {selectedItem.options.size.map((s: string) => (
                            <div key={s} className="flex items-center space-x-2">
                                <RadioGroupItem value={s} id={`size-${s}`} />
                                <Label htmlFor={`size-${s}`}>{s}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                 </div>
              )}
              {selectedItem.options?.extraCheese !== undefined && (
                 <div className="flex items-center space-x-2 justify-end py-2">
                    <Checkbox
                        id="extraCheese"
                        checked={customizationOptions.extraCheese}
                        onCheckedChange={(checked) => setCustomizationOptions({...customizationOptions, extraCheese: !!checked})}
                    />
                    <Label htmlFor="extraCheese" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Extra Cheese (+ $1.00)
                    </Label>
                 </div>
              )}
               {selectedItem.options?.crust && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="crust" className="text-right col-span-1">Crust</Label>
                    <RadioGroup
                        defaultValue={selectedItem.options.crust[0]}
                        className="col-span-3 flex space-x-2"
                        onValueChange={(val) => setCustomizationOptions({...customizationOptions, crust: val})}
                    >
                        {selectedItem.options.crust.map((c: string) => (
                            <div key={c} className="flex items-center space-x-2">
                                <RadioGroupItem value={c} id={`crust-${c}`} />
                                <Label htmlFor={`crust-${c}`}>{c}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                 </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleCustomizationSubmit}>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <footer className="py-6 border-t mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          Enjoy your meal from {restaurant.name}!
        </p>
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;