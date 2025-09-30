// components/payment/EarningsCard.tsx
"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  recentTransactions: Transaction[];
}

interface Transaction {
  _id: string;
  type: 'earning' | 'withdrawal' | 'refund';
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export function EarningsCard({ userId }: { userId: string }) {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank_transfer");
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    accountHolderName: ""
  });
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, [userId]);

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/earnings`);
      const data = await response.json();
      if (data.success) {
        setEarnings(data.data);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 100) {
      toast.error('Minimum withdrawal amount is ₹100');
      return;
    }

    if (parseFloat(withdrawAmount) > (earnings?.availableBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setWithdrawing(true);
      const response = await fetch('/api/payments/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: userId,
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          accountDetails: withdrawMethod === 'bank_transfer' ? {
            accountNumber: accountDetails.accountNumber,
            ifscCode: accountDetails.ifscCode,
            accountHolderName: accountDetails.accountHolderName
          } : {
            upiId: accountDetails.upiId
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Withdrawal request submitted successfully');
        setShowWithdrawDialog(false);
        fetchEarnings(); // Refresh earnings
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to process withdrawal');
    } finally {
      setWithdrawing(false);
    }
  };

  const growthPercentage = earnings?.lastMonthEarnings 
    ? ((earnings.thisMonthEarnings - earnings.lastMonthEarnings) / earnings.lastMonthEarnings) * 100
    : 0;

  if (loading) {
    return (
      <Card className="border-0 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#5F4B8B]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#1C1C1E] dark:text-[#F5F5F7] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#5F4B8B] dark:text-[#1DE9B6]" />
              Earnings Overview
            </span>
            <Button
              onClick={() => setShowWithdrawDialog(true)}
              disabled={!earnings?.availableBalance || earnings.availableBalance < 100}
              size="sm"
                           className="bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] hover:from-[#3700B3] hover:to-[#5F4B8B] text-white"
            >
              Withdraw Funds
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Earnings Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F3F0FF]/50 dark:bg-[#1A1A2E]/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">Total Earnings</p>
                <DollarSign className="h-4 w-4 text-[#5F4B8B] dark:text-[#1DE9B6]" />
              </div>
              <p className="text-2xl font-bold text-[#1C1C1E] dark:text-[#F5F5F7]">
                ₹{earnings?.totalEarnings?.toLocaleString('en-IN') || 0}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-green-700 dark:text-green-300">Available Balance</p>
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                ₹{earnings?.availableBalance?.toLocaleString('en-IN') || 0}
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending</p>
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                ₹{earnings?.pendingEarnings?.toLocaleString('en-IN') || 0}
              </p>
            </div>
          </div>

          {/* Monthly Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
                This Month's Earnings
              </h3>
              <div className="flex items-center gap-1">
                {growthPercentage > 0 ? (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">
                      +{growthPercentage.toFixed(1)}%
                    </span>
                  </>
                ) : growthPercentage < 0 ? (
                  <>
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-500">
                      {growthPercentage.toFixed(1)}%
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <p className="text-2xl font-bold text-[#5F4B8B] dark:text-[#1DE9B6]">
                ₹{earnings?.thisMonthEarnings?.toLocaleString('en-IN') || 0}
              </p>
              <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                vs ₹{earnings?.lastMonthEarnings?.toLocaleString('en-IN') || 0} last month
              </p>
            </div>
            <Progress 
              value={(earnings?.thisMonthEarnings || 0) / 50000 * 100} 
              className="h-2 bg-[#5F4B8B]/10"
            />
            <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/80 mt-1">
              Goal: ₹50,000
            </p>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-3">
              Recent Transactions
            </h3>
            <div className="space-y-2">
              {earnings?.recentTransactions?.length === 0 ? (
                <p className="text-sm text-[#8E8E93] dark:text-[#F5F5F7]/80">
                  No transactions yet
                </p>
              ) : (
                earnings?.recentTransactions?.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#F3F0FF]/30 dark:bg-[#1A1A2E]/30"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.type === 'earning' ? (
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <ArrowDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm text-[#1C1C1E] dark:text-[#F5F5F7]">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/80">
                          {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'earning' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'earning' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter withdrawal details. Minimum withdrawal is ₹100.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pl-8"
                  min="100"
                  max={earnings?.availableBalance || 0}
                />
              </div>
              <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/80 mt-1">
                Available: ₹{earnings?.availableBalance?.toLocaleString('en-IN') || 0}
              </p>
            </div>

            <div>
              <Label>Withdrawal Method</Label>
              <RadioGroup value={withdrawMethod} onValueChange={setWithdrawMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="bank_transfer" id="bank" />
                  <Label htmlFor="bank" className="cursor-pointer flex-1">
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/80">
                        2-3 business days
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="cursor-pointer flex-1">
                    <div>
                      <p className="font-medium">UPI</p>
                      <p className="text-xs text-[#8E8E93] dark:text-[#F5F5F7]/80">
                        Instant transfer
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {withdrawMethod === 'bank_transfer' ? (
              <>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Enter account number"
                    value={accountDetails.accountNumber}
                    onChange={(e) => setAccountDetails({
                      ...accountDetails,
                      accountNumber: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    placeholder="Enter IFSC code"
                    value={accountDetails.ifscCode}
                    onChange={(e) => setAccountDetails({
                      ...accountDetails,
                      ifscCode: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="accountHolder">Account Holder Name</Label>
                  <Input
                    id="accountHolder"
                    placeholder="Enter account holder name"
                    value={accountDetails.accountHolderName}
                    onChange={(e) => setAccountDetails({
                      ...accountDetails,
                      accountHolderName: e.target.value
                    })}
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="example@paytm"
                  value={accountDetails.upiId}
                  onChange={(e) => setAccountDetails({
                    ...accountDetails,
                    upiId: e.target.value
                  })}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowWithdrawDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) < 100}
              className="bg-gradient-to-r from-[#5F4B8B] to-[#3700B3] hover:from-[#3700B3] hover:to-[#5F4B8B] text-white"
            >
              {withdrawing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Withdraw
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}