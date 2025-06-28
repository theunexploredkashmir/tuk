import React from 'react';

const BookingSummary = ({ roomName, guests, nights, total }) => {
  return (
    <div className="glass-effect rounded-lg p-4 border border-emerald-500">
      <h3 className="text-white font-semibold mb-2">Booking Summary</h3>
      <div className="space-y-1 text-gray-300">
        <p>Room: {roomName}</p>
        <p>Guests: {guests}</p>
        <p>Nights: {nights}</p>
        <p className="text-emerald-400 font-semibold">
          Total: ₹{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;