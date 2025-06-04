import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OrderTracker from '@/components/OrderTracker';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Home, User, ShoppingCart, Edit3, MapPin, CreditCard, Package, ListOrdered } from 'lucide-react';
import { toast } from "sonner";

// Placeholder Data
const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
});
type UserProfileFormData = z.infer<typeof userProfileSchema>;

const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
};

const savedAddresses = [
  { id: 'addr1', displayLabel: 'Home - 123 Main St, Anytown', details: '123 Main St, Anytown, USA, 12345' },
  { id: 'addr2', displayLabel: 'Work - 456 Oak Ave, Somecity', details: '456 Oak Ave, Somecity, USA, 67890' },
];

const savedPaymentMethods = [
  { id: 'pay1', displayLabel: 'Visa ending in 1234', type: 'Visa', last4: '1234' },
  { id: 'pay2', displayLabel: 'Mastercard ending in 5678', type: 'Mastercard', last4: '5678' },
];

const pastOrders = [
  { id: 'order1', date: '2023-10-26', total: 35.99, status: 'DELIVERED', items: [{name: 'Pizza', qty: 1}, {name: 'Coke', qty: 2}], restaurant: 'Pizza Place' },
  { id: 'order2', date: '2023-10-20', total: 22.50, status: 'DELIVERED', items: [{name: 'Burger', qty: 2}], restaurant: 'Burger Joint' },
  { id: 'order3', date: '2024-01-15', total: 45.00, status: 'CANCELLED', items: [{name: 'Sushi Platter', qty: 1}], restaurant: 'Sushi House' }
];

const currentOrder = {
  id: 'order_curr',
  status: 'OUT_FOR_DELIVERY' as const, // const assertion for type matching OrderStatus
  estimatedDelivery: '3:45 PM',
  items: [{name: 'Pasta Special', qty: 1}, {name: 'Salad', qty: 1}],
  restaurant: 'Italian Bistro',
  total: 28.75,
  steps: [ // Example custom steps with dates
    { key: 'CONFIRMED' as const, label: 'Order Confirmed', icon: Package, date: '03:10 PM' },
    { key: 'PREPARING' as const, label: 'Preparing Food', icon: Package, date: '03:20 PM' },
    { key: 'OUT_FOR_DELIVERY' as const, label: 'Out for Delivery', icon: Package, date: '03:35 PM' },
    { key: 'DELIVERED' as const, label: 'Delivered', icon: Package },
  ]
};


const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'profile';

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: user,
  });

  useEffect(() => {
    console.log('ProfilePage loaded, tab:', activeTab);
  }, [activeTab]);

  const onProfileSubmit = (data: UserProfileFormData) => {
    console.log("Profile updated:", data);
    toast.success("Profile updated successfully!");
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };


  return (
    <div className="flex flex-col min-h-screen">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  <Home className="h-5 w-5 mr-1" /> Home
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="font-bold text-lg">My Profile</div>
          <div className="flex items-center space-x-2">
             <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/cart" className={navigationMenuTriggerStyle()}>
                            <ShoppingCart className="h-5 w-5" />
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="profile"><User className="inline-block mr-1 h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="inline-block mr-1 h-4 w-4" />Addresses</TabsTrigger>
            <TabsTrigger value="payments"><CreditCard className="inline-block mr-1 h-4 w-4" />Payments</TabsTrigger>
            <TabsTrigger value="orders"><ListOrdered className="inline-block mr-1 h-4 w-4" />Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => toast.info("Add new address form would appear here.")}>
                    <MapPin className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedAddresses.map(addr => (
                  <Card key={addr.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{addr.displayLabel}</p>
                      <p className="text-sm text-muted-foreground">{addr.details}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toast.info(`Editing ${addr.displayLabel}`)}><Edit3 className="h-4 w-4" /></Button>
                  </Card>
                ))}
                {savedAddresses.length === 0 && <p>No saved addresses yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment options.</CardDescription>
                </div>
                 <Button variant="outline" onClick={() => toast.info("Add new payment method form would appear here.")}>
                    <CreditCard className="mr-2 h-4 w-4" /> Add New Payment
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedPaymentMethods.map(pay => (
                  <Card key={pay.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{pay.displayLabel}</p>
                      <p className="text-sm text-muted-foreground">{pay.type}</p>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => toast.info(`Managing ${pay.displayLabel}`)}><Edit3 className="h-4 w-4" /></Button>
                  </Card>
                ))}
                {savedPaymentMethods.length === 0 && <p>No saved payment methods.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            {/* Current Order Section (if any) */}
            {currentOrder && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Current Order Tracking</CardTitle>
                  <CardDescription>Status for order at {currentOrder.restaurant} - Est. Delivery: {currentOrder.estimatedDelivery}</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderTracker currentStatus={currentOrder.status} customSteps={currentOrder.steps} />
                  <div className="mt-4 text-sm">
                    Items: {currentOrder.items.map(i => `${i.name} (Qty: ${i.qty})`).join(', ')} <br/>
                    Total: ${currentOrder.total.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Past Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Review your past orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {pastOrders.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {pastOrders.map(order => (
                      <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger>
                            <div className="flex justify-between w-full pr-4">
                                <span>Order #{order.id.slice(-6)} - {order.date}</span>
                                <span className={`font-semibold ${order.status === 'DELIVERED' ? 'text-green-600' : order.status === 'CANCELLED' ? 'text-red-600' : 'text-yellow-600'}`}>{order.status}</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p><strong>Restaurant:</strong> {order.restaurant}</p>
                          <p><strong>Items:</strong></p>
                          <ul className="list-disc list-inside pl-4 text-sm">
                            {order.items.map(item => <li key={item.name}>{item.name} (Qty: {item.qty})</li>)}
                          </ul>
                          <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info(`Reordering order ${order.id}`)}>Reorder</Button>
                          <Button variant="link" size="sm" onClick={() => toast.info(`Viewing details for order ${order.id}`)}>View Details</Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p>You have no past orders.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-6 border-t mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          Manage your FoodFleet experience.
        </p>
      </footer>
    </div>
  );
};

export default ProfilePage;