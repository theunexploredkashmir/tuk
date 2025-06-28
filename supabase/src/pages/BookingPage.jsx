import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BookingProgress from '@/components/booking/BookingProgress';
import Step1DatesAndRoom from '@/components/booking/Step1DatesAndRoom';
import Step2GuestDetails from '@/components/booking/Step2GuestDetails';
import Step3Payment from '@/components/booking/Step3Payment';
import Step4Confirmation from '@/components/booking/Step4Confirmation';
import useBooking from '@/hooks/useBooking';
import { useAuth } from '@/contexts/AuthContext';

const BookingPage = () => {
  const {
    bookingData,
    setBookingData,
    handleInputChange,
    calculateNights,
    calculateTotal,
    handleSubmitBooking
  } = useBooking();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedBooking, setSubmittedBooking] = useState(null);

  useEffect(() => {
    const room = location.state?.room;
    if (!room) {
      navigate('/rooms');
      return;
    }
    
    setBookingData(prev => ({
      ...prev,
      roomType: room.id,
      roomName: `${room.properties.name} - ${room.name}`,
      price: room.price,
      email: user?.email || '',
    }));
  }, [location.state, user, setBookingData, navigate]);


  const steps = [
    { number: 1, title: 'Dates & Room', icon: Calendar },
    { number: 2, title: 'Guest Details', icon: Users },
    { number: 3, title: 'Payment', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: Check }
  ];

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const onBookingSubmit = async () => {
    try {
      const newBooking = await handleSubmitBooking();
      setSubmittedBooking(newBooking);
      setCurrentStep(4);
    } catch (error) {
      console.error("Booking submission failed:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1DatesAndRoom 
                  bookingData={bookingData} 
                  handleInputChange={handleInputChange} 
                  calculateNights={calculateNights} 
                  calculateTotal={calculateTotal} 
                  onNext={handleNextStep} 
                />;
      case 2:
        return <Step2GuestDetails 
                  bookingData={bookingData} 
                  handleInputChange={handleInputChange} 
                  onNext={handleNextStep} 
                  onBack={handlePrevStep} 
                />;
      case 3:
        return <Step3Payment 
                  bookingData={bookingData} 
                  handleInputChange={handleInputChange} 
                  calculateNights={calculateNights} 
                  calculateTotal={calculateTotal} 
                  onSubmit={onBookingSubmit} 
                  onBack={handlePrevStep} 
                />;
      case 4:
        return <Step4Confirmation 
                  bookingData={submittedBooking || bookingData} 
                  calculateTotal={calculateTotal} 
                />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative h-64 flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img  className="w-full h-full object-cover" alt="Hotel booking and reservation desk with mountain views" src="https://images.unsplash.com/photo-1694434136407-b09632b48a48" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Book Your <span className="gradient-text">Kashmir Experience</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingProgress steps={steps} currentStep={currentStep} />

          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                {steps[currentStep - 1]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingPage;