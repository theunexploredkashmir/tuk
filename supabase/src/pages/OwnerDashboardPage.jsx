import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, PlusCircle, Clock, Car, Backpack as Hiking } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

const OwnerDashboardPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProperty, setNewProperty] = useState({ name: '', description: '', address: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);
      
      if (propError) toast({ variant: 'destructive', title: 'Error fetching properties', description: propError.message });
      else setProperties(propData);

      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*, definition:service_definitions(name)')
        .eq('owner_id', user.id);

      if (serviceError) toast({ variant: 'destructive', title: 'Error fetching services', description: serviceError.message });
      else setServices(serviceData);

      setLoading(false);
    };
    fetchData();
  }, [user, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!newProperty.name || !newProperty.address) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please provide a name and address.' });
      return;
    }
    setIsAdding(true);
    const { data, error } = await supabase
      .from('properties')
      .insert([{ ...newProperty, owner_id: user.id, status: 'pending' }])
      .select();

    if (error) {
      toast({ variant: 'destructive', title: 'Error adding property', description: error.message });
    } else {
      setProperties(prev => [...prev, ...data]);
      setNewProperty({ name: '', description: '', address: '' });
      toast({ title: 'Property Submitted!', description: `${data[0].name} is pending review from an admin.` });
    }
    setIsAdding(false);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case 'rejected':
         return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8">
              <h1 className="font-display text-4xl font-bold text-white">
                Owner <span className="gradient-text">Dashboard</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Add a New Property</CardTitle>
                  <CardDescription>List a new stay. It will be reviewed by an admin before going live.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProperty} className="space-y-4">
                    <div><Label htmlFor="name" className="text-white">Property Name</Label><Input id="name" name="name" value={newProperty.name} onChange={handleInputChange} placeholder="e.g., Kashmir Mountain Villa" className="mt-1 bg-slate-800 border-gray-600 text-white" /></div>
                    <div><Label htmlFor="address" className="text-white">Address</Label><Input id="address" name="address" value={newProperty.address} onChange={handleInputChange} placeholder="e.g., Pahalgam, Anantnag" className="mt-1 bg-slate-800 border-gray-600 text-white" /></div>
                    <div><Label htmlFor="description" className="text-white">Description</Label><Textarea id="description" name="description" value={newProperty.description} onChange={handleInputChange} placeholder="Describe your beautiful property..." className="mt-1 bg-slate-800 border-gray-600 text-white" /></div>
                    <Button type="submit" disabled={isAdding} className="bg-emerald-600 hover:bg-emerald-700"><PlusCircle className="mr-2 h-4 w-4" />{isAdding ? 'Submitting...' : 'Submit for Review'}</Button>
                  </form>
                </CardContent>
              </Card>
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Add a New Service</CardTitle>
                  <CardDescription>Offer other services like Cabs or Packages to travelers.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                   <div className="flex gap-4 mb-4">
                      <Car className="h-10 w-10 text-emerald-400" />
                      <Hiking className="h-10 w-10 text-emerald-400" />
                   </div>
                   <p className="text-gray-400 mb-4 text-center">Expand your offerings beyond stays.</p>
                   <Link to="/add-service">
                    <Button className="bg-emerald-600 hover:bg-emerald-700"><PlusCircle className="mr-2 h-4 w-4" />Add a Service</Button>
                   </Link>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">My Listings</h2>
              {loading ? <p className="text-white">Loading listings...</p> : (
                <>
                  <h3 className="text-xl font-semibold text-gray-300 mb-3">Properties</h3>
                  {properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {properties.map((prop) => (
                        <Card key={prop.id} className="relative glass-effect border-gray-700 overflow-hidden flex flex-col">
                          <div className="absolute top-2 right-2">{getStatusChip(prop.status)}</div>
                          <div className="h-48 bg-slate-800"><img src={prop.images?.[0] || 'https://images.unsplash.com/photo-1644473968199-150d0a098163'} alt={prop.name} className="w-full h-full object-cover" /></div>
                          <CardHeader><CardTitle className="text-white">{prop.name}</CardTitle><CardDescription>{prop.address}</CardDescription></CardHeader>
                          <CardContent className="flex-grow flex flex-col"><p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{prop.description || 'No description.'}</p><Link to={`/manage-property/${prop.id}`}><Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">Manage</Button></Link></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 text-center py-4">No properties added yet.</p>}

                  <h3 className="text-xl font-semibold text-gray-300 mt-8 mb-3">Services</h3>
                  {services.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services.map((service) => (
                        <Card key={service.id} className="relative glass-effect border-gray-700 overflow-hidden flex flex-col">
                           <div className="absolute top-2 right-2">{getStatusChip(service.status)}</div>
                           <CardHeader>
                              <CardTitle className="text-white">{service.data.title || service.definition.name}</CardTitle>
                              <CardDescription>{service.definition.name}</CardDescription>
                           </CardHeader>
                           <CardContent className="flex-grow flex flex-col">
                              <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{service.data.description || 'No description.'}</p>
                              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => toast({title: "🚧 Feature coming soon!"})}>Manage</Button>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 text-center py-4">No services added yet.</p>}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OwnerDashboardPage;