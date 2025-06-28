import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Step2_GuestDetails = ({ bookingData, handleInputChange, onNext, onBack }) => {
  const isNextDisabled = !bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone;

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="text-white">First Name</Label>
            <Input
              id="firstName"
              value={bookingData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="mt-2 bg-slate-800 border-gray-600 text-white"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-white">Last Name</Label>
            <Input
              id="lastName"
              value={bookingData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="mt-2 bg-slate-800 border-gray-600 text-white"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={bookingData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-2 bg-slate-800 border-gray-600 text-white"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={bookingData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="mt-2 bg-slate-800 border-gray-600 text-white"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="specialRequests" className="text-white">Special Requests (Optional)</Label>
          <textarea
            id="specialRequests"
            value={bookingData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            className="mt-2 w-full h-24 px-3 py-2 bg-slate-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Any special requests or dietary requirements..."
          />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Previous
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled} className="bg-emerald-600 hover:bg-emerald-700">
          Next Step
        </Button>
      </div>
    </>
  );
};

export default Step2_GuestDetails;