import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Clock, Wallet, Landmark } from 'lucide-react';

const Step3Payment = ({ bookingData, handleInputChange, calculateNights, calculateTotal, onSubmit, onBack }) => {
  const isSubmitDisabled = !bookingData.paymentMethod;
  const total = calculateTotal();
  const { toast } = useToast();

  const handleStripePayment = () => {
    toast({
        title: "🚧 Stripe Not Configured",
        description: "Please provide your Stripe keys to enable real payments! For now, we'll simulate a successful payment.",
    });
    onSubmit();
  }

  const handleSubmit = () => {
    if (bookingData.paymentMethod !== 'pay_later') {
        handleStripePayment();
    } else {
        onSubmit();
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="glass-effect rounded-lg p-6 border border-emerald-500">
          <h3 className="text-white font-semibold text-lg mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Room:</span>
              <span>{bookingData.roomName}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Dates:</span>
              <span>{bookingData.checkIn} to {bookingData.checkOut}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Nights:</span>
              <span>{calculateNights()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Guests:</span>
              <span>{bookingData.guests}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span>₹{total.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Taxes (18% GST):</span>
              <span>₹{total.taxes.toLocaleString()}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between text-emerald-400 font-bold text-lg">
              <span>Total:</span>
              <span>₹{total.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="paymentMethod" className="text-white">Payment Option</Label>
          <Select value={bookingData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
            <SelectTrigger className="mt-2 bg-slate-800 border-gray-600 text-white">
              <SelectValue placeholder="Select a payment option" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="card">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Card</span>
                </div>
              </SelectItem>
              <SelectItem value="upi">
                <div className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>UPI</span>
                </div>
              </SelectItem>
              <SelectItem value="netbanking">
                <div className="flex items-center">
                  <Landmark className="mr-2 h-4 w-4" />
                  <span>Net Banking</span>
                </div>
              </SelectItem>
              <SelectItem value="pay_later">
                <div className="flex items-center">
                   <Clock className="mr-2 h-4 w-4" />
                  <span>Pay Later</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {bookingData.paymentMethod === 'pay_later' && (
             <p className="text-yellow-400 text-xs mt-2">
                You can pay anytime up to 24 hours before your check-in date.
             </p>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Previous
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitDisabled} className="bg-emerald-600 hover:bg-emerald-700">
          {bookingData.paymentMethod === 'pay_later' ? 'Reserve Now' : 'Proceed to Payment'}
        </Button>
      </div>
    </>
  );
};

export default Step3Payment;