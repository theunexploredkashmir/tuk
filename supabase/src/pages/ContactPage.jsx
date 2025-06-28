
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Location',
      details: ['Gulmarg Road, Baramulla', 'Kashmir, India 193403'],
      color: 'text-emerald-400'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 194 2501234', '+91 98765 43210'],
      color: 'text-blue-400'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@unexploredkashmir.com', 'reservations@unexploredkashmir.com'],
      color: 'text-purple-400'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['24/7 Reception', 'Concierge Available'],
      color: 'text-yellow-400'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save message to localStorage
    const message = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'received'
    };

    const existingMessages = JSON.parse(localStorage.getItem('kashmirMessages') || '[]');
    existingMessages.push(message);
    localStorage.setItem('kashmirMessages', JSON.stringify(existingMessages));

    toast({
      title: "✨ Message Sent Successfully!",
      description: "Thank you for contacting us! We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0 z-0">
          <img  
            className="w-full h-full object-cover" 
            alt="Kashmir valley with traditional houseboats and mountains for contact"
           src="https://images.unsplash.com/photo-1683557027360-3011046b22bf" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            We're here to help you plan your perfect Kashmir experience. 
            Reach out to us anytime!
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="glass-effect border-gray-700 hover:border-emerald-500 transition-all duration-300 group text-center">
                  <CardContent className="p-6">
                    <info.icon className={`h-12 w-12 ${info.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                    <h3 className="text-xl font-semibold text-white mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-400">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center">
                    <MessageCircle className="mr-3 h-6 w-6 text-emerald-400" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-2 bg-slate-800 border-gray-600 text-white"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-2 bg-slate-800 border-gray-600 text-white"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-2 bg-slate-800 border-gray-600 text-white"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-white">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="mt-2 bg-slate-800 border-gray-600 text-white"
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="mt-2 w-full h-32 px-3 py-2 bg-slate-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Tell us about your inquiry..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <Card className="glass-effect border-gray-700">
                <CardContent className="p-0">
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img  
                      className="w-full h-full object-cover" 
                      alt="Map showing location of The Unexplored Kashmir resort in Gulmarg"
                     src="https://images.unsplash.com/photo-1670611554943-e5a2f3e89800" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="glass-effect rounded-lg p-4">
                        <MapPin className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-white font-medium">The Unexplored Kashmir</p>
                        <p className="text-gray-300 text-sm">Gulmarg, Kashmir</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Emergency Hotline</p>
                      <p className="text-gray-400">+91 194 2501234</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Reservations</p>
                      <p className="text-gray-400">reservations@unexploredkashmir.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">Response Time</p>
                      <p className="text-gray-400">Within 2 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Frequently Asked</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-white font-medium text-sm">What's the best time to visit?</p>
                    <p className="text-gray-400 text-sm">March to October for pleasant weather</p>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Do you provide airport transfers?</p>
                    <p className="text-gray-400 text-sm">Yes, complimentary for all guests</p>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Is WiFi available?</p>
                    <p className="text-gray-400 text-sm">Free high-speed WiFi throughout</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
