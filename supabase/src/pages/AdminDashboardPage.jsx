import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Users, CheckCircle, XCircle, Search, ShieldCheck, PlusCircle, Car, Backpack as Hiking, Trash2, Edit } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminDashboardPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [serviceDefinitions, setServiceDefinitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newDefinition, setNewDefinition] = useState({ name: '', slug: '', description: '', fields: [{ name: '', label: '', type: 'text', required: false }] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentTab = searchParams.get('tab') || 'approvals';

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: propData, error: propError } = await supabase.from('properties').select('*, profiles ( email )').eq('status', 'pending');
    if (propError) toast({ variant: 'destructive', title: 'Error fetching properties', description: propError.message });
    else setPendingProperties(propData);

    const { data: serviceData, error: serviceError } = await supabase.from('services').select('*, profiles ( email ), definition:service_definitions(name)').eq('status', 'pending');
    if (serviceError) toast({ variant: 'destructive', title: 'Error fetching services', description: serviceError.message });
    else setPendingServices(serviceData);

    const { data: defData, error: defError } = await supabase.from('service_definitions').select('*');
    if (defError) toast({ variant: 'destructive', title: 'Error fetching service definitions', description: defError.message });
    else setServiceDefinitions(defData);

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentTab]);

  const handleStatusUpdate = async (table, id, newStatus) => {
    const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
    if (error) toast({ variant: 'destructive', title: `Failed to ${newStatus}`, description: error.message });
    else {
      toast({ title: 'Success!', description: `Item has been ${newStatus}.` });
      fetchData();
    }
  };
  
  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!userSearch) return;
    setIsSearching(true);
    const { data, error } = await supabase.from('profiles').select('id, email, role').ilike('email', `%${userSearch}%`);
    if (error) toast({ variant: 'destructive', title: 'Search failed', description: error.message });
    else setFoundUsers(data);
    setIsSearching(false);
  };
  
  const handleRoleChange = async (userId, newRole) => {
    const { error } = await supabase.rpc('update_user_role', { target_user_id: userId, new_role: newRole });
    if (error) toast({ variant: 'destructive', title: 'Role update failed', description: error.message });
    else {
      toast({ title: 'Role Updated!', description: 'The user role has been successfully changed.' });
      setFoundUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleFieldChange = (index, event) => {
    const values = [...newDefinition.fields];
    values[index][event.target.name] = event.target.value;
    setNewDefinition(prev => ({ ...prev, fields: values }));
  };

  const addField = () => setNewDefinition(prev => ({ ...prev, fields: [...prev.fields, { name: '', label: '', type: 'text', required: false }] }));
  const removeField = (index) => setNewDefinition(prev => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }));

  const handleAddDefinition = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.from('service_definitions').insert([newDefinition]);
    if (error) toast({ variant: 'destructive', title: 'Failed to add definition', description: error.message });
    else {
      toast({ title: 'Success!', description: 'New service definition created.' });
      fetchData();
      setNewDefinition({ name: '', slug: '', description: '', fields: [{ name: '', label: '', type: 'text', required: false }] });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-4xl font-bold text-white mb-8">Admin <span className="gradient-text">Control Panel</span></h1>
            <Tabs value={currentTab} onValueChange={(tab) => setSearchParams({ tab })} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="approvals"><CheckCircle className="mr-2 h-4 w-4" />Approvals</TabsTrigger>
                <TabsTrigger value="services"><Car className="mr-2 h-4 w-4" />Service Definitions</TabsTrigger>
                <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />User Management</TabsTrigger>
              </TabsList>
              <TabsContent value="approvals">
                <Card className="glass-effect border-gray-700">
                  <CardHeader><CardTitle className="text-white">Pending Approvals</CardTitle><CardDescription>Review and approve new submissions.</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">Properties ({pendingProperties.length})</h3>
                      {loading ? <p className="text-white">Loading...</p> : pendingProperties.length > 0 ? pendingProperties.map(prop => (
                        <div key={prop.id} className="p-4 rounded-lg bg-slate-800/50 flex items-center justify-between mb-2">
                          <div><p className="font-semibold text-white">{prop.name}</p><p className="text-sm text-gray-400">{prop.address} | by {prop.profiles.email}</p></div>
                          <div className="flex gap-2"><Button size="sm" variant="outline" className="text-emerald-400 border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300" onClick={() => handleStatusUpdate('properties', prop.id, 'approved')}><CheckCircle className="h-4 w-4 mr-2" />Approve</Button><Button size="sm" variant="outline" className="text-red-400 border-red-400/50 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleStatusUpdate('properties', prop.id, 'rejected')}><XCircle className="h-4 w-4 mr-2" />Reject</Button></div>
                        </div>
                      )) : <p className="text-center text-gray-400 py-4">No pending properties.</p>}
                    </div>
                     <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">Services ({pendingServices.length})</h3>
                      {loading ? <p className="text-white">Loading...</p> : pendingServices.length > 0 ? pendingServices.map(service => (
                        <div key={service.id} className="p-4 rounded-lg bg-slate-800/50 flex items-center justify-between mb-2">
                          <div><p className="font-semibold text-white">{service.data.title || service.definition.name}</p><p className="text-sm text-gray-400">{service.definition.name} | by {service.profiles.email}</p></div>
                          <div className="flex gap-2"><Button size="sm" variant="outline" className="text-emerald-400 border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300" onClick={() => handleStatusUpdate('services', service.id, 'approved')}><CheckCircle className="h-4 w-4 mr-2" />Approve</Button><Button size="sm" variant="outline" className="text-red-400 border-red-400/50 hover:bg-red-500/10 hover:text-red-300" onClick={() => handleStatusUpdate('services', service.id, 'rejected')}><XCircle className="h-4 w-4 mr-2" />Reject</Button></div>
                        </div>
                      )) : <p className="text-center text-gray-400 py-4">No pending services.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="services">
                <Card className="glass-effect border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle className="text-white">Service Definitions</CardTitle><CardDescription>Define the types of services hosts can offer.</CardDescription></div>
                    <Dialog>
                      <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Add Definition</Button></DialogTrigger>
                      <DialogContent className="glass-effect text-white max-w-2xl">
                        <DialogHeader><DialogTitle>New Service Definition</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label>Name</Label><Input value={newDefinition.name} onChange={e => setNewDefinition(p => ({...p, name: e.target.value}))} placeholder="e.g., Cab Service" /></div>
                            <div><Label>Slug</Label><Input value={newDefinition.slug} onChange={e => setNewDefinition(p => ({...p, slug: e.target.value}))} placeholder="e.g., cab-service" /></div>
                          </div>
                          <div><Label>Description</Label><Textarea value={newDefinition.description} onChange={e => setNewDefinition(p => ({...p, description: e.target.value}))} placeholder="Briefly describe this service type" /></div>
                          <div>
                            <Label>Fields</Label>
                            {newDefinition.fields.map((field, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 my-1 bg-slate-800/50 rounded-md">
                                <Input name="name" value={field.name} onChange={e => handleFieldChange(index, e)} placeholder="Field Name (e.g. vehicle_type)" className="flex-1" />
                                <Input name="label" value={field.label} onChange={e => handleFieldChange(index, e)} placeholder="Label (e.g. Vehicle Type)" className="flex-1" />
                                <Select name="type" value={field.type} onValueChange={v => handleFieldChange(index, {target: {name: 'type', value: v}})}>
                                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                                  <SelectContent><SelectItem value="text">Text</SelectItem><SelectItem value="number">Number</SelectItem><SelectItem value="textarea">Textarea</SelectItem></SelectContent>
                                </Select>
                                <Button variant="destructive" size="icon" onClick={() => removeField(index)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addField} className="mt-2">Add Field</Button>
                          </div>
                        </div>
                        <DialogFooter><Button onClick={handleAddDefinition} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Definition'}</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {loading ? <p>Loading...</p> : serviceDefinitions.map(def => (
                      <div key={def.id} className="p-4 rounded-lg bg-slate-800/50 flex items-center justify-between mb-2">
                        <div><p className="font-semibold text-white">{def.name}</p><p className="text-sm text-gray-400">{def.slug}</p></div>
                        <Button variant="ghost" size="icon" onClick={() => toast({title: "🚧 Feature coming soon!"})}><Edit className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="users">
                <Card className="glass-effect border-gray-700">
                  <CardHeader><CardTitle className="text-white">Manage User Roles</CardTitle><CardDescription>Search for a user by email to change their role.</CardDescription></CardHeader>
                  <CardContent>
                    <form onSubmit={handleUserSearch} className="flex gap-2 mb-6">
                      <Input placeholder="user@example.com" value={userSearch} onChange={e => setUserSearch(e.target.value)} className="bg-slate-800 border-gray-600 text-white" />
                      <Button type="submit" disabled={isSearching}>{isSearching ? 'Searching...' : <Search className="h-4 w-4" />}</Button>
                    </form>
                    <div className="space-y-4">
                      {foundUsers.length > 0 ? foundUsers.map(user => (
                        <div key={user.id} className="p-4 rounded-lg bg-slate-800/50 flex items-center justify-between">
                          <div><p className="font-semibold text-white">{user.email}</p><p className="text-sm text-gray-400 capitalize">Current Role: {user.role}</p></div>
                          <div className="w-40">
                            <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="guest">Guest</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )) : <p className="text-center text-gray-400 py-8">Search for a user to begin.</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;