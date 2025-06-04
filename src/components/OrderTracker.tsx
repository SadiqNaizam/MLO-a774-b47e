import React from 'react';
import { CheckCircle, Package, Truck, Home, XCircle } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils'; // For conditional class names

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'FAILED';

interface OrderStep {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
  date?: string; // Optional: timestamp for when this step was completed
}

interface OrderTrackerProps {
  currentStatus: OrderStatus;
  // Optional: Detailed steps can be passed if they vary or include timestamps
  customSteps?: OrderStep[];
}

const DEFAULT_STEPS: OrderStep[] = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'PREPARING', label: 'Preparing Food', icon: Package },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

const FAILED_CANCELLED_STEP_ICONS = {
  CANCELLED: XCircle,
  FAILED: XCircle,
};

const OrderTracker: React.FC<OrderTrackerProps> = ({ currentStatus, customSteps }) => {
  console.log("Rendering OrderTracker, current status:", currentStatus);

  const stepsToDisplay = customSteps || DEFAULT_STEPS;
  const currentStepIndex = stepsToDisplay.findIndex(step => step.key === currentStatus);

  if (currentStatus === 'PENDING') {
    return (
        <div className="p-4 border rounded-md bg-gray-50 text-gray-700 text-center">
            Order is pending confirmation.
        </div>
    );
  }

  if (currentStatus === 'CANCELLED' || currentStatus === 'FAILED') {
    const Icon = FAILED_CANCELLED_STEP_ICONS[currentStatus];
    const message = currentStatus === 'CANCELLED' ? 'Order Cancelled' : 'Order Failed';
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-red-50 text-red-700">
        <Icon className="h-12 w-12 mb-2" />
        <p className="font-semibold text-lg">{message}</p>
        {/* Optional: Add more details or actions here */}
      </div>
    );
  }


  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between">
        {stepsToDisplay.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center text-center w-1/4">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2",
                    isActive ? "bg-green-500 border-green-500 text-white" : "bg-gray-100 border-gray-300 text-gray-400",
                    isCurrent && "ring-2 ring-green-500 ring-offset-2"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs sm:text-sm font-medium",
                    isActive ? "text-green-700" : "text-gray-500"
                  )}
                >
                  {step.label}
                </p>
                {step.date && isActive && (
                    <p className="text-xs text-gray-400">{step.date}</p>
                )}
              </div>
              {index < stepsToDisplay.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1",
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;