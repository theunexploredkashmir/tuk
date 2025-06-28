import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Backpack as Hiking, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

const ServicesPage = () => {
  const { toast } = useToast();

  const services = [
    {
      title: 'Cab Services',
      description: 'Reliable and comfortable cabs to explore every corner of Kashmir. Book for local sightseeing or airport transfers.',
      icon: Car,
      link: '/services/cabs',
      status: 'soon'
    },
    {
      title: 'Trekking & Hiking',
      description: 'Guided treks and hiking packages for all skill levels. Discover breathtaking trails and hidden valleys.',
      icon: Hiking,
      link: '/services/packages',
      status: 'soon'
    },
    {
      title: 'Verified Stays',
      description: 'Browse our complete collection of hand-picked, admin-approved properties for a safe and memorable stay.',
      icon: ShieldCheck,
      link: '/rooms',
      status: 'live'
    },
  ];

  const handleClick = (e, status) => {
    if (status === 'soon') {
      e.preventDefault();
      toast({
        title: "🚀 Coming Soon!",
        description: "We're putting the final touches on this feature. Stay tuned!",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img  
            className="w-full h-full object-cover" 
            alt="A person enjoying a scenic view in Kashmir, representing services and activities"
            src="https://images.unsplash.com/photo-1616521134101-b5261844779e" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Enhance Your <span className="gradient-text">Journey</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Beyond stays, we offer curated services to make your Kashmir experience truly unforgettable.
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Link to={service.link} onClick={(e) => handleClick(e, service.status)}>
                  <Card className="glass-effect border-gray-700 hover:border-emerald-500 transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-6 flex items-center gap-6">
                      <service.icon className="h-16 w-16 text-emerald-400 flex-shrink-0" />
                      <div className="flex-grow">
                        <CardTitle className="text-white text-2xl mb-2">{service.title}</CardTitle>
                        <p className="text-gray-400 mb-4">{service.description}</p>
                        <Button variant="link" className="text-emerald-400 p-0 h-auto">
                          {service.status === 'live' ? 'Explore Now' : 'Coming Soon'}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;