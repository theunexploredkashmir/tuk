import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Step4_Confirmation = ({ bookingData, rooms, calculateTotal }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white">Booking Confirmed!</h2>
      <p className="text-gray-300 text-lg">
        Thank you for choosing The Unexplored Kashmir. Your booking has been confirmed.
      </p>
      
      <div className="glass-effect rounded-lg p-6 border border-emerald-500 text-left max-w-md mx-auto">
        <h3 className="text-white font-semibold mb-4">Booking Details</h3>
        <div className="space-y-2 text-gray-300">
          <p><strong>Booking ID:</strong> KSH{Date.now()}</p>
          <p><strong>Guest:</strong> {bookingData.firstName} {bookingData.lastName}</p>
          <p><strong>Room:</strong> {rooms.find(r => r.id === bookingData.roomType)?.name}</p>
          <p><strong>Check-in:</strong> {bookingData.checkIn}</p>
          <p><strong>Check-out:</strong> {bookingData.checkOut}</p>
          <p><strong>Total:</strong> ₹{calculateTotal().total.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-400">
          A confirmation email has been sent to {bookingData.email}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Mail className="mr-2 h-4 w-4" />
              View My Bookings
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Phone className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Step4_Confirmation;