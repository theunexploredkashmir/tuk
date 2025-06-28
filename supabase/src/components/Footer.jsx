import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Mountain className="h-8 w-8 text-emerald-400" />
              <span className="font-display text-xl font-bold gradient-text">
                The Unexplored Kashmir
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover and book unique stays in the heart of Kashmir. A platform for travelers and property owners to connect.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Explore</span>
            <div className="space-y-2">
              <Link to="/rooms" className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors block">Accommodations</Link>
              <Link to="/contact" className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors block">Contact Us</Link>
              <Link to="/register" className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors block">Become a Host</Link>
              <p className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">About Us</p>
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Contact</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-400">+91 194 2501234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-400">support@unexploredkashmir.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400 mt-1" />
                <span className="text-gray-400">
                  Srinagar, Kashmir<br />
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 The Unexplored Kashmir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;