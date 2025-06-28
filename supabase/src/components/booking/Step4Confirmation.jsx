import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Step4Confirmation = ({ bookingData, rooms, calculateTotal }) => {
  const isPayLater = bookingData.paymentMethod === 'pay_later';

  return (
    <div className="text-center space-y-6">
      <div className={`w-20 h-20 ${isPayLater ? 'bg-yellow-500' : 'bg-emerald-600'} rounded-full flex items-center justify-center mx-auto`}>
        {isPayLater ? <Clock className="h-10 w-10 text-white" /> : <Check className="h-10 w-10 text-white" />}
      </div>
      <h2 className="text-3xl font-bold text-white">
        {isPayLater ? 'Reservation Held!' : 'Booking Confirmed!'}
      </h2>
      <p className="text-gray-300 text-lg">
        {isPayLater 
          ? "Your booking is reserved. Please complete your payment to confirm."
          : "Thank you for choosing The Unexplored Kashmir. Your booking is confirmed."
        }
      </p>
      
      <div className="glass-effect rounded-lg p-6 border-emerald-500 text-left max-w-md mx-auto">
        <h3 className="text-white font-semibold mb-4">Booking Details</h3>
        <div className="space-y-2 text-gray-300">
          <p><strong>Guest:</strong> {bookingData.firstName} {bookingData.lastName}</p>
          <p><strong>Room:</strong> {rooms.find(r => r.id === bookingData.roomType)?.name}</p>
          <p><strong>Check-in:</strong> {bookingData.checkIn}</p>
          <p><strong>Check-out:</strong> {bookingData.checkOut}</p>
          <p><strong>Total Amount:</strong> ₹{calculateTotal().total.toLocaleString()}</p>
           <p><strong>Payment Status:</strong> 
            <span className={isPayLater ? 'text-yellow-400' : 'text-emerald-400'}>
              {isPayLater ? ' Awaiting Payment' : ' Paid'}
            </span>
          </p>
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

export default Step4Confirmation;