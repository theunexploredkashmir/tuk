import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have administrative privileges to access this panel.",
        });
        logout();
      }
      setLoading(false);
    }
  }, [user, navigate, toast, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mountain-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md glass-effect border-red-500/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-red-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-400">
              Restricted access. Authorized personnel only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-slate-800 border-gray-600 text-white" disabled={loading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 bg-slate-800 border-gray-600 text-white" disabled={loading} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? 'Authenticating...' : <><Shield className="mr-2 h-5 w-5" /> Secure Login</>}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-400">
              Return to <Link to="/" className="font-medium text-emerald-400 hover:underline">homepage</Link>.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;