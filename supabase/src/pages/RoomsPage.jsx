import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Wifi, Tv, Wind as AirVent, Thermometer, ShowerHead, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const amenityIcons = {
  ac: <AirVent className="h-4 w-4 text-emerald-400" />,
  heater: <Thermometer className="h-4 w-4 text-emerald-400" />,
  tv: <Tv className="h-4 w-4 text-emerald-400" />,
  wifi: <Wifi className="h-4 w-4 text-emerald-400" />,
  geyser: <ShowerHead className="h-4 w-4 text-emerald-400" />,
  parking: <Car className="h-4 w-4 text-emerald-400" />,
};

const availableAmenitiesList = [
  { id: 'ac', label: 'AC' },
  { id: 'heater', label: 'Heater' },
  { id: 'tv', label: 'TV' },
  { id: 'wifi', label: 'Free Wifi' },
  { id: 'geyser', label: 'Geyser' },
  { id: 'parking', label: 'Free Parking' },
];

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('room_types')
        .select('*, properties!inner(name, address, images, status)')
        .eq('properties.status', 'approved');
      
      if (error) {
        toast({ variant: 'destructive', title: 'Error fetching rooms', description: error.message });
      } else if (data) {
        const validRooms = data.filter(room => room.properties);
        setRooms(validRooms);
      }
      setLoading(false);
    };
    fetchRooms();
  }, [toast]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img  
            className="w-full h-full object-cover" 
            alt="Luxury hotel rooms with mountain views in Kashmir"
             src="https://images.unsplash.com/photo-1702422578177-6fa068973e5c" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Luxury <span className="gradient-text">Accommodations</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Choose from our carefully curated selection of rooms and suites, 
            each offering breathtaking views and premium amenities.
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <p className="text-white text-center">Loading available rooms...</p> : (
            rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className="glass-effect border-gray-700 hover:border-emerald-500 transition-all duration-300 group overflow-hidden flex flex-col h-full">
                      <div className="relative overflow-hidden h-64">
                        {room.properties.images && room.properties.images.length > 0 ? (
                          <img
                            src={room.properties.images[0]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            alt={room.name}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <img alt="A placeholder image for a hotel room" className="object-cover w-full h-full" src="https://images.unsplash.com/photo-1644473968199-150d0a098163" />
                          </div>
                        )}
                      </div>
                      
                      <CardHeader className="flex-grow">
                        <CardTitle className="text-white text-xl">{room.name}</CardTitle>
                        <p className="text-sm text-gray-400">{room.properties.name}</p>
                        <div className="flex items-center justify-between text-gray-400 pt-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">{room.guests} guests</span>
                            </div>
                            <span className="text-sm">{room.size}</span>
                          </div>
                          <div className="text-emerald-400 font-bold text-lg">
                            ₹{Number(room.price).toLocaleString()}/night
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{room.description || 'A perfect choice for your stay.'}</p>
                        
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                            {room.amenities.map(amenityId => {
                              const amenity = availableAmenitiesList.find(a => a.id === amenityId);
                              return (
                                <div key={amenityId} className="flex items-center gap-2 text-sm text-gray-300">
                                  {amenity ? amenityIcons[amenity.id] : null}
                                  <span>{amenity ? amenity.label : amenityId}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        <div className="flex space-x-3 pt-4 border-t border-gray-700">
                          <Link to="/booking" state={{ room: room }} className="flex-1">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                              Book Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => toast({title: "🚧 Feature coming soon!"})}>
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-effect rounded-lg">
                <h3 className="text-xl font-semibold text-white">No Rooms Available</h3>
                <p className="text-gray-400 mt-2">It seems no properties have been approved yet. Please check back later or contact us for assistance.</p>
              </div>
            )
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoomsPage;