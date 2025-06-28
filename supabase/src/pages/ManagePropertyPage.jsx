import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BedDouble, PlusCircle, Trash2, Edit, Wifi, Tv, Wind as AirVent, Thermometer, ShowerHead, Car, ImageDown as ImageUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const availableAmenities = [
  { id: 'ac', label: 'AC', icon: AirVent },
  { id: 'heater', label: 'Heater', icon: Thermometer },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'wifi', label: 'Free Wifi', icon: Wifi },
  { id: 'geyser', label: 'Geyser', icon: ShowerHead },
  { id: 'parking', label: 'Free Parking', icon: Car },
];

const ManagePropertyPage = () => {
  const { propertyId } = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', description: '', price: '', guests: '', size: '', amenities: [] });
  const [editingRoom, setEditingRoom] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchPropertyAndRooms = useCallback(async () => {
    setLoading(true);
    const { data: propData, error: propError } = await supabase.from('properties').select('*').eq('id', propertyId).single();
    if (propError) {
      toast({ variant: 'destructive', title: 'Error fetching property', description: propError.message });
      setLoading(false);
      return;
    }
    setProperty(propData);
    const { data: roomData, error: roomError } = await supabase.from('room_types').select('*').eq('property_id', propertyId);
    if (roomError) {
      toast({ variant: 'destructive', title: 'Error fetching rooms', description: roomError.message });
    } else {
      setRoomTypes(roomData);
    }
    setLoading(false);
  }, [propertyId, toast]);

  useEffect(() => {
    fetchPropertyAndRooms();
  }, [fetchPropertyAndRooms]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenityId) => {
    setNewRoom(prev => {
      const amenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities };
    });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.price || !newRoom.guests) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please provide name, price, and guest count.' });
      return;
    }
    setIsAdding(true);
    const { data, error } = await supabase.from('room_types').insert([{ ...newRoom, property_id: propertyId }]).select();
    if (error) {
      toast({ variant: 'destructive', title: 'Error adding room', description: error.message });
    } else {
      setRoomTypes(prev => [...prev, data[0]]);
      setNewRoom({ name: '', description: '', price: '', guests: '', size: '', amenities: [] });
      toast({ title: 'Room Type Added!', description: `${data[0].name} has been added.` });
    }
    setIsAdding(false);
  };
  
  const handleDeleteRoom = async (roomId) => {
    const { error } = await supabase.from('room_types').delete().eq('id', roomId);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting room', description: error.message });
    } else {
      setRoomTypes(prev => prev.filter(room => room.id !== roomId));
      toast({ title: 'Room Type Deleted' });
    }
  };
  
  const openEditDialog = (room) => {
    setEditingRoom({ ...room, amenities: room.amenities || [] });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    const { id, created_at, property_id, ...updateData } = editingRoom;
    const { error } = await supabase.from('room_types').update(updateData).eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error updating room', description: error.message });
    } else {
      fetchPropertyAndRooms();
      toast({ title: 'Room updated!' });
    }
    setIsEditDialogOpen(false);
    setEditingRoom(null);
  };

  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      const files = event.target.files;
      if (!files || files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
  
      let { error: uploadError } = await supabase.storage.from('property-media').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('property-media').getPublicUrl(filePath);

      const existingImages = property.images || [];
      const { error: dbError } = await supabase.from('properties').update({ images: [...existingImages, publicUrl] }).eq('id', propertyId);
      if (dbError) throw dbError;
      
      fetchPropertyAndRooms();
      toast({ title: 'Image uploaded successfully!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading property details...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/owner-dashboard" className="flex items-center text-emerald-400 hover:text-emerald-300 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-display text-4xl font-bold text-white">Manage: <span className="gradient-text">{property?.name}</span></h1>
            <p className="text-gray-400 mt-2">{property?.address}</p>

            <Card className="glass-effect border-gray-700 mt-8">
              <CardHeader><CardTitle className="text-white">Property Media</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                  {(property?.images || []).map(img => <img key={img} src={img} alt={property.name} className="w-full h-32 object-cover rounded-md" />)}
                </div>
                <Label htmlFor="image-upload" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageUp className="mr-2 h-4 w-4" />}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Label>
                <Input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-1">
                <Card className="glass-effect border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Add New Room Type</CardTitle>
                    <CardDescription>Define a new room available at this property.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddRoom} className="space-y-4">
                      <div>
                        <Label htmlFor="room-name" className="text-white">Room Name</Label>
                        <Input id="room-name" name="name" value={newRoom.name} onChange={handleInputChange} placeholder="e.g., Deluxe Suite" className="mt-1 bg-slate-800 border-gray-600 text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label htmlFor="room-price" className="text-white">Price (₹)</Label><Input id="room-price" name="price" type="number" value={newRoom.price} onChange={handleInputChange} placeholder="e.g., 8500" className="mt-1 bg-slate-800 border-gray-600 text-white" /></div>
                        <div><Label htmlFor="room-guests" className="text-white">Guests</Label><Input id="room-guests" name="guests" type="number" value={newRoom.guests} onChange={handleInputChange} placeholder="e.g., 2" className="mt-1 bg-slate-800 border-gray-600 text-white" /></div>
                      </div>
                      <div><Label htmlFor="room-size" className="text-white">Size (sqm)</Label><Input id="room-size" name="size" value={newRoom.size} onChange={handleInputChange} placeholder="e.g., 35 sqm" className="mt-1 bg-slate-800 border-gray-600 text-white" /></div>
                      <div><Label htmlFor="room-description" className="text-white">Description</Label><Textarea id="room-description" name="description" value={newRoom.description} onChange={handleInputChange} placeholder="Describe the room..." className="mt-1 bg-slate-800 border-gray-600 text-white" /></div>
                      <div><Label className="text-white">Amenities</Label><div className="grid grid-cols-2 gap-2 mt-2">{availableAmenities.map(amenity => <div key={amenity.id} className="flex items-center space-x-2"><Checkbox id={`new-${amenity.id}`} checked={newRoom.amenities.includes(amenity.id)} onCheckedChange={() => handleAmenityChange(amenity.id)} /><label htmlFor={`new-${amenity.id}`} className="text-sm text-gray-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{amenity.label}</label></div>)}</div></div>
                      <Button type="submit" disabled={isAdding} className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <PlusCircle className="mr-2 h-4 w-4" />{isAdding ? 'Adding...' : 'Add Room'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-4">Existing Room Types</h2>
                {roomTypes.length > 0 ? (<div className="space-y-4">{roomTypes.map(room => (<Card key={room.id} className="glass-effect border-gray-700 flex items-center justify-between p-4"><div className="flex items-center"><BedDouble className="h-8 w-8 text-emerald-400 mr-4" /><div><p className="font-semibold text-white">{room.name}</p><p className="text-sm text-gray-400">₹{Number(room.price).toLocaleString()}/night - {room.guests} Guests</p></div></div><div className="flex items-center gap-2"><Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => openEditDialog(room)}><Edit className="h-4 w-4" /></Button><Button variant="destructive" size="icon" onClick={() => handleDeleteRoom(room.id)}><Trash2 className="h-4 w-4" /></Button></div></Card>))}</div>) : (<div className="text-center py-16 glass-effect rounded-lg"><h3 className="text-xl font-semibold text-white">No Room Types Added</h3><p className="text-gray-400 mt-2">Use the form on the left to add your first room type.</p></div>)}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-effect text-white">
          <DialogHeader><DialogTitle>Edit Room Type</DialogTitle></DialogHeader>
          {editingRoom && <div className="space-y-4">
            <div><Label htmlFor="edit-room-name">Room Name</Label><Input id="edit-room-name" value={editingRoom.name} onChange={(e) => setEditingRoom(p => ({...p, name: e.target.value}))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="edit-room-price">Price (₹)</Label><Input id="edit-room-price" type="number" value={editingRoom.price} onChange={(e) => setEditingRoom(p => ({...p, price: e.target.value}))} /></div>
              <div><Label htmlFor="edit-room-guests">Guests</Label><Input id="edit-room-guests" type="number" value={editingRoom.guests} onChange={(e) => setEditingRoom(p => ({...p, guests: e.target.value}))} /></div>
            </div>
            <div><Label htmlFor="edit-room-size">Size (sqm)</Label><Input id="edit-room-size" value={editingRoom.size} onChange={(e) => setEditingRoom(p => ({...p, size: e.target.value}))} /></div>
            <div><Label htmlFor="edit-room-description">Description</Label><Textarea id="edit-room-description" value={editingRoom.description} onChange={(e) => setEditingRoom(p => ({...p, description: e.target.value}))} /></div>
            <div><Label>Amenities</Label><div className="grid grid-cols-2 gap-2 mt-2">{availableAmenities.map(amenity => <div key={amenity.id} className="flex items-center space-x-2"><Checkbox id={`edit-${amenity.id}`} checked={editingRoom.amenities.includes(amenity.id)} onCheckedChange={() => setEditingRoom(p => ({...p, amenities: p.amenities.includes(amenity.id) ? p.amenities.filter(id => id !== amenity.id) : [...p.amenities, amenity.id]}))} /><label htmlFor={`edit-${amenity.id}`} className="text-sm font-medium">{amenity.label}</label></div>)}</div></div>
          </div>}
          <DialogFooter><Button onClick={handleUpdateRoom}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ManagePropertyPage;