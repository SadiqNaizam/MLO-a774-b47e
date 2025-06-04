import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DeliveryAddressSelector from '@/components/DeliveryAddressSelector';
import { ChevronLeft, User } from 'lucide-react';
import { toast } from "sonner";

// Placeholder data for addresses and payment
const sampleAddresses = [
  { id: 'addr1', street: '123 Main St', city: 'Anytown', zip: '12345', displayLabel: 'Home - 123 Main St' },
  { id: 'addr2', street: '456 Oak Ave', city: 'Somecity', zip: '67890', displayLabel: 'Work - 456 Oak Ave' },
];

const paymentSchema = z.object({
  deliveryAddress: z.string().min(1, "Please select a delivery address."),
  paymentMethod: z.string().min(1, "Please select a payment method."),
  cardNumber: z.string().optional(), // Make optional if using saved cards or other methods
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(sampleAddresses[0]?.id || null);
  // const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); // For a modal

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      deliveryAddress: selectedAddressId || "",
      paymentMethod: "new_card", // Default to entering new card
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    console.log('CheckoutPage loaded');
    form.setValue('deliveryAddress', selectedAddressId || "");
  }, [selectedAddressId, form]);


  const onSubmit = (data: PaymentFormData) => {
    console.log("Checkout data:", data);
    toast.success("Order Placed Successfully!", {
      description: "You will be redirected to your profile shortly.",
    });
    // Simulate API call and redirect
    setTimeout(() => {
      // Clear cart (cartItemsGlobal = []) - in a real app
      navigate('/profile?tab=orders'); // Redirect to orders tab in profile
    }, 2000);
  };

  const handleAddNewAddress = () => {
    // setIsAddingNewAddress(true);
    toast.info("Add new address functionality would open a dialog here.");
    // Placeholder: Add a new dummy address
    const newId = `addr${sampleAddresses.length + 1}`;
    sampleAddresses.push({ id: newId, street: 'New Address', city: 'New City', zip: '00000', displayLabel: 'New Address' });
    setSelectedAddressId(newId); // auto-select new address
  };


  // Dummy order summary from cart (in real app, get from state/context)
  const orderSubtotal = 55.96; // Example
  const deliveryFee = 5.00;
  const orderTotal = orderSubtotal + deliveryFee;

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
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <DeliveryAddressSelector
                          addresses={sampleAddresses}
                          selectedAddressId={field.value}
                          onAddressSelect={(id) => {
                            field.onChange(id);
                            setSelectedAddressId(id);
                          }}
                          onAddNewAddress={handleAddNewAddress}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select or add a payment method.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="saved_card_1" />
                              </FormControl>
                              <FormLabel className="font-normal">Visa ending in 1234</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="new_card" />
                              </FormControl>
                              <FormLabel className="font-normal">Add New Card</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("paymentMethod") === "new_card" && (
                    <div className="space-y-4 mt-4 pt-4 border-t">
                       <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="0000 0000 0000 0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                   <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Agree to terms and conditions
                          </FormLabel>
                          <FormDescription>
                            You agree to our Terms of Service and Privacy Policy.
                          </FormDescription>
                           <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" size="lg">
                    Place Order (${orderTotal.toFixed(2)})
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>

      <footer className="py-6 border-t mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          100% Secure Checkout.
        </p>
      </footer>
    </div>
  );
};

export default CheckoutPage;