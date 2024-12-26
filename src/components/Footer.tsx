import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer:React.FC= () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Med-Tech</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Get an expert medical opinion from our world-renowned specialists to make informed decisions about your health with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Find a Doctor</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Book Appointment</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Our Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Latest News</a></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Our Services</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Cardiology</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Pediatrics</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Neurology</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-500 transition-colors">Dental Care</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-cyan-500" />
                <span className="text-gray-600">123 Medical Center Dr, City, ST 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-cyan-500" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-cyan-500" />
                <span className="text-gray-600">contact@medtech.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Med-Tech. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-cyan-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-cyan-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-cyan-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;