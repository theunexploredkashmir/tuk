import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Star, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const UserDashboardPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('check_in', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching bookings",
          description: error.message,
        });
      } else {
        setBookings(data);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user, toast]);

  const handleCancelBooking = async (bookingId) => {
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not cancel booking. Please try again.",
      });
    } else {
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    }
  };

  const handleFeatureClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const upcomingBookings = bookings.filter(b => new Date(b.check_in) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.check_in) < new Date());

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold text-white">
                My <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-400 mt-2">Welcome back, {user?.email}! Manage your bookings and account details here.</p>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
                <TabsTrigger value="past">Past Bookings</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-6">
                {loading ? <p className="text-white text-center">Loading bookings...</p> : upcomingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="glass-effect border-gray-700">
                        <CardHeader>
                          <img  className="w-full h-40 object-cover rounded-md mb-4" alt={booking.room_type} src="https://images.unsplash.com/photo-1661258320748-6c3ec4641813" />
                          <CardTitle className="text-white">{booking.room_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</CardTitle>
                          <CardDescription className="text-gray-400">
                            <Calendar className="inline-block h-4 w-4 mr-2" />
                            {booking.check_in} to {booking.check_out}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between text-sm text-gray-300 mb-4">
                            <span>Total Paid:</span>
                            <span className="font-bold text-white">₹{Number(booking.total_price).toLocaleString()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleFeatureClick} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                              <Edit className="mr-2 h-4 w-4" /> Modify
                            </Button>
                            <Button onClick={() => handleCancelBooking(booking.id)} variant="destructive" className="flex-1">
                              <Trash2 className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 glass-effect rounded-lg">
                    <Calendar className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-xl font-semibold text-white">No Upcoming Bookings</h3>
                    <p className="text-gray-400 mt-2">Time for a new adventure? Kashmir is calling!</p>
                    <Link to="/rooms">
                      <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Explore Stays</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="past" className="mt-6">
                {loading ? <p className="text-white text-center">Loading bookings...</p> : pastBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="glass-effect border-gray-700 opacity-70">
                        <CardHeader>
                          <img  className="w-full h-40 object-cover rounded-md mb-4" alt={booking.room_type} src="https://images.unsplash.com/photo-1661258320748-6c3ec4641813" />
                          <CardTitle className="text-white">{booking.room_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</CardTitle>
                          <CardDescription className="text-gray-400">
                            <Calendar className="inline-block h-4 w-4 mr-2" />
                            {booking.check_in} to {booking.check_out}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={handleFeatureClick} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <Star className="mr-2 h-4 w-4" /> Leave a Review
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 glass-effect rounded-lg">
                    <h3 className="text-xl font-semibold text-white">No Past Bookings</h3>
                    <p className="text-gray-400 mt-2">Your travel history will appear here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboardPage;