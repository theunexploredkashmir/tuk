import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Mountain, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Check your email",
        description: "A password reset link has been sent to your email address.",
      });
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mountain-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md glass-effect border-gray-700">
          <CardHeader className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
              <Mountain className="h-8 w-8 text-emerald-400" />
            </Link>
            <CardTitle className="text-3xl font-bold text-white">Forgot Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center">
                <p className="text-white">If an account with that email exists, you will receive a reset link shortly. Please check your inbox and spam folder.</p>
                <Link to="/login">
                  <Button variant="link" className="text-emerald-400 mt-4">Return to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-slate-800 border-gray-600 text-white"
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                  {loading ? 'Sending...' : <><Send className="mr-2 h-5 w-5" /> Send Reset Link</>}
                </Button>
              </form>
            )}
             <p className="mt-6 text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-emerald-400 hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;