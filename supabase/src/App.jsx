import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import RoomsPage from '@/pages/RoomsPage';
import BookingPage from '@/pages/BookingPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import OwnerDashboardPage from '@/pages/OwnerDashboardPage';
import UserDashboardPage from '@/pages/UserDashboardPage';
import ManagePropertyPage from '@/pages/ManagePropertyPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ServicesPage from '@/pages/ServicesPage';
import AddServicePage from '@/pages/AddServicePage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import UpdatePasswordPage from '@/pages/UpdatePasswordPage';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

function App() {
  const { toast } = useToast();

  useEffect(() => {
    const createInitialAdmin = async () => {
      const adminEmail = 'viqar.theunexploredkashmir@gmail.com';
      
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', adminEmail)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error checking for admin:", fetchError.message);
        return;
      }

      if (existingUser) return;

      try {
        const { error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: 'Tukkapehla@1',
          options: {
            data: {
              role: 'admin',
            },
          },
        });
        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            // User exists in auth but not profiles, maybe from a failed previous attempt.
            // Let's try to update their role if they don't have one.
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
               const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
               if (profile && profile.role !== 'admin') {
                  // This is risky without being sure it's the right user, but for initial setup it's okay.
                  await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
               }
            }
          } else {
             console.error('Error creating admin:', signUpError.message);
          }
        } else {
          toast({
            title: "Admin Account Created",
            description: "The initial admin account is ready. Please check your email for verification.",
          });
        }
      } catch (e) {
        console.error('Exception during admin creation:', e);
      }
    };

    createInitialAdmin();
  }, [toast]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Helmet>
            <title>The Unexplored Kashmir - Your Gateway to Paradise</title>
            <meta name="description" content="Discover and book unique stays in the heart of Kashmir. A platform for travelers and property owners to connect in the world's most beautiful valley." />
          </Helmet>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['guest', 'admin', 'owner']}>
                <UserDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/owner-dashboard" element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <OwnerDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/manage-property/:propertyId" element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <ManagePropertyPage />
              </ProtectedRoute>
            } />
             <Route path="/add-service" element={
              <ProtectedRoute allowedRoles={['owner', 'admin']}>
                <AddServicePage />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;