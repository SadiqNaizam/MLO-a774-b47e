import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ChevronLeft, ShoppingCart, User } from 'lucide-react';
import { toast } from "sonner";

// Using the same global cartItemsGlobal from RestaurantMenuPage for simplicity
// In a real app, use context/state management
declare let cartItemsGlobal: any[];
if (typeof cartItemsGlobal === 'undefined') {
  cartItemsGlobal = [ // Default if not initialized from other page
    { id: 'm1', name: 'Garlic Bread', price: 5.99, quantity: 2, customization: {} },
    { id: 'm3', name: 'Spaghetti Carbonara', price: 14.99, quantity: 1, customization: { size: 'Large', extraCheese: true } },
  ];
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(cartItemsGlobal);

  useEffect(() => {
    console.log('CartPage loaded');
    // Sync with global cart if it changes (e.g. after navigating back and adding more)
    // This is a naive sync; proper state management is better.
    setCartItems([...cartItemsGlobal]); 
  }, []); // Re-check on load, but not ideal for dynamic updates without full reload

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Or allow 0 to remove
    const updatedCartItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
    cartItemsGlobal = updatedCartItems; // Update global store
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
    cartItemsGlobal = updatedCartItems; // Update global store
    toast.info("Item removed from cart.");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fee
  const total = subtotal + deliveryFee;

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
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-2">Your cart is empty.</p>
            <Button onClick={() => navigate('/')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Item</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                            {item.customization && Object.keys(item.customization).length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                    {Object.entries(item.customization).map(([key, value]) => 
                                        typeof value === 'boolean' && value ? `${key}` : 
                                        typeof value === 'string' ? `${key}: ${value}` : ''
                                    ).filter(Boolean).join(', ')}
                                </div>
                            )}
                          </TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className="w-16 h-9 mx-auto text-center"
                            />
                          </TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          Secure payments. Fast delivery.
        </p>
      </footer>
    </div>
  );
};

export default CartPage;