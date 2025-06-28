import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Step1DatesAndRoom = ({ bookingData, handleInputChange, calculateNights, onNext }) => {
  const isNextDisabled = !bookingData.checkIn || !bookingData.checkOut || calculateNights() <= 0;

  return (
    <>
      <div className="space-y-6">
        <div className="glass-effect rounded-lg p-4 border border-emerald-500">
          <h3 className="text-white font-semibold text-lg mb-2">Your Selected Room</h3>
          <p className="text-emerald-300">{bookingData.roomName}</p>
          <p className="text-gray-300">₹{Number(bookingData.price).toLocaleString()} / night</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="checkIn" className="text-white">Check-in Date</Label>
            <Input
              id="checkIn"
              type="date"
              value={bookingData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mt-2 bg-slate-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="checkOut" className="text-white">Check-out Date</Label>
            <Input
              id="checkOut"
              type="date"
              value={bookingData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
              className="mt-2 bg-slate-800 border-gray-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="guests" className="text-white">Number of Guests</Label>
          <Select value={bookingData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
            <SelectTrigger className="mt-2 bg-slate-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button onClick={onNext} disabled={isNextDisabled} className="bg-emerald-600 hover:bg-emerald-700">
          Next Step
        </Button>
      </div>
    </>
  );
};

export default Step1DatesAndRoom;