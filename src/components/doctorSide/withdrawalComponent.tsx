import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WithdrawalModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentBalance = 3700.96 
}) => {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount > 0 && withdrawalAmount <= currentBalance) {
      onConfirm(withdrawalAmount);
      onClose();
    } else {
      alert("Invalid withdrawal amount");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to withdraw
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter withdrawal amount"
              className="col-span-3"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Available Balance: ${currentBalance.toFixed(2)}
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleConfirm}
          >
            Confirm Withdrawal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;