import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Step3_Payment = ({ bookingData, handleInputChange, rooms, calculateNights, calculateTotal, onSubmit, onBack }) => {
  const isSubmitDisabled = !bookingData.paymentMethod;
  const total = calculateTotal();

  return (
    <>
      <div className="space-y-6">
        <div className="glass-effect rounded-lg p-6 border border-emerald-500">
          <h3 className="text-white font-semibold text-lg mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Room:</span>
              <span>{rooms.find(r => r.id === bookingData.roomType)?.name}</span>
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
          <Label htmlFor="paymentMethod" className="text-white">Payment Method</Label>
          <Select value={bookingData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
            <SelectTrigger className="mt-2 bg-slate-800 border-gray-600 text-white">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="upi">UPI Payment</SelectItem>
              <SelectItem value="netbanking">Net Banking</SelectItem>
              <SelectItem value="wallet">Digital Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="glass-effect rounded-lg p-4 border border-yellow-500">
          <p className="text-yellow-400 text-sm">
            <strong>Note:</strong> This is a demo booking system. No actual payment will be processed. 
            Your booking details will be saved locally for demonstration purposes.
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Previous
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitDisabled} className="bg-emerald-600 hover:bg-emerald-700">
          Confirm Booking
        </Button>
      </div>
    </>
  );
};

export default Step3_Payment;