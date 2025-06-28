import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const AddServicePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [definitions, setDefinitions] = useState([]);
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDefinitions = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('service_definitions').select('*');
      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load service types.' });
      } else {
        setDefinitions(data);
      }
      setLoading(false);
    };
    fetchDefinitions();
  }, [toast]);

  const handleDefinitionChange = (slug) => {
    const definition = definitions.find(d => d.slug === slug);
    setSelectedDefinition(definition);
    setFormData({});
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDefinition || !user) return;
    setIsSubmitting(true);

    const { error } = await supabase.from('services').insert([{
      owner_id: user.id,
      definition_id: selectedDefinition.id,
      data: formData,
      status: 'pending'
    }]);

    if (error) {
      toast({ variant: 'destructive', title: 'Submission Failed', description: error.message });
    } else {
      toast({ title: 'Service Submitted!', description: 'Your new service is pending review.' });
      navigate('/owner-dashboard');
    }
    setIsSubmitting(false);
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.value),
      className: "mt-1 bg-slate-800 border-gray-600 text-white",
      required: field.required,
    };

    switch (field.type) {
      case 'textarea':
        return <Textarea {...commonProps} placeholder={`Enter ${field.label}`} />;
      case 'number':
        return <Input type="number" {...commonProps} placeholder={`Enter ${field.label}`} />;
      case 'text':
      default:
        return <Input type="text" {...commonProps} placeholder={`Enter ${field.label}`} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add a New Service</CardTitle>
                <CardDescription>Select a service type and fill in the details. It will be reviewed before going live.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-white">Loading service types...</p> : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="service-type" className="text-white">Service Type</Label>
                      <Select onValueChange={handleDefinitionChange}>
                        <SelectTrigger id="service-type" className="mt-1 bg-slate-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select a service type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {definitions.map(def => (
                            <SelectItem key={def.id} value={def.slug}>{def.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedDefinition && (
                      <div className="space-y-4 pt-4 border-t border-gray-700">
                        {selectedDefinition.fields.map(field => (
                          <div key={field.name}>
                            <Label htmlFor={field.name} className="text-white">{field.label}</Label>
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedDefinition && (
                      <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        {isSubmitting ? 'Submitting for Review...' : 'Submit for Review'}
                      </Button>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddServicePage;