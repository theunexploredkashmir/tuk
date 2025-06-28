import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const useBooking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: '', // This will now be room_type_id
    roomName: '',
    price: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: ''
  });

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      if (checkOut <= checkIn) return 0;
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    if (bookingData.price > 0) {
      const nights = calculateNights();
      const subtotal = bookingData.price * nights;
      const taxes = subtotal * 0.18; // 18% GST
      return {
        subtotal,
        taxes,
        total: subtotal + taxes
      };
    }
    return { subtotal: 0, taxes: 0, total: 0 };
  };

  const handleSubmitBooking = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to make a booking.",
      });
      throw new Error("User not authenticated");
    }

    const total = calculateTotal();
    const isPayLater = bookingData.paymentMethod === 'pay_later';

    const bookingPayload = {
      user_id: user.id,
      check_in: bookingData.checkIn,
      check_out: bookingData.checkOut,
      guests: parseInt(bookingData.guests, 10),
      room_type: bookingData.roomName, // Storing name for simplicity
      first_name: bookingData.firstName,
      last_name: bookingData.lastName,
      email: bookingData.email,
      phone: bookingData.phone,
      special_requests: bookingData.specialRequests,
      total_price: total.total,
      payment_method: bookingData.paymentMethod,
      payment_status: isPayLater ? 'pending' : 'paid',
      status: isPayLater ? 'pending_payment' : 'confirmed',
    };

    const { data, error } = await supabase.from('bookings').insert([bookingPayload]).select().single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Could not save your booking. Please try again.",
      });
      throw error;
    } else {
      if (isPayLater) {
        toast({
          title: "✨ Reservation Held!",
          description: "Your booking is reserved. Please complete payment before check-in.",
        });
      } else {
         toast({
          title: "🎉 Booking Confirmed!",
          description: "Your payment was successful. Your Kashmir adventure awaits!",
        });
      }
      return data;
    }
  };

  return {
    bookingData,
    setBookingData,
    handleInputChange,
    calculateNights,
    calculateTotal,
    handleSubmitBooking,
  };
};

export default useBooking;