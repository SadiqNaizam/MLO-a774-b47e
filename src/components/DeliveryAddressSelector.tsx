import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle } from 'lucide-react';
// Assume a Dialog or Form component would be used for adding a new address,
// triggered by onAddNewAddress. This component handles selection.

interface Address {
  id: string;
  street: string;
  city: string;
  zip: string;
  // Add more fields like name, apartment number etc.
  displayLabel: string; // e.g., "Home - 123 Main St"
}

interface DeliveryAddressSelectorProps {
  addresses: Address[];
  selectedAddressId?: string | null;
  onAddressSelect: (addressId: string | null) => void;
  onAddNewAddress: () => void; // Callback to trigger adding a new address (e.g., open a dialog)
  isLoading?: boolean;
}

const DeliveryAddressSelector: React.FC<DeliveryAddressSelectorProps> = ({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
  isLoading = false,
}) => {
  console.log("Rendering DeliveryAddressSelector, selected:", selectedAddressId);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address-select">Select Delivery Address</Label>
        <div className="flex items-center space-x-2 mt-1">
          <Select
            value={selectedAddressId || undefined}
            onValueChange={(value) => onAddressSelect(value)}
            disabled={isLoading || addresses.length === 0}
          >
            <SelectTrigger id="address-select" className="flex-grow">
              <SelectValue placeholder={addresses.length === 0 ? "No addresses saved" : "Select an address"} />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((address) => (
                <SelectItem key={address.id} value={address.id}>
                  {address.displayLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={onAddNewAddress}
            disabled={isLoading}
            aria-label="Add new address"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        {addresses.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground mt-2">
            You have no saved addresses. Click the '+' button to add one.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliveryAddressSelector;