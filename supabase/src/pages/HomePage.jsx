import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Building, MapPin, Wifi, Car, Coffee, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const HomePage = () => {
  const features = [
    { icon: Wifi, title: 'Free WiFi', description: 'High-speed internet in all properties' },
    { icon: Car, title: 'Easy Parking', description: 'Convenient parking solutions' },
    { icon: Coffee, title: 'Local Experiences', description: 'Authentic stays and activities' },
    { icon: Utensils, title: 'Great Food', description: 'Access to local and fine dining' },
  ];

  const testimonials = [
    {
      name: 'Aisha Khan',
      rating: 5,
      comment: 'Found the most charming cottage through this platform. The booking was seamless and the host was wonderful!',
    },
    {
      name: 'Rohan Verma',
      rating: 5,
      comment: 'A fantastic selection of properties. We stayed in a houseboat on Dal Lake, an unforgettable experience!',
    },
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'As a property owner, this platform has been a game-changer. Easy to manage my listing and great support.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img  className="w-full h-full object-cover" alt="Majestic Kashmir mountains with snow-capped peaks and pristine valleys" src="https://images.unsplash.com/photo-1657027967060-ee84fc9cc648" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6"
          >
            The Unexplored
            <span className="gradient-text block">Kashmir</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            Discover and book unique homes and experiences in the heart of paradise.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/rooms">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
                Find a Stay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
                Become a Host
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              A Stay for Every <span className="gradient-text">Dream</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From cozy cottages to luxurious villas, find the perfect place for your Kashmir adventure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="glass-effect border-gray-700 hover:border-emerald-500 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 mountain-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Host in Kashmir, <span className="gradient-text">Share Your World</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Join our community of hosts and turn your property into a source of income. We provide the tools and support to help you succeed.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Showcase your unique space, connect with travelers from around the globe, and share the unparalleled beauty of Kashmir.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
                  Start Hosting Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img  className="w-full h-96 object-cover" alt="Happy property owner managing their listing on a laptop with a beautiful Kashmir view" src="https://images.unsplash.com/photo-1572163414908-d8fde6158ce9" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass-effect rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-emerald-400" />
                  <span className="text-white font-medium">List Your Property</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Stories from our <span className="gradient-text">Community</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hear what travelers and hosts are saying about their experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="glass-effect border-gray-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white font-medium">{testimonial.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;