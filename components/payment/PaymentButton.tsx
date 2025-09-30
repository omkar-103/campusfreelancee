// components/payment/PaymentButton.tsx
"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: number;
  projectId?: string;
  applicationId?: string;
  type: 'project_payment' | 'profile_boost' | 'featured_listing' | 'membership';
  clientId: string;
  studentId?: string;
  metadata?: any;
  onSuccess: (paymentData: any) => void;
  buttonText?: string;
  buttonClassName?: string;
}

export function PaymentButton({
  amount,
  projectId,
  applicationId,
  type,
  clientId,
  studentId,
  metadata = {},
  onSuccess,
  buttonText = "Make Payment",
  buttonClassName = ""
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setShowConfirmDialog(false);

      // Load Razorpay script
      await loadRazorpayScript();

      // Create order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          projectId,
          applicationId,
          type,
          clientId,
          studentId,
          metadata
        })
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      // Initialize Razorpay
      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'CampusFreelance',
        description: getPaymentDescription(type),
        order_id: orderData.data.orderId,
        image: '/logo.png',
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: orderData.data.paymentId
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.success('Payment successful!');
            onSuccess(verifyData.data);
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: metadata.name || '',
          email: metadata.email || '',
          contact: metadata.phone || ''
        },
        notes: {
          type,
          projectId: projectId || '',
          applicationId: applicationId || ''
        },
        theme: {
          color: '#5F4B8B'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentDescription = (type: string) => {
    switch (type) {
      case 'project_payment':
        return 'Project Payment';
      case 'profile_boost':
        return 'Profile Boost (30 Days)';
      case 'featured_listing':
        return 'Featured Project Listing (7 Days)';
      case 'membership':
        return 'Premium Membership';
      default:
        return 'Payment';
    }
  };

  const platformFee = Math.round(amount * 0.10);
  const netAmount = amount - platformFee;

  return (
    <>
      <Button
        onClick={() => setShowConfirmDialog(true)}
        disabled={loading}
        className={buttonClassName || "bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] hover:from-[#3700B3] hover:to-[#5F4B8B] text-white"}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Review your payment details before proceeding
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-[#F3F0FF]/50 dark:bg-[#1A1A2E]/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                    Amount
                  </span>
                  <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                {type === 'project_payment' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                        Platform Fee (10%)
                      </span>
                      <span className="font-medium">₹{platformFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold">
                          {studentId ? 'Student Receives' : 'Net Amount'}
                        </span>
                        <span className="font-bold text-[#5F4B8B] dark:text-[#1DE9B6]">
                          ₹{netAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    Secure Payment
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {type === 'project_payment' 
                      ? 'Your payment will be held in escrow until you approve the work'
                      : 'Your payment is secured by Razorpay'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] hover:from-[#3700B3] hover:to-[#5F4B8B] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Confirm & Pay ₹{amount.toLocaleString('en-IN')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

